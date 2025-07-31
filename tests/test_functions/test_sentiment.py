import pytest
import sys
import os

# Add the project root to sys.path for imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from analyzers.sentiment import analyze_sentiment


class TestSentiment:
    """Test cases for sentiment analysis."""
    
    def test_positive_sentiment(self):
        """Test text with positive sentiment."""
        text = "I love this amazing product! It's fantastic and wonderful."
        result = analyze_sentiment(text)
        
        assert result["score"] > 0.1
        assert result["bucket"] == "positive"
        assert result["confidence"] > 0
        assert result["details"]["polarity"] > 0.1
        assert result["details"]["polarity_range"] == "positive"
    
    def test_negative_sentiment(self):
        """Test text with negative sentiment."""
        text = "I hate this terrible product. It's awful and disappointing."
        result = analyze_sentiment(text)
        
        assert result["score"] < -0.1
        assert result["bucket"] == "negative"
        assert result["confidence"] > 0
        assert result["details"]["polarity"] < -0.1
        assert result["details"]["polarity_range"] == "negative"
    
    def test_neutral_sentiment(self):
        """Test text with neutral sentiment."""
        text = "The cat is on the mat. The weather is cloudy today."
        result = analyze_sentiment(text)
        
        assert -0.1 <= result["score"] <= 0.1
        assert result["bucket"] == "neutral"
        assert -0.1 <= result["details"]["polarity"] <= 0.1
        assert result["details"]["polarity_range"] == "neutral"
    
    def test_mixed_sentiment(self):
        """Test text with mixed positive and negative elements."""
        text = "I love the design but hate the price. The quality is great but the service is terrible."
        result = analyze_sentiment(text)
        
        # Should be close to neutral due to mixed sentiment
        assert -0.2 <= result["score"] <= 0.2
        assert result["bucket"] in ["positive", "negative", "neutral"]
    
    def test_empty_text(self):
        """Test empty text input."""
        text = ""
        result = analyze_sentiment(text)
        
        assert result["score"] == 0.0
        assert result["bucket"] == "neutral"
        assert result["details"]["polarity"] == 0.0
        assert result["details"]["subjectivity"] == 0.0
    
    def test_single_word_positive(self):
        """Test single positive word."""
        text = "Excellent"
        result = analyze_sentiment(text)
        
        assert result["score"] > 0.1
        assert result["bucket"] == "positive"
    
    def test_single_word_negative(self):
        """Test single negative word."""
        text = "Terrible"
        result = analyze_sentiment(text)
        
        assert result["score"] < -0.1
        assert result["bucket"] == "negative"
    
    def test_high_subjectivity(self):
        """Test text with high subjectivity."""
        text = "I think this is absolutely wonderful and I feel it's the best thing ever!"
        result = analyze_sentiment(text)
        
        assert result["details"]["subjectivity"] > 0.7
        assert result["details"]["subjectivity_level"] == "subjective"
    
    def test_low_subjectivity(self):
        """Test text with low subjectivity (objective)."""
        text = "The temperature is 25 degrees Celsius. The building has 10 floors."
        result = analyze_sentiment(text)
        
        assert result["details"]["subjectivity"] < 0.3
        assert result["details"]["subjectivity_level"] == "objective"
    
    def test_balanced_subjectivity(self):
        """Test text with balanced subjectivity."""
        text = "The movie was good but could have been better. The acting was decent."
        result = analyze_sentiment(text)
        
        assert 0.3 <= result["details"]["subjectivity"] <= 0.7
        assert result["details"]["subjectivity_level"] == "balanced"
    
    def test_response_structure(self):
        """Test that the response has the correct structure."""
        text = "I love this product!"
        result = analyze_sentiment(text)
        
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
        assert -1 <= result["score"] <= 1
        assert 0 <= result["confidence"] <= 1
        assert -1 <= result["details"]["polarity"] <= 1
        assert 0 <= result["details"]["subjectivity"] <= 1
    
    def test_raw_emotions_structure(self):
        """Test that raw_emotions has the correct structure."""
        text = "I love this product!"
        result = analyze_sentiment(text)
        
        raw_emotions = result["raw_emotions"]
        assert len(raw_emotions) == 2
        
        # Check polarity emotion
        polarity_emotion = next((e for e in raw_emotions if e["label"] == "polarity"), None)
        assert polarity_emotion is not None
        assert "score" in polarity_emotion
        assert -1 <= polarity_emotion["score"] <= 1
        
        # Check subjectivity emotion
        subjectivity_emotion = next((e for e in raw_emotions if e["label"] == "subjectivity"), None)
        assert subjectivity_emotion is not None
        assert "score" in subjectivity_emotion
        assert 0 <= subjectivity_emotion["score"] <= 1
    
    def test_confidence_calculation(self):
        """Test that confidence is calculated based on absolute polarity."""
        # High polarity text (high confidence)
        high_polarity_text = "I absolutely love this amazing fantastic product!"
        high_result = analyze_sentiment(high_polarity_text)
        
        # Low polarity text (low confidence)
        low_polarity_text = "This is okay, I guess."
        low_result = analyze_sentiment(low_polarity_text)
        
        assert high_result["confidence"] > low_result["confidence"]
    
    def test_edge_case_punctuation(self):
        """Test text with various punctuation marks."""
        text = "Wow!!! This is AMAZING!!! I can't believe it!!!"
        result = analyze_sentiment(text)
        
        assert result["score"] > 0.1
        assert result["bucket"] == "positive"
    
    def test_numbers_and_symbols(self):
        """Test text with numbers and symbols."""
        text = "The product costs $100 and has 5 stars. It's great!"
        result = analyze_sentiment(text)
        
        assert result["score"] > 0.1
        assert result["bucket"] == "positive" 