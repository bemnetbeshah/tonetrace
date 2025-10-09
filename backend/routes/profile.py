from fastapi import APIRouter, HTTPException, Query
from typing import Dict, Any, Optional
import logging
from services import get_student_profile, create_default_profile
from services.historical_data import (
    get_sentiment_history,
    get_formality_trends,
    get_lexical_diversity_history,
    get_readability_history,
    get_grammar_error_trends,
    get_tone_distribution_over_time,
    get_performance_metrics
)
from style_profile_module import StyleProfile

# Configure logging
logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/profile/{student_id}")
def get_student_style_profile(student_id: str) -> Dict[str, Any]:
    """
    Get a student's style profile by their student ID.
    
    Args:
        student_id: The unique identifier for the student
        
    Returns:
        Dictionary containing the student's style profile or a default profile
    """
    logger.info(f"Profile request received for student: {student_id}")
    
    try:
        # Try to get the student's profile from the database
        profile = get_student_profile(student_id)
        
        if profile is None:
            # Create a default profile if none exists
            logger.info(f"No profile found for student {student_id}, returning default profile")
            profile = create_default_profile()
            
            return {
                "student_id": student_id,
                "profile": profile.to_dict(),
                "message": "Default profile created - no existing profile found",
                "is_default": True
            }
        
        # Return the existing profile
        logger.info(f"Returning existing profile for student {student_id}")
        return {
            "student_id": student_id,
            "profile": profile.to_dict(),
            "message": "Profile retrieved successfully",
            "is_default": False
        }
        
    except Exception as e:
        logger.error(f"Error retrieving profile for student {student_id}: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error while retrieving profile for student {student_id}"
        )

@router.get("/profile/{student_id}/history/sentiment")
async def get_student_sentiment_history(
    student_id: str,
    limit: int = Query(50, ge=1, le=200, description="Maximum number of results to return")
) -> Dict[str, Any]:
    """
    Get sentiment analysis history for a student.
    
    Args:
        student_id: The student identifier
        limit: Maximum number of results to return (1-200)
        
    Returns:
        List of sentiment scores with timestamps
    """
    try:
        history = await get_sentiment_history(student_id, limit)
        return {
            "student_id": student_id,
            "metric": "sentiment",
            "history": history,
            "total_entries": len(history)
        }
    except Exception as e:
        logger.error(f"Error retrieving sentiment history for student {student_id}: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error while retrieving sentiment history"
        )

@router.get("/profile/{student_id}/history/formality")
async def get_student_formality_trends(
    student_id: str,
    days: int = Query(30, ge=1, le=365, description="Number of days to look back")
) -> Dict[str, Any]:
    """
    Get formality score trends for a student over time.
    
    Args:
        student_id: The student identifier
        days: Number of days to look back (1-365)
        
    Returns:
        List of formality scores with timestamps
    """
    try:
        trends = await get_formality_trends(student_id, days)
        return {
            "student_id": student_id,
            "metric": "formality",
            "days_lookback": days,
            "trends": trends,
            "total_entries": len(trends)
        }
    except Exception as e:
        logger.error(f"Error retrieving formality trends for student {student_id}: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error while retrieving formality trends"
        )

@router.get("/profile/{student_id}/history/lexical-diversity")
async def get_student_lexical_diversity_history(
    student_id: str,
    limit: int = Query(50, ge=1, le=200, description="Maximum number of results to return")
) -> Dict[str, Any]:
    """
    Get lexical diversity analysis history for a student.
    
    Args:
        student_id: The student identifier
        limit: Maximum number of results to return (1-200)
        
    Returns:
        List of lexical diversity scores with timestamps
    """
    try:
        history = await get_lexical_diversity_history(student_id, limit)
        return {
            "student_id": student_id,
            "metric": "lexical_diversity",
            "history": history,
            "total_entries": len(history)
        }
    except Exception as e:
        logger.error(f"Error retrieving lexical diversity history for student {student_id}: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error while retrieving lexical diversity history"
        )

@router.get("/profile/{student_id}/history/readability")
async def get_student_readability_history(
    student_id: str,
    metric: str = Query("flesch_kincaid_grade", description="Readability metric to retrieve"),
    limit: int = Query(50, ge=1, le=200, description="Maximum number of results to return")
) -> Dict[str, Any]:
    """
    Get readability analysis history for a student.
    
    Args:
        student_id: The student identifier
        metric: Readability metric (flesch_kincaid_grade, smog_index, gunning_fog, dale_chall_score)
        limit: Maximum number of results to return (1-200)
        
    Returns:
        List of readability scores with timestamps
    """
    try:
        history = await get_readability_history(student_id, metric, limit)
        return {
            "student_id": student_id,
            "metric": metric,
            "history": history,
            "total_entries": len(history)
        }
    except Exception as e:
        logger.error(f"Error retrieving readability history for student {student_id}: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error while retrieving readability history"
        )

@router.get("/profile/{student_id}/history/grammar")
async def get_student_grammar_error_trends(
    student_id: str,
    days: int = Query(30, ge=1, le=365, description="Number of days to look back")
) -> Dict[str, Any]:
    """
    Get grammar error count trends for a student over time.
    
    Args:
        student_id: The student identifier
        days: Number of days to look back (1-365)
        
    Returns:
        List of grammar error counts with timestamps
    """
    try:
        trends = await get_grammar_error_trends(student_id, days)
        return {
            "student_id": student_id,
            "metric": "grammar",
            "days_lookback": days,
            "trends": trends,
            "total_entries": len(trends)
        }
    except Exception as e:
        logger.error(f"Error retrieving grammar error trends for student {student_id}: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error while retrieving grammar error trends"
        )

@router.get("/profile/{student_id}/history/tone")
async def get_student_tone_distribution(
    student_id: str,
    days: int = Query(30, ge=1, le=365, description="Number of days to look back")
) -> Dict[str, Any]:
    """
    Get tone distribution over time for a student.
    
    Args:
        student_id: The student identifier
        days: Number of days to look back (1-365)
        
    Returns:
        Dictionary with tone types as keys and lists of submissions as values
    """
    try:
        distribution = await get_tone_distribution_over_time(student_id, days)
        return {
            "student_id": student_id,
            "metric": "tone_distribution",
            "days_lookback": days,
            "distribution": distribution,
            "total_tone_types": len(distribution)
        }
    except Exception as e:
        logger.error(f"Error retrieving tone distribution for student {student_id}: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error while retrieving tone distribution"
        )

@router.get("/profile/{student_id}/performance")
async def get_student_performance_metrics(
    student_id: str,
    days: int = Query(30, ge=1, le=365, description="Number of days to look back")
) -> Dict[str, Any]:
    """
    Get performance metrics for a student's analysis history.
    
    Args:
        student_id: The student identifier
        days: Number of days to look back (1-365)
        
    Returns:
        Dictionary with performance metrics by analyzer
    """
    try:
        metrics = await get_performance_metrics(student_id, days)
        return {
            "student_id": student_id,
            "days_lookback": days,
            "performance_metrics": metrics,
            "total_analyzers": len(metrics)
        }
    except Exception as e:
        logger.error(f"Error retrieving performance metrics for student {student_id}: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error while retrieving performance metrics"
        )

@router.get("/profile")
def get_profile():
    # 🔒 Later: Load from database or in-memory store
    return {
        "message": "This will return the user's style profile in the future.",
        "status": "placeholder"
    } 