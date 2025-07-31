"""
Standardized response schema for all analyzers.

All analyzers should return a dictionary with the following structure:
{
    "score": float,           # Primary metric score (0.0 to 1.0 or appropriate range)
    "bucket": str,            # Categorical classification
    "raw_emotions": list,     # Detailed breakdown or additional data
    "confidence": float,      # Confidence in the analysis (0.0 to 1.0)
    "details": dict           # Additional metrics and breakdowns
}
"""

from typing import Dict, Any, List, Union

def create_standard_response(
    score: float,
    bucket: str,
    raw_emotions: List[Dict[str, Any]] = None,
    confidence: float = 1.0,
    details: Dict[str, Any] = None
) -> Dict[str, Any]:
    """
    Creates a standardized response for all analyzers.
    
    Args:
        score: Primary metric score
        bucket: Categorical classification
        raw_emotions: List of detailed emotions or breakdown data
        confidence: Confidence in the analysis (0.0 to 1.0)
        details: Additional metrics and breakdowns
    
    Returns:
        Standardized response dictionary
    """
    return {
        "score": round(score, 3),
        "bucket": bucket,
        "raw_emotions": raw_emotions or [],
        "confidence": round(confidence, 3),
        "details": details or {}
    }
