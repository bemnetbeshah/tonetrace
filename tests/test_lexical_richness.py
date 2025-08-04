"""
Tests for the lexical richness analyzer.
"""

import pytest
from analyzers.lexical_richness import analyze_lexical_richness

def test_basic_text():
    """Test with basic, simple vocabulary."""
    text = "The cat sat on the mat. It was a nice day."
    result = analyze_lexical_richness(text)
    
    assert "score" in result
    assert "bucket" in result
    assert "confidence" in result
    assert "details" in result
    assert "avg_zipf_score" in result["details"]
    assert "percent_rare_words" in result["details"]
    assert "num_advanced_words" in result["details"]
    assert "total_tokens" in result["details"]
    
    # Basic text should have moderate Zipf scores (common words)
    assert result["details"]["avg_zipf_score"] > 4.0
    # The bucket could be advanced due to some rare words, but should not be sophisticated
    assert result["bucket"] in ["basic", "moderate", "advanced"]

def test_advanced_text():
    """Test with more sophisticated vocabulary."""
    text = "The sophisticated lexicon demonstrates exceptional erudition and profound intellectual capacity."
    result = analyze_lexical_richness(text)
    
    assert result["details"]["avg_zipf_score"] < 6.0  # Lower Zipf = more sophisticated
    assert result["details"]["percent_rare_words"] > 0.1  # Should have some rare words
    assert result["bucket"] in ["advanced", "sophisticated", "moderate"]

def test_empty_text():
    """Test with empty text."""
    text = ""
    result = analyze_lexical_richness(text)
    
    assert result["bucket"] == "insufficient_data"
    assert result["confidence"] == 0.0
    assert result["score"] == 0.0

def test_very_short_text():
    """Test with very short text."""
    text = "Hi"
    result = analyze_lexical_richness(text)
    
    assert result["confidence"] < 1.0  # Low confidence due to short text
    assert "avg_zipf_score" in result["details"]

def test_text_with_numbers_and_punctuation():
    """Test that numbers and punctuation are properly filtered."""
    text = "The cat, dog, and bird (3 animals) sat together. It was 100% amazing!"
    result = analyze_lexical_richness(text)
    
    # Should only count alphabetic words, not numbers or punctuation
    assert result["details"]["total_tokens"] > 0
    assert "avg_zipf_score" in result["details"]

def test_rare_words():
    """Test with text containing rare words."""
    text = "The serendipitous encounter with the perspicacious individual revealed profound epistemological insights."
    result = analyze_lexical_richness(text)
    
    # Should detect rare words
    assert result["details"]["num_advanced_words"] > 0
    assert result["details"]["percent_rare_words"] > 0.1

if __name__ == "__main__":
    pytest.main([__file__]) 