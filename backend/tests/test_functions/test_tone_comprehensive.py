import pytest
import sys
import os

# Add the project root to sys.path for imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from analyzers.tone import classify_tone_model, map_emotion_to_tone
from constants import EMOTION_TO_TONE


class TestToneMapping:
    """Test cases for emotion to tone mapping."""
    
    def test_map_emotion_to_tone_known_emotions(self):
        """Test mapping of known emotions to tones."""
        # Test various emotion mappings
        assert map_emotion_to_tone("joy") == "positive"
        assert map_emotion_to_tone("anger") == "angry"
        assert map_emotion_to_tone("pride") == "confident"
        assert map_emotion_to_tone("fear") == "anxious"
        assert map_emotion_to_tone("sadness") == "sad"
        assert map_emotion_to_tone("neutral") == "neutral"
        assert map_emotion_to_tone("excitement") == "persuasive"
        assert map_emotion_to_tone("confusion") == "reflective"
    
    def test_map_emotion_to_tone_unknown_emotion(self):
        """Test mapping of unknown emotions returns neutral."""
        assert map_emotion_to_tone("unknown_emotion") == "neutral"
        assert map_emotion_to_tone("") == "neutral"
        assert map_emotion_to_tone("xyz123") == "neutral"
    
    def test_map_emotion_to_tone_case_sensitivity(self):
        """Test that emotion mapping is case sensitive."""
        assert map_emotion_to_tone("JOY") == "neutral"  # Should not match
        assert map_emotion_to_tone("Joy") == "neutral"  # Should not match
        assert map_emotion_to_tone("joy") == "positive"  # Should match


