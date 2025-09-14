from fastapi import APIRouter
from pydantic import BaseModel
import time
from analyzers.style_metrics_lightweight import compute_formality, compute_complexity
from analyzers.tone_lightweight import classify_tone_model
from analyzers.sentiment import analyze_sentiment
from analyzers.passive_voice_lightweight import detect_passive_sentences
from analyzers.lexical import compute_lexical_diversity
from analyzers.lexical_richness_lightweight import analyze_lexical_richness
from analyzers.hedging import detect_hedging
from analyzers.grammar_lightweight import analyze_grammar
from analyzers.readability import analyze_readability

router = APIRouter()

class AnalysisRequest(BaseModel):
    text: str
    student_id: str = None

@router.post("/analyze")
def analyze_text(request: AnalysisRequest):
    """
    Analyzes student writing using lightweight analyzers optimized for Render free tier.
    Returns the same format as the regular analyze endpoint for frontend compatibility.
    """
    start_time = time.time()
    
    try:
        # Run all analyzers
        formality_result = compute_formality(request.text)
        complexity_result = compute_complexity(request.text)
        tone_result = classify_tone_model(request.text)
        sentiment_result = analyze_sentiment(request.text)
        passive_analysis = detect_passive_sentences(request.text)
        lexical_diversity = compute_lexical_diversity(request.text)
        lexical_richness_analysis = analyze_lexical_richness(request.text)
        hedging_analysis = detect_hedging(request.text)
        grammar_analysis = analyze_grammar(request.text)
        readability_analysis = analyze_readability(request.text)
        
        # Create a simple anomaly detection (lightweight version)
        # For now, return no anomaly to avoid numpy dependency
        anomaly_result = {
            "anomaly": 0.0,
            "anomaly_reasons": [],
            "details": {"message": "Anomaly detection disabled in lightweight mode"}
        }
        
        # Add timing information to results
        total_time = int((time.time() - start_time) * 1000)  # Convert to milliseconds
        
        # Return the same format as the regular analyze endpoint
        return {
            "submission_id": f"manual_{int(time.time())}",  # Simple ID for manual analysis
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
        
    except Exception as e:
        # Return error in the same format
        return {
            "error": str(e),
            "submission_id": f"error_{int(time.time())}",
            "total_analysis_time_ms": int((time.time() - start_time) * 1000),
            "formality": {"score": 0, "bucket": "error", "error": str(e)},
            "complexity": {"score": 0, "bucket": "error", "error": str(e)},
            "tone": {"score": 0, "bucket": "error", "error": str(e)},
            "sentiment": {"score": 0, "bucket": "error", "error": str(e)},
            "passive_voice": {"score": 0, "bucket": "error", "error": str(e)},
            "lexical_diversity": {"score": 0, "bucket": "error", "error": str(e)},
            "hedging": {"score": 0, "bucket": "error", "error": str(e)},
            "readability": {"score": 0, "bucket": "error", "error": str(e)},
            "grammar": {"score": 0, "bucket": "error", "error": str(e)},
            "lexical_richness": {"score": 0, "bucket": "error", "error": str(e)},
            "anomaly": 0.0,
            "anomaly_reasons": [f"Analysis failed: {str(e)}"],
            "anomaly_details": {"error": str(e)}
        }
