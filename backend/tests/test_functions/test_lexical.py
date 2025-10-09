import pytest
import sys
import os

# Add the project root to sys.path for imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from analyzers.lexical import compute_lexical_diversity


class TestLexicalDiversity:
    """Test cases for lexical diversity analysis."""
    
    def test_high_diversity(self):
        """Test text with high lexical diversity."""
        text = "The magnificent cat gracefully leaped over the ancient wall while the curious dog watched intently from the garden."
        result = compute_lexical_diversity(text)
        
        assert result["score"] > 0.7
        assert result["bucket"] == "high_diversity"
        assert result["confidence"] > 0
        assert result["details"]["lexical_diversity"] > 0.7
        assert result["details"]["vocabulary_richness"] == "rich"
    
    def test_moderate_diversity(self):
        """Test text with moderate lexical diversity."""
        text = "The cat is on the mat. The dog is in the yard. The bird is in the tree."
        result = compute_lexical_diversity(text)
        
        assert 0.5 < result["score"] <= 0.7
        assert result["bucket"] == "moderate_diversity"
        assert result["details"]["lexical_diversity"] > 0.5
        assert result["details"]["vocabulary_richness"] == "moderate"
    
    def test_low_diversity(self):
        """Test text with low lexical diversity (repetitive)."""
        text = "The cat the cat the cat the cat the cat the cat the cat the cat the cat the cat."
        result = compute_lexical_diversity(text)
        
        assert result["score"] <= 0.5
        assert result["bucket"] == "low_diversity"
        assert result["details"]["lexical_diversity"] <= 0.5
        assert result["details"]["vocabulary_richness"] == "limited"
    
    def test_empty_text(self):
        """Test empty text input."""
        text = ""
        result = compute_lexical_diversity(text)
        
        assert result["score"] == 0.0
        assert result["bucket"] == "low_diversity"
        assert result["details"]["lexical_diversity"] == 0.0
        assert result["details"]["total_words"] == 0
        assert result["details"]["unique_words"] == 0
    
    def test_single_word(self):
        """Test single word input."""
        text = "Hello"
        result = compute_lexical_diversity(text)
        
        assert result["score"] == 1.0  # 1 unique word out of 1 total word
        assert result["bucket"] == "high_diversity"
        assert result["details"]["lexical_diversity"] == 1.0
        assert result["details"]["total_words"] == 1
        assert result["details"]["unique_words"] == 1
    
    def test_repeated_single_word(self):
        """Test repeated single word."""
        text = "cat cat cat cat cat"
        result = compute_lexical_diversity(text)
        
        assert result["score"] == 0.2  # 1 unique word out of 5 total words
        assert result["bucket"] == "low_diversity"
        assert result["details"]["lexical_diversity"] == 0.2
        assert result["details"]["total_words"] == 5
        assert result["details"]["unique_words"] == 1
    
    def test_punctuation_handling(self):
        """Test that punctuation is properly handled."""
        text = "The cat, the dog, and the bird are all animals."
        result = compute_lexical_diversity(text)
        
        # Should only count words, not punctuation
        assert result["details"]["total_words"] == 8  # the, cat, the, dog, and, the, bird, are, all, animals
        assert result["details"]["unique_words"] == 6  # the, cat, dog, and, bird, are, all, animals (removing duplicates)
    
    def test_case_insensitive(self):
        """Test that lexical diversity is case insensitive."""
        text_lower = "the cat is on the mat"
        text_upper = "THE CAT IS ON THE MAT"
        text_mixed = "The Cat Is On The Mat"
        
        result_lower = compute_lexical_diversity(text_lower)
        result_upper = compute_lexical_diversity(text_upper)
        result_mixed = compute_lexical_diversity(text_mixed)
        
        assert result_lower["score"] == result_upper["score"]
        assert result_lower["score"] == result_mixed["score"]
        assert result_lower["details"]["unique_words"] == result_upper["details"]["unique_words"]
        assert result_lower["details"]["unique_words"] == result_mixed["details"]["unique_words"]
    
    def test_repetition_ratio_calculation(self):
        """Test repetition ratio calculation."""
        text = "The cat the cat the cat"
        result = compute_lexical_diversity(text)
        
        # 2 unique words out of 4 total words = 0.5 diversity
        # Repetition ratio should be 1 - 0.5 = 0.5
        assert result["details"]["repetition_ratio"] == 0.5
    
    def test_confidence_calculation(self):
        """Test confidence calculation based on text length."""
        # Short text (low confidence)
        short_text = "The cat is on the mat."
        short_result = compute_lexical_diversity(short_text)
        
        # Long text (higher confidence)
        long_text = "The magnificent cat gracefully leaped over the ancient wall while the curious dog watched intently from the garden. The beautiful bird sang sweetly in the morning light."
        long_result = compute_lexical_diversity(long_text)
        
        assert short_result["confidence"] < long_result["confidence"]
        assert long_result["confidence"] == 1.0  # Should be capped at 1.0
    
    def test_response_structure(self):
        """Test that the response has the correct structure."""
        text = "The cat is on the mat."
        result = compute_lexical_diversity(text)
        
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
        assert 0 <= result["details"]["lexical_diversity"] <= 1
        assert 0 <= result["details"]["repetition_ratio"] <= 1
    
    def test_raw_emotions_structure(self):
        """Test that raw_emotions has the correct structure."""
        text = "The cat is on the mat."
        result = compute_lexical_diversity(text)
        
        raw_emotions = result["raw_emotions"]
        assert len(raw_emotions) == 2
        
        # Check unique words emotion
        unique_emotion = next((e for e in raw_emotions if e["label"] == "unique_words"), None)
        assert unique_emotion is not None
        assert "score" in unique_emotion
        assert 0 <= unique_emotion["score"] <= 1
        
        # Check total words emotion
        total_emotion = next((e for e in raw_emotions if e["label"] == "total_words"), None)
        assert total_emotion is not None
        assert "score" in total_emotion
        assert 0 <= total_emotion["score"] <= 1
    
    def test_vocabulary_richness_classification(self):
        """Test vocabulary richness classification."""
        # Rich vocabulary
        rich_text = "The magnificent cat gracefully leaped over the ancient wall while the curious dog watched intently from the garden."
        rich_result = compute_lexical_diversity(rich_text)
        assert rich_result["details"]["vocabulary_richness"] == "rich"
        
        # Moderate vocabulary
        moderate_text = "The cat is on the mat. The dog is in the yard. The bird is in the tree."
        moderate_result = compute_lexical_diversity(moderate_text)
        assert moderate_result["details"]["vocabulary_richness"] == "moderate"
        
        # Limited vocabulary
        limited_text = "The cat the cat the cat the cat the cat the cat the cat the cat the cat the cat."
        limited_result = compute_lexical_diversity(limited_text)
        assert limited_result["details"]["vocabulary_richness"] == "limited"
    
    def test_numbers_and_symbols(self):
        """Test text with numbers and symbols."""
        text = "The cat is 5 years old and costs $100. The dog is 3 years old and costs $75."
        result = compute_lexical_diversity(text)
        
        # Should count numbers as words
        assert result["details"]["total_words"] > 0
        assert result["details"]["unique_words"] > 0
        assert 0 <= result["score"] <= 1
    
    def test_edge_case_special_characters(self):
        """Test text with special characters."""
        text = "The cat @#$%^&*() is on the mat!!!"
        result = compute_lexical_diversity(text)
        
        # Should only count actual words, not special characters
        assert result["details"]["total_words"] == 5  # the, cat, is, on, the, mat
        assert result["details"]["unique_words"] == 4  # the, cat, is, on, mat (removing duplicate 'the')
    
    def test_bucket_boundaries(self):
        """Test bucket classification boundaries."""
        # Test boundary between low and moderate diversity
        low_moderate_boundary = "The cat the cat the cat the cat the cat the cat the cat the cat the cat the cat the cat the cat the cat the cat the cat the cat the cat the cat the cat the cat."
        low_moderate_result = compute_lexical_diversity(low_moderate_boundary)
        
        # Test boundary between moderate and high diversity
        moderate_high_boundary = "The magnificent cat gracefully leaped over the ancient wall while the curious dog watched intently from the garden. The beautiful bird sang sweetly in the morning light as the gentle breeze rustled through the leaves."
        moderate_high_result = compute_lexical_diversity(moderate_high_boundary)
        
        # Verify bucket classifications
        assert low_moderate_result["bucket"] in ["low_diversity", "moderate_diversity"]
        assert moderate_high_result["bucket"] in ["moderate_diversity", "high_diversity"] 