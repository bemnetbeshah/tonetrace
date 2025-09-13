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
from analyzers.anomaly import detect_anomaly
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
    """
    start_time = time.time()
    
    try:
        # Run all analyzers
        results = {
            "formality": compute_formality(request.text),
            "complexity": compute_complexity(request.text),
            "tone": classify_tone_model(request.text),
            "sentiment": analyze_sentiment(request.text),
            "passive_analysis": detect_passive_sentences(request.text),
            "lexical_diversity": compute_lexical_diversity(request.text),
            "lexical_richness": analyze_lexical_richness(request.text),
            "hedging": detect_hedging(request.text),
            "anomaly": detect_anomaly(request.text),
            "grammar": analyze_grammar(request.text),
            "readability": analyze_readability(request.text)
        }
        
        # Add metadata
        processing_time = time.time() - start_time
        results["metadata"] = {
            "processing_time": round(processing_time, 3),
            "text_length": len(request.text),
            "student_id": request.student_id,
            "analyzer_version": "lightweight"
        }
        
        return results
        
    except Exception as e:
        return {
            "error": str(e),
            "metadata": {
                "processing_time": round(time.time() - start_time, 3),
                "text_length": len(request.text),
                "student_id": request.student_id,
                "analyzer_version": "lightweight"
            }
        }
