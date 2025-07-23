from fastapi import APIRouter
from pydantic import BaseModel
from analyzers.style_metrics import compute_formality, compute_complexity
from analyzers.tone import classify_tone
from analyzers.sentiment import analyze_sentiment
from analyzers.passive_voice import detect_passive_sentences

router = APIRouter()

class AnalyzeRequest(BaseModel):
    text: str

@router.post("/analyze")
async def analyze_text(payload: AnalyzeRequest):
    text = payload.text

    formality_result = compute_formality(text)
    complexity_result = compute_complexity(text)
    tone_result = classify_tone(text)
    sentiment_result = analyze_sentiment(text)
    passive_analysis = detect_passive_sentences(text)

    return {
        "formality": formality_result,
        "complexity": complexity_result,
        "tone": tone_result,
        "sentiment": sentiment_result,
        "passive_voice": passive_analysis
    }

