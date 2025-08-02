#!/usr/bin/env python3
"""
Example usage of the profile functionality.
"""

from style_profile_module import StyleProfile
from services import get_user_profile, save_user_profile, create_default_profile

def example_profile_usage():
    """Demonstrate the profile functionality."""
    
    print("=== StyleProfile Example Usage ===\n")
    
    # 1. Create a new StyleProfile
    print("1. Creating a new StyleProfile...")
    profile = StyleProfile()
    print(f"   Initial profile: {profile.to_dict()}\n")
    
    # 2. Update the profile with some analysis data
    print("2. Updating profile with analysis data...")
    sample_analysis = {
        "tone": "professional",
        "emotion": "neutral",
        "sentiment": {"polarity": 0.2},
        "lexical_diversity": {"score": 0.75},
        "formality": {"grade": 0.8},
        "complexity": {
            "sentence_length": 15.5,
            "lexical_density": 0.65
        },
        "passive_voice": {"ratio": 0.1},
        "hedging": {"count": 2}
    }
    
    profile.update(sample_analysis)
    print(f"   Updated profile: {profile.to_dict()}\n")
    
    # 3. Test serialization/deserialization
    print("3. Testing serialization/deserialization...")
    profile_dict = profile.to_dict()
    reconstructed_profile = StyleProfile.from_dict(profile_dict)
    
    print(f"   Original profile total_texts: {profile.total_texts}")
    print(f"   Reconstructed profile total_texts: {reconstructed_profile.total_texts}")
    print(f"   Profiles match: {profile.to_dict() == reconstructed_profile.to_dict()}\n")
    
    # 4. Test database operations
    print("4. Testing database operations...")
    user_id = "example_user_123"
    
    # Save profile
    success = save_user_profile(user_id, profile)
    print(f"   Profile saved: {success}")
    
    # Retrieve profile
    retrieved_profile = get_user_profile(user_id)
    if retrieved_profile:
        print(f"   Profile retrieved successfully")
        print(f"   Total texts analyzed: {retrieved_profile.total_texts}")
    else:
        print("   Failed to retrieve profile")
    
    # Test with non-existent user
    non_existent_profile = get_user_profile("non_existent_user")
    if non_existent_profile is None:
        print("   Non-existent user correctly returns None")
    
    # Create default profile
    default_profile = create_default_profile()
    print(f"   Default profile created with {default_profile.total_texts} texts\n")
    
    print("=== Example completed ===")

if __name__ == "__main__":
    example_profile_usage() 