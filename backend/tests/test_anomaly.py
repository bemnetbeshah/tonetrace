"""
Tests for anomaly detection functionality.
"""

import pytest
import numpy as np
from style_profile_module.style_profile import StyleProfile
from analyzers.anomaly import detect_anomaly, percentage_diff, tone_similarity_score


class TestAnomalyDetection:
    """Test cases for anomaly detection functionality."""
    
    def test_percentage_diff(self):
        """Test percentage difference calculation."""
        # Test normal case
        assert percentage_diff(10, 8) == 0.25  # (10-8)/8 = 0.25
        
        # Test zero baseline
        assert percentage_diff(5, 0) == 1.0
        
        # Test both zero
        assert percentage_diff(0, 0) == 0.0
        
        # Test negative values
        assert percentage_diff(-5, -10) == 0.5  # abs(-5 - (-10)) / abs(-10) = 0.5
    
    def test_tone_similarity_score(self):
        """Test tone similarity calculation."""
        # Test identical distributions
        t1 = {"formal": 0.5, "informal": 0.3, "neutral": 0.2}
        t2 = {"formal": 0.5, "informal": 0.3, "neutral": 0.2}
        assert abs(tone_similarity_score(t1, t2) - 1.0) < 0.001
        
        # Test completely different distributions
        t1 = {"formal": 1.0}
        t2 = {"informal": 1.0}
        assert tone_similarity_score(t1, t2) == 0.0
        
        # Test empty distributions
        assert tone_similarity_score({}, {}) == 1.0
        assert tone_similarity_score({}, {"formal": 1.0}) == 0.0
    
    def test_no_anomaly(self):
        """Test that similar profiles don't trigger anomalies."""
        # Create baseline profile
        baseline = StyleProfile()
        baseline.complexity = {
            "sentence_length": [15.0, 16.0, 14.0],
            "lexical_density": [0.65, 0.68, 0.62]
        }
        baseline.average_formality = 0.7
        baseline.average_lexical_diversity = 0.75
        baseline.average_sentiment = 0.2
        baseline.tone_distribution = {"formal": 3, "informal": 1, "neutral": 2}
        
        # Create current profile (similar to baseline)
        current = StyleProfile()
        current.complexity = {
            "sentence_length": [16.0, 15.5, 14.5],
            "lexical_density": [0.67, 0.64, 0.66]
        }
        current.average_formality = 0.72
        current.average_lexical_diversity = 0.73
        current.average_sentiment = 0.18
        current.tone_distribution = {"formal": 2, "informal": 1, "neutral": 3}
        
        result = detect_anomaly(current, baseline)
        
        assert result["anomaly"] == False
        assert len(result["anomaly_reasons"]) == 0
    
    def test_sentence_length_anomaly(self):
        """Test detection of sentence length anomaly."""
        baseline = StyleProfile()
        baseline.complexity = {"sentence_length": [15.0, 16.0, 14.0]}
        
        current = StyleProfile()
        current.complexity = {"sentence_length": [25.0, 28.0, 30.0]}  # Much longer sentences
        
        result = detect_anomaly(current, baseline)
        
        assert result["anomaly"] == True
        assert any("Sentence length deviation" in reason for reason in result["anomaly_reasons"])
    
    def test_formality_anomaly(self):
        """Test detection of formality anomaly."""
        baseline = StyleProfile()
        baseline.average_formality = 0.8  # High formality
        
        current = StyleProfile()
        current.average_formality = 0.3  # Low formality (50% drop)
        
        result = detect_anomaly(current, baseline)
        
        assert result["anomaly"] == True
        assert any("Formality deviation" in reason for reason in result["anomaly_reasons"])
    
    def test_tone_distribution_anomaly(self):
        """Test detection of tone distribution anomaly."""
        baseline = StyleProfile()
        baseline.tone_distribution = {"formal": 10, "informal": 2, "neutral": 3}
        
        current = StyleProfile()
        current.tone_distribution = {"formal": 2, "informal": 10, "neutral": 3}  # Shift to informal
        
        result = detect_anomaly(current, baseline)
        
        assert result["anomaly"] == True
        assert any("Tone distribution shift" in reason for reason in result["anomaly_reasons"])
    
    def test_multiple_anomalies(self):
        """Test detection of multiple simultaneous anomalies."""
        baseline = StyleProfile()
        baseline.complexity = {
            "sentence_length": [15.0, 16.0, 14.0],
            "lexical_density": [0.65, 0.68, 0.62]
        }
        baseline.average_formality = 0.8
        baseline.average_lexical_diversity = 0.75
        baseline.average_sentiment = 0.2
        baseline.tone_distribution = {"formal": 10, "informal": 2, "neutral": 3}
        
        current = StyleProfile()
        current.complexity = {
            "sentence_length": [25.0, 28.0, 30.0],  # Long sentences
            "lexical_density": [0.45, 0.42, 0.48]   # Low lexical density
        }
        current.average_formality = 0.3  # Low formality
        current.average_lexical_diversity = 0.45  # Low diversity
        current.average_sentiment = -0.5  # Negative sentiment
        current.tone_distribution = {"formal": 2, "informal": 10, "neutral": 3}  # Tone shift
        
        result = detect_anomaly(current, baseline)
        
        assert result["anomaly"] == True
        assert len(result["anomaly_reasons"]) >= 3  # Should detect multiple anomalies
    
    def test_empty_profiles(self):
        """Test handling of empty or incomplete profiles."""
        baseline = StyleProfile()
        current = StyleProfile()
        
        result = detect_anomaly(current, baseline)
        
        # Should not crash and should return no anomaly
        assert result["anomaly"] == False
        assert "anomaly_reasons" in result
        assert "details" in result
    
    def test_partial_data(self):
        """Test handling of profiles with partial data."""
        baseline = StyleProfile()
        baseline.average_formality = 0.7
        baseline.tone_distribution = {"formal": 5, "informal": 2}
        
        current = StyleProfile()
        current.average_formality = 0.3  # Only formality data
        # No tone distribution data
        
        result = detect_anomaly(current, baseline)
        
        # Should detect formality anomaly but not crash on missing tone data
        assert result["anomaly"] == True
        assert any("Formality deviation" in reason for reason in result["anomaly_reasons"])
        assert "tone_similarity" not in result["details"]  # Should not be calculated


if __name__ == "__main__":
    pytest.main([__file__]) 