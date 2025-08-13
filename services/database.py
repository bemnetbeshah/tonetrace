import logging
from typing import Optional
from style_profile_module.style_profile import StyleProfile

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# In-memory storage for style profiles (replace with database in production)
_profiles = {}

def get_student_profile(student_id: str) -> Optional[StyleProfile]:
    """
    Retrieve a student's StyleProfile from the database.
    
    Args:
        student_id: The unique identifier for the student
        
    Returns:
        StyleProfile object if found, None otherwise
    """
    logger.info(f"Fetching profile for student: {student_id}")
    
    try:
        profile = _profiles.get(student_id)
        if profile:
            logger.info(f"Profile found for student {student_id} with {profile.total_texts} texts analyzed")
            return profile
        else:
            logger.info(f"No profile found for student {student_id}")
            return None
    except Exception as e:
        logger.error(f"Error retrieving profile for student {student_id}: {e}")
        return None

def save_student_profile(student_id: str, profile: StyleProfile) -> bool:
    """
    Save a student's StyleProfile to the database.
    
    Args:
        student_id: The unique identifier for the student
        profile: The StyleProfile object to save
        
    Returns:
        bool: True if successful, False otherwise
    """
    logger.info(f"Saving profile for student: {student_id}")
    
    try:
        _profiles[student_id] = profile
        logger.info(f"Profile saved successfully for student {student_id}")
        return True
    except Exception as e:
        logger.error(f"Failed to save profile for student {student_id}: {e}")
        return False

def create_default_profile() -> StyleProfile:
    """
    Create a default StyleProfile for new students.
    
    Returns:
        StyleProfile: A new default profile
    """
    return StyleProfile()

def profile_exists(student_id: str) -> bool:
    """
    Check if a profile exists for the given student.
    
    Args:
        student_id: The unique identifier for the student
        
    Returns:
        bool: True if profile exists, False otherwise
    """
    return student_id in _profiles 