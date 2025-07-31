import pytest
import sys
import os

# Add the project root to sys.path for imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from analyzers import create_standard_response


class TestStandardResponse:
    """Test cases for the create_standard_response function."""
    
    def test_basic_response(self):
        """Test basic response creation with required parameters."""
        result = create_standard_response(
            score=0.75,
            bucket="test_bucket"
        )
        
        assert result["score"] == 0.75
        assert result["bucket"] == "test_bucket"
        assert result["raw_emotions"] == []
        assert result["confidence"] == 1.0
        assert result["details"] == {}
    
    def test_full_response(self):
        """Test response creation with all parameters."""
        raw_emotions = [
            {"label": "emotion1", "score": 0.8},
            {"label": "emotion2", "score": 0.6}
        ]
        details = {
            "metric1": 0.5,
            "metric2": "test_value"
        }
        
        result = create_standard_response(
            score=0.85,
            bucket="full_bucket",
            raw_emotions=raw_emotions,
            confidence=0.9,
            details=details
        )
        
        assert result["score"] == 0.85
        assert result["bucket"] == "full_bucket"
        assert result["raw_emotions"] == raw_emotions
        assert result["confidence"] == 0.9
        assert result["details"] == details
    
    def test_score_rounding(self):
        """Test that score is rounded to 3 decimal places."""
        result = create_standard_response(
            score=0.123456789,
            bucket="test"
        )
        
        assert result["score"] == 0.123
    
    def test_confidence_rounding(self):
        """Test that confidence is rounded to 3 decimal places."""
        result = create_standard_response(
            score=0.5,
            bucket="test",
            confidence=0.987654321
        )
        
        assert result["confidence"] == 0.988
    
    def test_default_values(self):
        """Test default values for optional parameters."""
        result = create_standard_response(
            score=0.5,
            bucket="test"
        )
        
        assert result["raw_emotions"] == []
        assert result["confidence"] == 1.0
        assert result["details"] == {}
    
    def test_none_values(self):
        """Test handling of None values for optional parameters."""
        result = create_standard_response(
            score=0.5,
            bucket="test",
            raw_emotions=None,
            confidence=None,
            details=None
        )
        
        assert result["raw_emotions"] == []
        assert result["confidence"] == 1.0
        assert result["details"] == {}
    
    def test_empty_lists_and_dicts(self):
        """Test handling of empty lists and dictionaries."""
        result = create_standard_response(
            score=0.5,
            bucket="test",
            raw_emotions=[],
            details={}
        )
        
        assert result["raw_emotions"] == []
        assert result["details"] == {}
    
    def test_data_types(self):
        """Test that all fields have correct data types."""
        result = create_standard_response(
            score=0.75,
            bucket="test_bucket",
            raw_emotions=[{"label": "test", "score": 0.5}],
            confidence=0.8,
            details={"key": "value"}
        )
        
        assert isinstance(result["score"], float)
        assert isinstance(result["bucket"], str)
        assert isinstance(result["raw_emotions"], list)
        assert isinstance(result["confidence"], float)
        assert isinstance(result["details"], dict)
    
    def test_edge_case_zero_score(self):
        """Test edge case with zero score."""
        result = create_standard_response(
            score=0.0,
            bucket="zero_bucket"
        )
        
        assert result["score"] == 0.0
        assert result["bucket"] == "zero_bucket"
    
    def test_edge_case_one_score(self):
        """Test edge case with score of 1.0."""
        result = create_standard_response(
            score=1.0,
            bucket="one_bucket"
        )
        
        assert result["score"] == 1.0
        assert result["bucket"] == "one_bucket"
    
    def test_edge_case_negative_score(self):
        """Test edge case with negative score."""
        result = create_standard_response(
            score=-0.5,
            bucket="negative_bucket"
        )
        
        assert result["score"] == -0.5
        assert result["bucket"] == "negative_bucket"
    
    def test_edge_case_high_score(self):
        """Test edge case with score greater than 1.0."""
        result = create_standard_response(
            score=2.5,
            bucket="high_bucket"
        )
        
        assert result["score"] == 2.5
        assert result["bucket"] == "high_bucket"
    
    def test_complex_raw_emotions(self):
        """Test with complex raw_emotions structure."""
        raw_emotions = [
            {"label": "emotion1", "score": 0.8, "extra_field": "value1"},
            {"label": "emotion2", "score": 0.6, "nested": {"key": "value"}}
        ]
        
        result = create_standard_response(
            score=0.7,
            bucket="complex_bucket",
            raw_emotions=raw_emotions
        )
        
        assert result["raw_emotions"] == raw_emotions
        assert len(result["raw_emotions"]) == 2
        assert result["raw_emotions"][0]["extra_field"] == "value1"
        assert result["raw_emotions"][1]["nested"]["key"] == "value"
    
    def test_complex_details(self):
        """Test with complex details structure."""
        details = {
            "string_value": "test",
            "numeric_value": 42,
            "boolean_value": True,
            "list_value": [1, 2, 3],
            "nested_dict": {"key": "value"},
            "null_value": None
        }
        
        result = create_standard_response(
            score=0.6,
            bucket="complex_details_bucket",
            details=details
        )
        
        assert result["details"] == details
        assert result["details"]["string_value"] == "test"
        assert result["details"]["numeric_value"] == 42
        assert result["details"]["boolean_value"] == True
        assert result["details"]["list_value"] == [1, 2, 3]
        assert result["details"]["nested_dict"]["key"] == "value"
        assert result["details"]["null_value"] == None
    
    def test_unicode_characters(self):
        """Test with unicode characters in bucket and details."""
        result = create_standard_response(
            score=0.5,
            bucket="test_üñîçødë",
            details={"unicode_key": "üñîçødë_value"}
        )
        
        assert result["bucket"] == "test_üñîçødë"
        assert result["details"]["unicode_key"] == "üñîçødë_value"
    
    def test_response_immutability(self):
        """Test that the response is not affected by changes to input parameters."""
        raw_emotions = [{"label": "test", "score": 0.5}]
        details = {"key": "value"}
        
        result = create_standard_response(
            score=0.7,
            bucket="test_bucket",
            raw_emotions=raw_emotions,
            details=details
        )
        
        # Modify the input parameters
        raw_emotions.append({"label": "new", "score": 0.8})
        details["new_key"] = "new_value"
        
        # The result should remain unchanged
        assert len(result["raw_emotions"]) == 1
        assert "new_key" not in result["details"]
    
    def test_required_fields_presence(self):
        """Test that all required fields are present in the response."""
        result = create_standard_response(
            score=0.5,
            bucket="test"
        )
        
        required_fields = ["score", "bucket", "raw_emotions", "confidence", "details"]
        for field in required_fields:
            assert field in result 