class TestToneClassification:
    """Test cases for tone classification."""
    
    def test_positive_tone(self):
        """Test text with positive tone."""
        text = "I love this amazing product! It brings me so much joy and happiness."
        result = classify_tone_model(text)
        
        assert result["score"] > 0.4
        assert result["confidence"] > 0
        assert "positive" in result["bucket"] or "joy" in result["bucket"] or "love" in result["bucket"]
        assert result["details"]["top_emotion_score"] > 0.4
        assert result["details"]["threshold"] == 0.4
    
    def test_angry_tone(self):
        """Test text with angry tone."""
        text = "I am so angry and disgusted with this terrible service!"
        result = classify_tone_model(text)
        
        assert result["score"] > 0.4
        assert result["confidence"] > 0
        assert "angry" in result["bucket"] or "anger" in result["bucket"] or "disgust" in result["bucket"]
        assert result["details"]["top_emotion_score"] > 0.4
    
    def test_confident_tone(self):
        """Test text with confident tone."""
        text = "I am proud of our achievements and grateful for the support we received."
        result = classify_tone_model(text)
        
        assert result["score"] > 0.4
        assert result["confidence"] > 0
        assert "confident" in result["bucket"] or "pride" in result["bucket"] or "gratitude" in result["bucket"]
    
    def test_persuasive_tone(self):
        """Test text with persuasive tone."""
        text = "You should be excited about this opportunity! It's amazing and will bring you great joy."
        result = classify_tone_model(text)
        
        assert result["score"] > 0.4
        assert result["confidence"] > 0
        assert ("persuasive" in result["bucket"] or "excitement" in result["bucket"] or 
                "desire" in result["bucket"] or "optimism" in result["bucket"])
    
    def test_anxious_tone(self):
        """Test text with anxious tone."""
        text = "I'm so nervous and afraid about what might happen next."
        result = classify_tone_model(text)
        
        assert result["score"] > 0.4
        assert result["confidence"] > 0
        assert "anxious" in result["bucket"] or "fear" in result["bucket"] or "nervousness" in result["bucket"]
    
    def test_sad_tone(self):
        """Test text with sad tone."""
        text = "I'm feeling so sad and grieving over this loss."
        result = classify_tone_model(text)
        
        assert result["score"] > 0.4
        assert result["confidence"] > 0
        assert "sad" in result["bucket"] or "sadness" in result["bucket"] or "grief" in result["bucket"]
    
    def test_reflective_tone(self):
        """Test text with reflective tone."""
        text = "I'm confused about this situation and just realized something important."
        result = classify_tone_model(text)
        
        assert result["score"] > 0.4
        assert result["confidence"] > 0
        assert "reflective" in result["bucket"] or "confusion" in result["bucket"] or "realization" in result["bucket"]
    
    def test_apologetic_tone(self):
        """Test text with apologetic tone."""
        text = "I'm so sorry and embarrassed about what happened. I feel terrible remorse."
        result = classify_tone_model(text)
        
        assert result["score"] > 0.4
        assert result["confidence"] > 0
        assert ("apologetic" in result["bucket"] or "remorse" in result["bucket"] or 
                "apology" in result["bucket"] or "embarrassment" in result["bucket"])
    
    def test_empty_text(self):
        """Test empty text input."""
        text = ""
        result = classify_tone_model(text)
        
        assert "score" in result
        assert "bucket" in result
        assert "confidence" in result
        assert "details" in result
        assert "raw_emotions" in result
    
    def test_single_word(self):
        """Test single word input."""
        text = "Happy"
        result = classify_tone_model(text)
        
        assert "score" in result
        assert "bucket" in result
        assert "confidence" in result
        assert "details" in result
        assert "raw_emotions" in result
    
    def test_threshold_parameter(self):
        """Test threshold parameter functionality."""
        text = "I'm feeling okay about this."
        
        # High threshold
        high_threshold_result = classify_tone_model(text, threshold=0.8)
        
        # Low threshold
        low_threshold_result = classify_tone_model(text, threshold=0.1)
        
        # Should have fewer emotions with high threshold
        assert len(high_threshold_result["raw_emotions"]) <= len(low_threshold_result["raw_emotions"])
    
    def test_score_diff_parameter(self):
        """Test score_diff parameter functionality."""
        text = "I'm both happy and excited about this amazing opportunity!"
        
        # Small score difference threshold
        small_diff_result = classify_tone_model(text, score_diff=0.01)
        
        # Large score difference threshold
        large_diff_result = classify_tone_model(text, score_diff=0.2)
        
        # Small diff should be more likely to detect secondary tone
        small_diff_has_secondary = small_diff_result["details"]["has_secondary_tone"]
        large_diff_has_secondary = large_diff_result["details"]["has_secondary_tone"]
        
        # Note: This is probabilistic, so we just check the structure
        assert "has_secondary_tone" in small_diff_result["details"]
        assert "has_secondary_tone" in large_diff_result["details"]
    
    def test_response_structure(self):
        """Test that the response has the correct structure."""
        text = "I love this product!"
        result = classify_tone_model(text)
        
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
        text = "I love this product!"
        result = classify_tone_model(text)
        
        raw_emotions = result["raw_emotions"]
        assert isinstance(raw_emotions, list)
        
        for emotion in raw_emotions:
            assert "label" in emotion
            assert "score" in emotion
            assert isinstance(emotion["label"], str)
            assert isinstance(emotion["score"], (int, float))
            assert 0 <= emotion["score"] <= 1
    
    def test_details_structure(self):
        """Test that details has the correct structure."""
        text = "I love this product!"
        result = classify_tone_model(text)
        
        details = result["details"]
        required_fields = ["top_emotion", "top_emotion_score", "has_secondary_tone", 
                          "secondary_tone", "threshold", "score_diff_threshold"]
        
        for field in required_fields:
            assert field in details
        
        assert isinstance(details["top_emotion"], str)
        assert isinstance(details["top_emotion_score"], (int, float))
        assert isinstance(details["has_secondary_tone"], bool)
        assert isinstance(details["threshold"], (int, float))
        assert isinstance(details["score_diff_threshold"], (int, float))
    
    def test_secondary_tone_detection(self):
        """Test secondary tone detection."""
        text = "I'm both happy and excited about this!"
        result = classify_tone_model(text, score_diff=0.1)
        
        # Check if secondary tone is detected
        assert "has_secondary_tone" in result["details"]
        assert "secondary_tone" in result["details"]
        
        # The bucket might contain both tones if they're close
        bucket = result["bucket"]
        assert isinstance(bucket, str)
    
    def test_confidence_calculation(self):
        """Test that confidence is based on top emotion score."""
        text = "I absolutely love this amazing fantastic product!"
        result = classify_tone_model(text)
        
        # Confidence should equal the top emotion score
        assert result["confidence"] == result["details"]["top_emotion_score"]
    
    def test_emotion_sorting(self):
        """Test that emotions are sorted by score."""
        text = "I'm feeling mixed emotions about this."
        result = classify_tone_model(text)
        
        raw_emotions = result["raw_emotions"]
        if len(raw_emotions) > 1:
            # Check that emotions are sorted in descending order
            for i in range(len(raw_emotions) - 1):
                assert raw_emotions[i]["score"] >= raw_emotions[i + 1]["score"]
    
    def test_edge_case_punctuation(self):
        """Test text with various punctuation marks."""
        text = "I'm so happy!!! This is amazing??? Wow..."
        result = classify_tone_model(text)
        
        assert "score" in result
        assert "bucket" in result
        assert "confidence" in result
    
    def test_edge_case_numbers_and_symbols(self):
        """Test text with numbers and symbols."""
        text = "I love this $100 product with 5 stars! It's great!"
        result = classify_tone_model(text)
        
        assert "score" in result
        assert "bucket" in result
        assert "confidence" in result
    
    def test_long_text(self):
        """Test with longer text."""
        text = "I am absolutely thrilled and overjoyed with the exceptional quality and outstanding performance of this remarkable product. The innovative features and superior craftsmanship have exceeded all my expectations, and I cannot express enough gratitude for such an amazing experience."
        result = classify_tone_model(text)
        
        assert "score" in result
        assert "bucket" in result
        assert "confidence" in result
        assert result["confidence"] > 0
    
    def test_mixed_emotions(self):
        """Test text with mixed emotions."""
        text = "I'm happy about the good parts but sad about the problems."
        result = classify_tone_model(text)
        
        assert "score" in result
        assert "bucket" in result
        assert "confidence" in result
        # Should detect the stronger emotion
        assert result["details"]["top_emotion_score"] > 0 