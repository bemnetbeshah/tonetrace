import pytest
import sys
import os

# Add the project root to sys.path for imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from analyzers.passive_voice import detect_passive_sentences


class TestPassiveVoice:
    """Test cases for passive voice detection."""
    
    def test_no_passive_voice(self):
        """Test text with no passive voice constructions."""
        text = "The cat chased the mouse. The dog ran quickly. Birds fly in the sky."
        result = detect_passive_sentences(text)
        
        assert result["score"] == 0.0
        assert result["bucket"] == "low_passive"
        assert result["confidence"] > 0
        assert result["details"]["passive_count"] == 0
        assert result["details"]["total_sentences"] == 3
        assert result["details"]["active_sentences"] == 3
        assert result["details"]["passive_style"] == "active"
    
    def test_single_passive_sentence(self):
        """Test text with one passive sentence."""
        text = "The mouse was chased by the cat. The dog ran quickly."
        result = detect_passive_sentences(text)
        
        assert result["score"] == 0.5  # 1 passive out of 2 sentences
        assert result["bucket"] == "moderate_passive"
        assert result["details"]["passive_count"] == 1
        assert result["details"]["total_sentences"] == 2
        assert result["details"]["active_sentences"] == 1
        assert result["details"]["passive_style"] == "balanced"
    
    def test_multiple_passive_sentences(self):
        """Test text with multiple passive sentences."""
        text = "The book was written by the author. The movie was directed by Spielberg. The song was sung beautifully."
        result = detect_passive_sentences(text)
        
        assert result["score"] == 1.0  # 3 passive out of 3 sentences
        assert result["bucket"] == "high_passive"
        assert result["details"]["passive_count"] == 3
        assert result["details"]["total_sentences"] == 3
        assert result["details"]["active_sentences"] == 0
        assert result["details"]["passive_style"] == "formal"
    
    def test_mixed_active_passive(self):
        """Test text with mixed active and passive sentences."""
        text = "The cat chased the mouse. The book was written by the author. The dog ran quickly. The movie was directed by Spielberg."
        result = detect_passive_sentences(text)
        
        assert result["score"] == 0.5  # 2 passive out of 4 sentences
        assert result["bucket"] == "moderate_passive"
        assert result["details"]["passive_count"] == 2
        assert result["details"]["total_sentences"] == 4
        assert result["details"]["active_sentences"] == 2
        assert result["details"]["passive_style"] == "balanced"
    
    def test_empty_text(self):
        """Test empty text input."""
        text = ""
        result = detect_passive_sentences(text)
        
        assert result["score"] == 0.0
        assert result["bucket"] == "low_passive"
        assert result["details"]["passive_count"] == 0
        assert result["details"]["total_sentences"] == 0
        assert result["details"]["active_sentences"] == 0
    
    def test_single_word(self):
        """Test single word input."""
        text = "Hello"
        result = detect_passive_sentences(text)
        
        assert result["score"] == 0.0
        assert result["bucket"] == "low_passive"
        assert result["details"]["passive_count"] == 0
        assert result["details"]["total_sentences"] == 1
    
    def test_complex_passive_constructions(self):
        """Test complex passive voice constructions."""
        text = "The project has been completed by the team. The results will be analyzed by experts. The data should be reviewed carefully."
        result = detect_passive_sentences(text)
        
        assert result["score"] == 1.0  # 3 passive out of 3 sentences
        assert result["bucket"] == "high_passive"
        assert result["details"]["passive_count"] == 3
        assert result["details"]["total_sentences"] == 3
    
    def test_passive_with_modals(self):
        """Test passive voice with modal verbs."""
        text = "The work can be done. The task must be completed. The problem should be solved."
        result = detect_passive_sentences(text)
        
        assert result["score"] == 1.0  # 3 passive out of 3 sentences
        assert result["bucket"] == "high_passive"
        assert result["details"]["passive_count"] == 3
        assert result["details"]["total_sentences"] == 3
    
    def test_response_structure(self):
        """Test that the response has the correct structure."""
        text = "The book was written by the author."
        result = detect_passive_sentences(text)
        
        # Check required fields
        assert "score" in result
        assert "bucket" in result
        assert "raw_emotions" in result
        assert "confidence" in result
        assert "details" in result
        
        # Check data types
        assert isinstance(result["score"], (int, float))
        assert isinstance(result["bucket"], str)
        assert isinstance(result["raw_emotions"], list)
        assert isinstance(result["confidence"], (int, float))
        assert isinstance(result["details"], dict)
        
        # Check value ranges
        assert 0 <= result["score"] <= 1
        assert 0 <= result["confidence"] <= 1
    
    def test_confidence_calculation(self):
        """Test confidence calculation based on sentence count."""
        # Short text (low confidence)
        short_text = "The cat was chased."
        short_result = detect_passive_sentences(short_text)
        
        # Longer text (higher confidence)
        long_text = "The cat was chased. The dog was running. The bird was flying. The fish was swimming. The rabbit was hopping. The squirrel was climbing. The deer was grazing. The fox was hunting. The bear was sleeping. The wolf was howling."
        long_result = detect_passive_sentences(long_text)
        
        assert short_result["confidence"] < long_result["confidence"]
        assert long_result["confidence"] == 1.0  # Should be capped at 1.0 