"""
Lightweight Analysis Routes for ToneTrace API

This module provides analysis endpoints using lightweight NLP libraries
optimized for Render's free tier memory constraints.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, List
import sys
import os

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from analyzers.style_metrics_lightweight import analyze_formality_lightweight, analyze_complexity_lightweight
from analyzers.lexical_richness_lightweight import analyze_lexical_richness_lightweight
from analyzers.tone_lightweight import analyze_tone_lightweight
from analyzers.passive_voice_lightweight import analyze_passive_voice_lightweight
from analyzers.grammar_lightweight import analyze_grammar_lightweight
from analyzers.readability import analyze_readability
from analyzers.sentiment import analyze_sentiment

router = APIRouter()

class TextAnalysisRequest(BaseModel):
    text: str
    student_id: str = None
    assignment_id: str = None

class AnalysisResponse(BaseModel):
    text: str
    analysis: Dict[str, Any]
    metadata: Dict[str, Any] = {}

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_text(request: TextAnalysisRequest):
    """
    Analyze student text using lightweight NLP libraries.
    
    This endpoint provides comprehensive writing analysis including:
    - Formality and complexity metrics
    - Lexical richness analysis
    - Tone classification
    - Passive voice detection
    - Grammar issue identification
    - Readability scores
    - Sentiment analysis
    """
    try:
        text = request.text.strip()
        
        if not text:
            raise HTTPException(status_code=400, detail="Text cannot be empty")
        
        # Perform lightweight analysis
        analysis = {}
        
        # Style metrics
        analysis['formality'] = analyze_formality_lightweight(text)
        analysis['complexity'] = analyze_complexity_lightweight(text)
        
        # Lexical richness
        analysis['lexical_richness'] = analyze_lexical_richness_lightweight(text)
        
        # Tone analysis
        analysis['tone'] = analyze_tone_lightweight(text)
        
        # Passive voice
        analysis['passive_voice'] = analyze_passive_voice_lightweight(text)
        
        # Grammar analysis
        analysis['grammar'] = analyze_grammar_lightweight(text)
        
        # Readability
        analysis['readability'] = analyze_readability(text)
        
        # Sentiment
        analysis['sentiment'] = analyze_sentiment(text)
        
        # Metadata
        metadata = {
            'text_length': len(text),
            'word_count': len(text.split()),
            'analysis_version': 'lightweight',
            'student_id': request.student_id,
            'assignment_id': request.assignment_id
        }
        
        return AnalysisResponse(
            text=text,
            analysis=analysis,
            metadata=metadata
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@router.post("/analyze/batch")
async def analyze_batch_texts(requests: List[TextAnalysisRequest]):
    """
    Analyze multiple texts in batch.
    
    Useful for processing multiple student submissions efficiently.
    """
    try:
        results = []
        
        for request in requests:
            result = await analyze_text(request)
            results.append(result)
        
        return {
            "results": results,
            "total_analyzed": len(results),
            "batch_analysis_version": "lightweight"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Batch analysis failed: {str(e)}")

@router.get("/health")
async def health_check():
    """Health check endpoint for the analysis service."""
    return {
        "status": "healthy",
        "service": "analysis-lightweight",
        "version": "1.0.0"
    }
