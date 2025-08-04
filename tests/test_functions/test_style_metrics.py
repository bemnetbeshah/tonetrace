import pytest
import sys
import os

# Add the project root to sys.path for imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from analyzers.style_metrics import compute_formality, compute_complexity, count_words, average_sentence_length


class TestStyleMetrics:
    """Test cases for style metrics analysis."""
    
    def test_count_words(self):
        """Test word counting function."""
        text = "The cat is on the mat."
        assert count_words(text) == 6
        
        text_empty = ""
        assert count_words(text_empty) == 0
        
        text_single = "Hello"
        assert count_words(text_single) == 1
        
        text_multiple_spaces = "The   cat    is     on      the       mat."
        assert count_words(text_multiple_spaces) == 6
    
    def test_average_sentence_length(self):
        """Test average sentence length calculation."""
        text = "The cat is on the mat. The dog is in the yard. The bird is in the tree."
        avg_length = average_sentence_length(text)
        assert avg_length == 6.0  # (6 + 6 + 6) / 3 = 6
        
        text_empty = ""
        assert average_sentence_length(text_empty) == 0.0
        
        text_single_sentence = "The cat is on the mat."
        assert average_sentence_length(text_single_sentence) == 6.0
    
    def test_formality_informal(self):
        """Test informal text formality analysis."""
        text = "Hey there! How are you doing? This is a simple text with basic words."
        result = compute_formality(text)
        
        assert result["bucket"] == "informal"
        assert result["score"] == 0.3
        assert result["confidence"] == 0.8
        assert result["details"]["education_level"] == "beginner"
        assert result["details"]["flesch_kincaid_grade"] < 6
    
    def test_formality_neutral(self):
        """Test neutral text formality analysis."""
        text = "The weather conditions are quite pleasant today. The temperature remains moderate throughout the day and the sky appears clear and bright."
        result = compute_formality(text)
        
        assert result["bucket"] == "neutral"
        assert result["score"] == 0.6
        assert result["confidence"] == 0.8
        assert result["details"]["education_level"] == "intermediate"
        assert 6 <= result["details"]["flesch_kincaid_grade"] < 10
    
    def test_formality_formal(self):
        """Test formal text formality analysis."""
        text = "The comprehensive analysis demonstrates that the implementation of sophisticated methodologies yields substantial improvements in operational efficiency."
        result = compute_formality(text)
        
        assert result["bucket"] == "formal"
        assert result["score"] == 0.9
        assert result["confidence"] == 0.8
        assert result["details"]["education_level"] == "advanced"
        assert result["details"]["flesch_kincaid_grade"] >= 10
    
    def test_formality_empty_text(self):
        """Test empty text formality analysis."""
        text = ""
        result = compute_formality(text)
        
        assert "score" in result
        assert "bucket" in result
        assert "confidence" in result
        assert "details" in result
        assert "raw_emotions" in result
    
    def test_formality_response_structure(self):
        """Test that formality response has the correct structure."""
        text = "The cat is on the mat."
        result = compute_formality(text)
        
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
    
    def test_formality_raw_emotions_structure(self):
        """Test that formality raw_emotions has the correct structure."""
        text = "The cat is on the mat."
        result = compute_formality(text)
        
        raw_emotions = result["raw_emotions"]
        assert len(raw_emotions) == 3
        
        # Check each readability metric
        metrics = ["flesch_kincaid_grade", "gunning_fog_index", "dale_chall_score"]
        for metric in metrics:
            emotion = next((e for e in raw_emotions if e["label"] == metric), None)
            assert emotion is not None
            assert "score" in emotion
            assert isinstance(emotion["score"], (int, float))
    
    def test_complexity_simple(self):
        """Test simple text complexity analysis."""
        text = "The cat is on the mat. The dog is in the yard."
        result = compute_complexity(text)
        
        assert result["bucket"] == "simple"
        assert result["score"] == 0.3
        assert result["details"]["complexity_factors"]["high_lexical_density"] == False
        assert result["details"]["complexity_factors"]["long_sentences"] == False
    
    def test_complexity_moderate(self):
        """Test moderate text complexity analysis."""
        text = "The magnificent cat gracefully leaped over the ancient wall while the curious dog watched intently from the garden."
        result = compute_complexity(text)
        
        assert result["bucket"] == "moderate"
        assert result["score"] == 0.6
        # Should have either high lexical density or long sentences
        assert (result["details"]["complexity_factors"]["high_lexical_density"] or 
                result["details"]["complexity_factors"]["long_sentences"])
    
    def test_complexity_complex(self):
        """Test complex text complexity analysis."""
        text = "The sophisticated implementation demonstrates exceptional lexical density through the utilization of advanced vocabulary and intricate sentence structures that challenge conventional comprehension paradigms."
        result = compute_complexity(text)
        
        assert result["bucket"] == "complex"
        assert result["score"] == 0.9
        assert result["details"]["complexity_factors"]["high_lexical_density"] == True
        assert result["details"]["complexity_factors"]["long_sentences"] == True
    
    def test_complexity_empty_text(self):
        """Test empty text complexity analysis."""
        text = ""
        result = compute_complexity(text)
        
        assert "score" in result
        assert "bucket" in result
        assert "confidence" in result
        assert "details" in result
        assert "raw_emotions" in result
    
    def test_complexity_response_structure(self):
        """Test that complexity response has the correct structure."""
        text = "The cat is on the mat."
        result = compute_complexity(text)
        
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
    
    def test_complexity_raw_emotions_structure(self):
        """Test that complexity raw_emotions has the correct structure."""
        text = "The cat is on the mat."
        result = compute_complexity(text)
        
        raw_emotions = result["raw_emotions"]
        assert len(raw_emotions) == 2
        
        # Check lexical density emotion
        density_emotion = next((e for e in raw_emotions if e["label"] == "lexical_density"), None)
        assert density_emotion is not None
        assert "score" in density_emotion
        assert 0 <= density_emotion["score"] <= 1
        
        # Check average sentence length emotion
        length_emotion = next((e for e in raw_emotions if e["label"] == "avg_sentence_length"), None)
        assert length_emotion is not None
        assert "score" in length_emotion
        assert 0 <= length_emotion["score"] <= 1
    
    def test_complexity_confidence_calculation(self):
        """Test complexity confidence calculation based on text length."""
        # Short text (low confidence)
        short_text = "The cat is on the mat."
        short_result = compute_complexity(short_text)
        
                # Long text (higher confidence)
        long_text = "The magnificent cat gracefully leaped over the ancient wall while the curious dog watched intently from the garden. The beautiful bird sang sweetly in the morning light as the gentle breeze rustled through the leaves. The majestic mountains stood tall in the distance, their peaks covered with pristine snow that glistened in the sunlight. The tranquil lake reflected the sky like a perfect mirror, creating a breathtaking scene of natural beauty and serenity."
        long_result = compute_complexity(long_text)

        assert short_result["confidence"] < long_result["confidence"]
        assert long_result["confidence"] == 1.0  # Should be capped at 1.0
    
    def test_lexical_density_calculation(self):
        """Test lexical density calculation."""
        # High lexical density text (many content words)
        high_density_text = "The magnificent cat gracefully leaped over the ancient wall."
        high_result = compute_complexity(high_density_text)
        
        # Low lexical density text (many function words)
        low_density_text = "The cat is on the mat and the dog is in the yard."
        low_result = compute_complexity(low_density_text)
        
        assert high_result["details"]["lexical_density"] > low_result["details"]["lexical_density"]
    
    def test_sentence_length_calculation(self):
        """Test average sentence length calculation."""
        # Long sentences
        long_sentences_text = "The magnificent cat gracefully leaped over the ancient wall while the curious dog watched intently from the garden and the beautiful bird sang sweetly in the morning light."
        long_result = compute_complexity(long_sentences_text)
        
        # Short sentences
        short_sentences_text = "The cat is on the mat. The dog is in the yard. The bird is in the tree."
        short_result = compute_complexity(short_sentences_text)
        
        assert long_result["details"]["average_sentence_length"] > short_result["details"]["average_sentence_length"]
    
    def test_complexity_factors(self):
        """Test complexity factors calculation."""
        text = "The sophisticated implementation demonstrates exceptional lexical density through the utilization of advanced vocabulary."
        result = compute_complexity(text)
        
        factors = result["details"]["complexity_factors"]
        assert "high_lexical_density" in factors
        assert "long_sentences" in factors
        assert isinstance(factors["high_lexical_density"], bool)
        assert isinstance(factors["long_sentences"], bool)
    
    def test_formality_grade_levels(self):
        """Test formality grade level classifications."""
        # Beginner level
        beginner_text = "The cat is on the mat."
        beginner_result = compute_formality(beginner_text)
        assert beginner_result["details"]["education_level"] == "beginner"
        
        # Intermediate level
        intermediate_text = "The weather is pleasant today and the temperature is moderate."
        intermediate_result = compute_formality(intermediate_text)
        assert intermediate_result["details"]["education_level"] == "intermediate"
        
        # Advanced level
        advanced_text = "The comprehensive analysis demonstrates substantial improvements in operational efficiency."
        advanced_result = compute_formality(advanced_text)
        assert advanced_result["details"]["education_level"] == "advanced"
    
    def test_edge_case_punctuation(self):
        """Test text with various punctuation marks."""
        text = "The cat!!! is on the mat??? The dog... is in the yard."
        result = compute_formality(text)
        
        assert "score" in result
        assert "bucket" in result
        assert "confidence" in result
    
    def test_edge_case_numbers_and_symbols(self):
        """Test text with numbers and symbols."""
        text = "The product costs $100 and has 5 stars. It's great!"
        result = compute_complexity(text)
        
        assert "score" in result
        assert "bucket" in result
        assert "confidence" in result
        assert result["details"]["total_words"] > 0
        assert result["details"]["content_words"] > 0 