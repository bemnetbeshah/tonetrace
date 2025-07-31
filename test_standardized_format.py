#!/usr/bin/env python3
"""
Simple test to verify the standardized response format is working.
"""

def test_standardized_format():
    """Test that all analyzers return the expected standardized format."""
    
    # Test the create_standard_response function
    from analyzers import create_standard_response
    
    result = create_standard_response(
        score=0.85,
        bucket="test_bucket",
        raw_emotions=[{"label": "test", "score": 0.85}],
        confidence=0.9,
        details={"test": "value"}
    )
    
    # Check that all required fields are present
    required_fields = ["score", "bucket", "raw_emotions", "confidence", "details"]
    for field in required_fields:
        assert field in result, f"Missing required field: {field}"
    
    # Check data types
    assert isinstance(result["score"], float), "score should be float"
    assert isinstance(result["bucket"], str), "bucket should be string"
    assert isinstance(result["raw_emotions"], list), "raw_emotions should be list"
    assert isinstance(result["confidence"], float), "confidence should be float"
    assert isinstance(result["details"], dict), "details should be dict"
    
    print("✅ Standardized response format test passed!")
    print(f"Sample response: {result}")
    
    return result

if __name__ == "__main__":
    test_standardized_format() 