from fastapi import APIRouter
from pydantic import BaseModel
from analyzers.style_metrics import compute_formality, compute_complexity
from analyzers.tone import classify_tone_model
from analyzers.sentiment import analyze_sentiment
from analyzers.passive_voice import detect_passive_sentences
from analyzers.lexical import compute_lexical_diversity
from analyzers.hedging import detect_hedging
from analyzers.anomaly import detect_anomaly
from style_profile_module import StyleProfile
from services.database import get_user_profile, save_user_profile, create_default_profile

router = APIRouter()

class AnalyzeRequest(BaseModel):
    text: str
    user_id: str = "default"  # Default user ID for now

@router.post("/analyze")
async def analyze_text(payload: AnalyzeRequest):
    text = payload.text
    user_id = payload.user_id

    # Run all analyses
    formality_result = compute_formality(text)
    complexity_result = compute_complexity(text)
    tone_result = classify_tone_model(text)
    sentiment_result = analyze_sentiment(text)
    passive_analysis = detect_passive_sentences(text)
    lexical_diversity = compute_lexical_diversity(text)
    hedging_analysis = detect_hedging(text)
    
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
        "hedging_count": hedging_analysis.get("score", 0)
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
        "formality": formality_result,
        "complexity": complexity_result,
        "tone": tone_result,
        "sentiment": sentiment_result,
        "passive_voice": passive_analysis,
        "lexical_diversity": lexical_diversity,
        "hedging": hedging_analysis,
        "anomaly": anomaly_result["anomaly"],
        "anomaly_reasons": anomaly_result["anomaly_reasons"],
        "anomaly_details": anomaly_result["details"]
    }

