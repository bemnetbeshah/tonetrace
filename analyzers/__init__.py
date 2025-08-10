"""
Standardized response schema for all analyzers.

All analyzers should return a dictionary with the following structure:
{
    "score": <float or null>,          // single headline score if applicable
    "bucket": "<string|null>",         // e.g., "positive", "complex"
    "raw": {...},                      // analyzer-specific details (full output)
    "confidence": <float|null>,
    "details": {...}                   // optional normalized sub-metrics
}
"""

from typing import Dict, Any, List, Union

def create_standard_response(
    score: Union[float, None] = None,
    bucket: Union[str, None] = None,
    raw: Dict[str, Any] = None,
    confidence: Union[float, None] = None,
    details: Dict[str, Any] = None
) -> Dict[str, Any]:
    """
    Creates a standardized response for all analyzers.
    
    Args:
        score: Primary metric score (can be null if not applicable)
        bucket: Categorical classification (can be null if not applicable)
        raw: Analyzer-specific details (full output)
        confidence: Confidence in the analysis (0.0 to 1.0, can be null)
        details: Additional normalized sub-metrics
    
    Returns:
        Standardized response dictionary
    """
    return {
        "score": round(score, 3) if score is not None else None,
        "bucket": bucket,
        "raw": raw or {},
        "confidence": round(confidence, 3) if confidence is not None else None,
        "details": details or {}
    }
