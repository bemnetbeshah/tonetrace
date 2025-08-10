from fastapi import APIRouter
from pydantic import BaseModel
import time
from analyzers.style_metrics import compute_formality, compute_complexity
from analyzers.tone import classify_tone_model
from analyzers.sentiment import analyze_sentiment
from analyzers.passive_voice import detect_passive_sentences
from analyzers.lexical import compute_lexical_diversity
from analyzers.lexical_richness import analyze_lexical_richness
from analyzers.hedging import detect_hedging
from analyzers.anomaly import detect_anomaly
from analyzers.grammar import analyze_grammar
from analyzers.readability import analyze_readability, get_readability_interpretation
from style_profile_module import StyleProfile
from services.database import get_user_profile, save_user_profile, create_default_profile
from services.analysis_storage import store_analysis_results

router = APIRouter()

class AnalyzeRequest(BaseModel):
    text: str
    user_id: str = "default"  # Default user ID for now

@router.post("/analyze")
async def analyze_text(payload: AnalyzeRequest):
    text = payload.text
    user_id = payload.user_id

    # Run all analyses with timing
    start_time = time.time()
    
    formality_result = compute_formality(text)
    complexity_result = compute_complexity(text)
    tone_result = classify_tone_model(text)
    sentiment_result = analyze_sentiment(text)
    passive_analysis = detect_passive_sentences(text)
    lexical_diversity = compute_lexical_diversity(text)
    hedging_analysis = detect_hedging(text)
    readability_analysis = analyze_readability(text)
    grammar_analysis = analyze_grammar(text)
    lexical_richness_analysis = analyze_lexical_richness(text)
    
    # Add timing information to results
    total_time = int((time.time() - start_time) * 1000)  # Convert to milliseconds
    
    # Prepare all analysis results for storage
    all_results = {
        "formality": formality_result,
        "complexity": complexity_result,
        "tone": tone_result,
        "sentiment": sentiment_result,
        "passive_voice": passive_analysis,
        "lexical_diversity": lexical_diversity,
        "hedging": hedging_analysis,
        "readability": readability_analysis,
        "grammar": grammar_analysis,
        "lexical_richness": lexical_richness_analysis
    }
    
    # Store all analysis results in the database
    submission_id = await store_analysis_results(text, user_id, all_results)
    
    # Create current style profile from analysis results
    current_profile = StyleProfile()
    
    # Update profile with analysis results
    analysis_data = {
        "tone": tone_result.get("bucket"),
        "sentiment": {"polarity": sentiment_result.get("score", 0)},
        "formality": {"flesch_kincaid_grade": formality_result.get("details", {}).get("flesch_kincaid_grade", 0)},
        "complexity": {
            "sentence_length": complexity_result.get("details", {}).get("average_sentence_length", 0),
            "lexical_density": complexity_result.get("details", {}).get("lexical_density", 0)
        },
        "passive_voice": {"passive_sentence_ratio": passive_analysis.get("score", 0)},
        "lexical_diversity": lexical_diversity.get("score", 0),
        "hedging_count": hedging_analysis.get("score", 0),
        "readability": {
            "flesch_kincaid_grade": readability_analysis.get("flesch_kincaid_grade", 0),
            "smog_index": readability_analysis.get("smog_index", 0),
            "gunning_fog": readability_analysis.get("gunning_fog", 0),
            "dale_chall_score": readability_analysis.get("dale_chall_score", 0)
        },
        "grammar": {
            "num_errors": grammar_analysis.get("raw", {}).get("num_errors", 0),
            "error": grammar_analysis.get("raw", {}).get("errors", [])
        },
        "lexical_richness": lexical_richness_analysis.get("score", 0)
    }
    
    # Update the current profile with this analysis
    from style_profile_module.update import update_style_profile
    current_profile = update_style_profile(current_profile, analysis_data)
    
    # Get baseline profile from database
    baseline_profile = get_user_profile(user_id)
    if not baseline_profile:
        # Create default profile if none exists
        baseline_profile = create_default_profile()
        save_user_profile(user_id, baseline_profile)
    
    # Run anomaly detection
    anomaly_result = detect_anomaly(current_profile, baseline_profile)
    
    # Save updated profile to database
    save_user_profile(user_id, current_profile)
    
    return {
        "submission_id": submission_id,
        "total_analysis_time_ms": total_time,
        "formality": formality_result,
        "complexity": complexity_result,
        "tone": tone_result,
        "sentiment": sentiment_result,
        "passive_voice": passive_analysis,
        "lexical_diversity": lexical_diversity,
        "hedging": hedging_analysis,
        "readability": readability_analysis,
        "grammar": grammar_analysis,
        "lexical_richness": lexical_richness_analysis,
        "anomaly": anomaly_result["anomaly"],
        "anomaly_reasons": anomaly_result["anomaly_reasons"],
        "anomaly_details": anomaly_result["details"]
    }


class GrammarInput(BaseModel):
    text: str

@router.post("/analyze/grammar")
def grammar_endpoint(input: GrammarInput):
    return analyze_grammar(input.text)

@router.post("/analyze/readability")
def readability_endpoint(input: GrammarInput):
    """
    Analyze text readability using multiple academic scoring methods.
    
    Returns:
        dict: Readability scores and educational interpretations
    """
    scores = analyze_readability(input.text)
    interpretations = get_readability_interpretation(scores)
    
    return {
        "scores": scores,
        "interpretations": interpretations
    }

@router.post("/analyze/lexical-richness")
def lexical_richness_endpoint(input: GrammarInput):
    """
    Analyze lexical richness using word frequency scores (Zipf scale).
    
    Returns:
        dict: Lexical richness metrics including average Zipf score, 
              percentage of rare words, and vocabulary sophistication
    """
    return analyze_lexical_richness(input.text)

@router.get("/analyze/history/{user_id}")
async def get_analysis_history(user_id: str, limit: int = 10):
    """
    Retrieve analysis history for a user.
    
    Args:
        user_id: The user identifier
        limit: Maximum number of submissions to return (default: 10)
        
    Returns:
        List of analysis submissions with results
    """
    from services.analysis_storage import get_analysis_history
    return await get_analysis_history(user_id, limit)

