"""
Lightweight Analysis Routes for ToneTrace API

This module provides analysis endpoints using lightweight NLP libraries
optimized for Render's free tier memory constraints.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
import sys
import os

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Lazy imports to prevent initialization crashes
# Import analyzers only when needed, not at module load time
def _get_analyzers():
    """Lazy import analyzers to avoid initialization crashes"""
    from analyzers.style_metrics_lightweight import compute_formality, compute_complexity
    from analyzers.lexical_richness_lightweight import analyze_lexical_richness
    from analyzers.tone_lightweight import classify_tone_model
    from analyzers.passive_voice_lightweight import detect_passive_sentences
    from analyzers.grammar_lightweight import analyze_grammar
    from analyzers.readability import analyze_readability
    from analyzers.sentiment import analyze_sentiment
    return {
        'compute_formality': compute_formality,
        'compute_complexity': compute_complexity,
        'analyze_lexical_richness': analyze_lexical_richness,
        'classify_tone_model': classify_tone_model,
        'detect_passive_sentences': detect_passive_sentences,
        'analyze_grammar': analyze_grammar,
        'analyze_readability': analyze_readability,
        'analyze_sentiment': analyze_sentiment
    }

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
        
        # Lazy load analyzers (only when endpoint is called)
        analyzers = _get_analyzers()
        
        # Perform lightweight analysis
        analysis = {}
        
        # Style metrics
        analysis['formality'] = analyzers['compute_formality'](text)
        analysis['complexity'] = analyzers['compute_complexity'](text)
        
        # Lexical richness
        analysis['lexical_richness'] = analyzers['analyze_lexical_richness'](text)
        
        # Tone analysis
        analysis['tone'] = analyzers['classify_tone_model'](text)
        
        # Passive voice
        analysis['passive_voice'] = analyzers['detect_passive_sentences'](text)
        
        # Grammar analysis
        analysis['grammar'] = analyzers['analyze_grammar'](text)
        
        # Readability
        analysis['readability'] = analyzers['analyze_readability'](text)
        
        # Sentiment
        analysis['sentiment'] = analyzers['analyze_sentiment'](text)
        
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
        
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        import traceback
        error_detail = f"Analysis failed: {str(e)}\n{traceback.format_exc()}"
        raise HTTPException(status_code=500, detail=error_detail)

