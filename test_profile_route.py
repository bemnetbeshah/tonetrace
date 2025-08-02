#!/usr/bin/env python3
"""
Test script for the profile route functionality.
"""

import requests
import json

def test_profile_route():
    """Test the /profile/{user_id} route."""
    
    base_url = "http://localhost:8000"
    
    # Test 1: Get profile for a new user (should return default profile)
    print("Testing profile retrieval for new user...")
    user_id = "test_user_123"
    
    try:
        response = requests.get(f"{base_url}/profile/{user_id}")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            data = response.json()
            assert data["user_id"] == user_id
            assert data["is_default"] == True
            assert "profile" in data
            print("✅ Test 1 passed: Default profile created successfully")
        else:
            print("❌ Test 1 failed: Unexpected status code")
            
    except requests.exceptions.ConnectionError:
        print("❌ Test failed: Could not connect to server. Make sure the server is running.")
        return
    except Exception as e:
        print(f"❌ Test 1 failed with error: {e}")
    
    # Test 2: Get profile for the same user again (should return the same profile)
    print("\nTesting profile retrieval for existing user...")
    try:
        response = requests.get(f"{base_url}/profile/{user_id}")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            data = response.json()
            assert data["user_id"] == user_id
            assert data["is_default"] == False
            assert "profile" in data
            print("✅ Test 2 passed: Existing profile retrieved successfully")
        else:
            print("❌ Test 2 failed: Unexpected status code")
            
    except Exception as e:
        print(f"❌ Test 2 failed with error: {e}")
    
    # Test 3: Test with different user ID
    print("\nTesting profile retrieval for different user...")
    user_id_2 = "test_user_456"
    try:
        response = requests.get(f"{base_url}/profile/{user_id_2}")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            data = response.json()
            assert data["user_id"] == user_id_2
            assert data["is_default"] == True
            assert "profile" in data
            print("✅ Test 3 passed: Different user gets new default profile")
        else:
            print("❌ Test 3 failed: Unexpected status code")
            
    except Exception as e:
        print(f"❌ Test 3 failed with error: {e}")

if __name__ == "__main__":
    print("Starting profile route tests...")
    test_profile_route()
    print("\nTest completed!") 