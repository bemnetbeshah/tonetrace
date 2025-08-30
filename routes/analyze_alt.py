from fastapi import APIRouter
from pydantic import BaseModel
import time
from analyzers.style_metrics_alt import compute_formality, compute_complexity
from analyzers.tone import classify_tone_model
from analyzers.sentiment import analyze_sentiment
from analyzers.passive_voice_alt import detect_passive_sentences
from analyzers.lexical import compute_lexical_diversity
from analyzers.lexical_richness import analyze_lexical_richness
from analyzers.hedging import detect_hedging
from analyzers.anomaly import detect_anomaly
from analyzers.grammar import analyze_grammar
from analyzers.readability import analyze_readability, get_readability_interpretation
from style_profile_module import StyleProfile
from services.database import get_student_profile, save_student_profile, create_default_profile
from services.analysis_storage import store_analysis_results

router = APIRouter()

class AnalyzeRequest(BaseModel):
    text: str
    student_id: str = "default"  # Default student ID for now

@router.post("/analyze")
async def analyze_text(payload: AnalyzeRequest):
    text = payload.text
    student_id = payload.student_id

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
    submission_id = await store_analysis_results(text, student_id, all_results)
    
    # Create current style profile from analysis results
    current_profile = StyleProfile()
    
    # Update profile with analysis results
    analysis_data = {
        "formality": formality_result.get("score", 0),
        "complexity": complexity_result.get("score", 0),
        "tone": tone_result.get("score", 0),
        "sentiment": sentiment_result.get("score", 0),
        "passive_voice": passive_analysis.get("score", 0),
        "lexical_diversity": lexical_diversity.get("score", 0),
        "hedging": hedging_analysis.get("score", 0),
        "readability": readability_analysis.get("flesch_kincaid_grade", 0),
        "grammar": grammar_analysis.get("score", 0),
        "lexical_richness": lexical_richness_analysis.get("score", 0)
    }
    
    current_profile.update_profile(analysis_data)
    
    # Get or create student profile
    student_profile = await get_student_profile(student_id)
    if not student_profile:
        student_profile = await create_default_profile(student_id)
    
    # Update student profile with current analysis
    student_profile.update_profile(analysis_data)
    await save_student_profile(student_id, student_profile)
    
    # Detect anomalies
    anomaly_result = detect_anomaly(student_profile, current_profile)
    
    # Prepare final response
    response = {
        "submission_id": submission_id,
        "analysis_time_ms": total_time,
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
        "anomaly": anomaly_result.get("is_anomaly", False),
        "anomaly_reasons": anomaly_result.get("reasons", []),
        "anomaly_details": anomaly_result.get("details", {})
    }
    
    return response

@router.get("/health")
async def health_check():
    return {"status": "healthy", "message": "Alternative analyzer service is running"}
