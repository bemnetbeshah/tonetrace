from fastapi import APIRouter, HTTPException
from typing import Dict, Any
import logging
from services import get_user_profile, create_default_profile
from style_profile_module import StyleProfile

# Configure logging
logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/profile/{user_id}")
def get_user_style_profile(user_id: str) -> Dict[str, Any]:
    """
    Get a user's style profile by their user ID.
    
    Args:
        user_id: The unique identifier for the user
        
    Returns:
        Dictionary containing the user's style profile or a default profile
    """
    logger.info(f"Profile request received for user: {user_id}")
    
    try:
        # Try to get the user's profile from the database
        profile = get_user_profile(user_id)
        
        if profile is None:
            # Create a default profile if none exists
            logger.info(f"No profile found for user {user_id}, returning default profile")
            profile = create_default_profile()
            
            return {
                "user_id": user_id,
                "profile": profile.to_dict(),
                "message": "Default profile created - no existing profile found",
                "is_default": True
            }
        
        # Return the existing profile
        logger.info(f"Returning existing profile for user {user_id}")
        return {
            "user_id": user_id,
            "profile": profile.to_dict(),
            "message": "Profile retrieved successfully",
            "is_default": False
        }
        
    except Exception as e:
        logger.error(f"Error retrieving profile for user {user_id}: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error while retrieving profile for user {user_id}"
        )

@router.get("/profile")
def get_profile():
    # 🔒 Later: Load from database or in-memory store
    return {
        "message": "This will return the user's style profile in the future.",
        "status": "placeholder"
    } 