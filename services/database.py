import logging
from typing import Optional, Dict
from style_profile_module import StyleProfile

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# In-memory storage for now (will be replaced with Firestore later)
_profiles: Dict[str, StyleProfile] = {}

def get_user_profile(user_id: str) -> Optional[StyleProfile]:
    """
    Retrieve a user's StyleProfile from the database.
    
    Args:
        user_id: The unique identifier for the user
        
    Returns:
        StyleProfile if found, None otherwise
    """
    logger.info(f"Fetching profile for user: {user_id}")
    
    # TODO: Replace with actual database query (Firestore)
    profile = _profiles.get(user_id)
    
    if profile:
        logger.info(f"Profile found for user {user_id} with {profile.total_texts} texts analyzed")
    else:
        logger.info(f"No profile found for user {user_id}")
    
    return profile

def save_user_profile(user_id: str, profile: StyleProfile) -> bool:
    """
    Save a user's StyleProfile to the database.
    
    Args:
        user_id: The unique identifier for the user
        profile: The StyleProfile to save
        
    Returns:
        True if successful, False otherwise
    """
    logger.info(f"Saving profile for user: {user_id}")
    
    try:
        # TODO: Replace with actual database save (Firestore)
        _profiles[user_id] = profile
        logger.info(f"Profile saved successfully for user {user_id}")
        return True
    except Exception as e:
        logger.error(f"Failed to save profile for user {user_id}: {e}")
        return False

def create_default_profile() -> StyleProfile:
    """
    Create a default StyleProfile for new users.
    
    Returns:
        A new StyleProfile with default values
    """
    logger.info("Creating default profile")
    return StyleProfile()

def profile_exists(user_id: str) -> bool:
    """
    Check if a profile exists for the given user.
    
    Args:
        user_id: The unique identifier for the user
        
    Returns:
        True if profile exists, False otherwise
    """
    return user_id in _profiles 