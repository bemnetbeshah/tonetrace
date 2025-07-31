import pytest
import sys
import os

# Add the project root to sys.path for imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from analyzers.hedging import detect_hedging


class TestHedging:
    """Test cases for hedging detection."""
    
    def test_no_hedging(self):
        """Test text with no hedging phrases."""
        text = "The cat is on the mat. The weather is sunny today."
        result = detect_hedging(text)
        
        assert result["score"] == 0.0
        assert result["bucket"] == "low_hedging"
        assert result["confidence"] > 0
        assert result["details"]["hedging_count"] == 0
        assert result["details"]["contains_hedging"] == False
        assert result["details"]["hedging_style"] == "assertive"
    
    def test_single_hedging_phrase(self):
        """Test text with one hedging phrase."""
        text = "I think the cat is on the mat."
        result = detect_hedging(text)
        
        assert result["score"] > 0
        assert result["bucket"] == "moderate_hedging"
        assert result["details"]["hedging_count"] == 1
        assert result["details"]["contains_hedging"] == True
        assert "I think" in result["details"]["found_phrases"]
        assert result["details"]["hedging_style"] == "balanced"
    
    def test_multiple_hedging_phrases(self):
        """Test text with multiple hedging phrases."""
        text = "I think maybe the cat could be on the mat, perhaps."
        result = detect_hedging(text)
        
        assert result["score"] > 0
        assert result["bucket"] == "high_hedging"
        assert result["details"]["hedging_count"] >= 3
        assert result["details"]["contains_hedging"] == True
        assert result["details"]["hedging_style"] == "tentative"
    
    def test_common_hedging_words(self):
        """Test various common hedging words."""
        hedging_words = ["maybe", "perhaps", "sort of", "kind of", "possibly", "likely"]
        
        for word in hedging_words:
            text = f"The cat is {word} on the mat."
            result = detect_hedging(text)
            
            assert result["details"]["hedging_count"] == 1
            assert result["details"]["contains_hedging"] == True
            assert word in result["details"]["found_phrases"]
    
    def test_modal_hedging_words(self):
        """Test modal verbs used as hedging."""
        modal_words = ["could", "should", "would"]
        
        for word in modal_words:
            text = f"The cat {word} be on the mat."
            result = detect_hedging(text)
            
            assert result["details"]["hedging_count"] == 1
            assert result["details"]["contains_hedging"] == True
            assert word in result["details"]["found_phrases"]
    
    def test_opinion_hedging_phrases(self):
        """Test opinion-based hedging phrases."""
        opinion_phrases = ["I think", "I feel", "in my opinion", "arguably"]
        
        for phrase in opinion_phrases:
            text = f"{phrase} the cat is on the mat."
            result = detect_hedging(text)
            
            assert result["details"]["hedging_count"] == 1
            assert result["details"]["contains_hedging"] == True
            assert phrase in result["details"]["found_phrases"]
    
    def test_empty_text(self):
        """Test empty text input."""
        text = ""
        result = detect_hedging(text)
        
        assert result["score"] == 0.0
        assert result["bucket"] == "low_hedging"
        assert result["details"]["hedging_count"] == 0
        assert result["details"]["word_count"] == 0
        assert result["details"]["contains_hedging"] == False
    
    def test_single_word(self):
        """Test single word input."""
        text = "Hello"
        result = detect_hedging(text)
        
        assert result["score"] == 0.0
        assert result["bucket"] == "low_hedging"
        assert result["details"]["hedging_count"] == 0
        assert result["details"]["word_count"] == 1
    
    def test_hedging_density_calculation(self):
        """Test hedging density calculation."""
        # High density: many hedging words in short text
        high_density_text = "I think maybe the cat could perhaps be sort of on the mat."
        high_result = detect_hedging(high_density_text)
        
        # Low density: few hedging words in long text
        low_density_text = "The cat is on the mat. The dog is in the yard. The bird is in the tree. The fish is in the pond. I think the weather is nice."
        low_result = detect_hedging(low_density_text)
        
        assert high_result["details"]["hedging_density"] > low_result["details"]["hedging_density"]
    
    def test_bucket_classification(self):
        """Test bucket classification based on hedging count and density."""
        # Low hedging
        low_text = "The cat is on the mat."
        low_result = detect_hedging(low_text)
        assert low_result["bucket"] == "low_hedging"
        
        # Moderate hedging
        moderate_text = "I think the cat is on the mat."
        moderate_result = detect_hedging(moderate_text)
        assert moderate_result["bucket"] == "moderate_hedging"
        
        # High hedging
        high_text = "I think maybe the cat could perhaps be on the mat."
        high_result = detect_hedging(high_text)
        assert high_result["bucket"] == "high_hedging"
    
    def test_response_structure(self):
        """Test that the response has the correct structure."""
        text = "I think the cat is on the mat."
        result = detect_hedging(text)
        
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
    
    def test_raw_emotions_structure(self):
        """Test that raw_emotions has the correct structure."""
        text = "I think the cat is on the mat."
        result = detect_hedging(text)
        
        raw_emotions = result["raw_emotions"]
        assert len(raw_emotions) == 2
        
        # Check hedging count emotion
        count_emotion = next((e for e in raw_emotions if e["label"] == "hedging_count"), None)
        assert count_emotion is not None
        assert "score" in count_emotion
        assert 0 <= count_emotion["score"] <= 1
        
        # Check hedging density emotion
        density_emotion = next((e for e in raw_emotions if e["label"] == "hedging_density"), None)
        assert density_emotion is not None
        assert "score" in density_emotion
        assert 0 <= density_emotion["score"] <= 1
    
    def test_confidence_calculation(self):
        """Test confidence calculation based on text length."""
        # Short text (low confidence)
        short_text = "I think the cat is on the mat."
        short_result = detect_hedging(short_text)
        
        # Long text (higher confidence)
        long_text = "I think maybe the cat could perhaps be on the mat. The dog might be in the yard. The bird could be in the tree. The fish should be in the pond. The rabbit would be in the garden."
        long_result = detect_hedging(long_text)
        
        assert short_result["confidence"] < long_result["confidence"]
        assert long_result["confidence"] == 1.0  # Should be capped at 1.0
    
    def test_case_insensitive_detection(self):
        """Test that hedging detection is case insensitive."""
        text_lower = "i think the cat is on the mat."
        text_upper = "I THINK THE CAT IS ON THE MAT."
        text_mixed = "I Think the cat is on the mat."
        
        result_lower = detect_hedging(text_lower)
        result_upper = detect_hedging(text_upper)
        result_mixed = detect_hedging(text_mixed)
        
        assert result_lower["details"]["hedging_count"] == result_upper["details"]["hedging_count"]
        assert result_lower["details"]["hedging_count"] == result_mixed["details"]["hedging_count"]
    
    def test_word_boundary_detection(self):
        """Test that hedging phrases are detected with proper word boundaries."""
        # Should detect "I think" but not "thinking"
        text_with_hedging = "I think the cat is thinking."
        result_with_hedging = detect_hedging(text_with_hedging)
        
        # Should detect "maybe" but not "maybes"
        text_without_hedging = "The cat maybes on the mat."
        result_without_hedging = detect_hedging(text_without_hedging)
        
        assert result_with_hedging["details"]["hedging_count"] == 1
        assert result_without_hedging["details"]["hedging_count"] == 0
    
    def test_hedging_style_classification(self):
        """Test hedging style classification."""
        # Assertive style
        assertive_text = "The cat is on the mat."
        assertive_result = detect_hedging(assertive_text)
        assert assertive_result["details"]["hedging_style"] == "assertive"
        
        # Balanced style
        balanced_text = "I think the cat is on the mat."
        balanced_result = detect_hedging(balanced_text)
        assert balanced_result["details"]["hedging_style"] == "balanced"
        
        # Tentative style
        tentative_text = "I think maybe the cat could perhaps be on the mat."
        tentative_result = detect_hedging(tentative_text)
        assert tentative_result["details"]["hedging_style"] == "tentative" 