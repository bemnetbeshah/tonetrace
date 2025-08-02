"""
Anomaly detection module for identifying deviations in writing style.

This module provides functions to compare current writing style profiles
against baseline profiles to detect anomalies in writing patterns.
"""

from typing import List, Dict, Any
import numpy as np
from style_profile_module.style_profile import StyleProfile


def percentage_diff(a: float, b: float) -> float:
    """
    Calculate the percentage difference between two values.
    
    Args:
        a: First value
        b: Second value (baseline)
        
    Returns:
        Percentage difference as a float (0.0 = no difference, 1.0 = 100% difference)
    """
    if b == 0:
        return 1.0 if a != 0 else 0.0
    return abs(a - b) / abs(b)


def tone_similarity_score(t1: Dict[str, float], t2: Dict[str, float]) -> float:
    """
    Calculate cosine similarity between two tone distributions.
    
    Args:
        t1: First tone distribution
        t2: Second tone distribution (baseline)
        
    Returns:
        Cosine similarity score (0.0 = completely different, 1.0 = identical)
    """
    # Handle empty distributions
    if not t1 and not t2:
        return 1.0  # Both empty means they're identical
    if not t1 or not t2:
        return 0.0  # One empty, one not means they're different
    
    # Get all unique tone categories
    all_tones = set(t1.keys()) | set(t2.keys())
    if not all_tones:
        return 1.0
    
    # Create vectors for comparison
    vec1 = [t1.get(tone, 0.0) for tone in all_tones]
    vec2 = [t2.get(tone, 0.0) for tone in all_tones]
    
    # Convert to numpy arrays
    vec1 = np.array(vec1)
    vec2 = np.array(vec2)
    
    # Calculate cosine similarity
    dot_product = np.dot(vec1, vec2)
    norm1 = np.linalg.norm(vec1)
    norm2 = np.linalg.norm(vec2)
    
    if norm1 == 0 or norm2 == 0:
        return 0.0
    
    return dot_product / (norm1 * norm2)


def detect_anomaly(current: StyleProfile, baseline: StyleProfile) -> Dict[str, Any]:
    """
    Detect anomalies by comparing current style profile against baseline.
    
    Args:
        current: Current style profile to analyze
        baseline: Baseline style profile for comparison
        
    Returns:
        Dictionary containing anomaly detection results:
        - anomaly: Boolean indicating if anomaly was detected
        - anomaly_reasons: List of reasons for the anomaly
        - details: Detailed comparison metrics
    """
    reasons = []
    details = {}
    
    # Compare average sentence length (threshold: ±15%)
    if current.complexity.get("sentence_length") and baseline.complexity.get("sentence_length"):
        current_avg_sentence = np.mean(current.complexity["sentence_length"])
        baseline_avg_sentence = np.mean(baseline.complexity["sentence_length"])
        
        sentence_diff = percentage_diff(current_avg_sentence, baseline_avg_sentence)
        details["sentence_length_diff"] = sentence_diff
        
        if sentence_diff > 0.15:
            reasons.append(f"Sentence length deviation: {sentence_diff:.1%}")
    
    # Compare lexical density (threshold: ±15%)
    if current.complexity.get("lexical_density") and baseline.complexity.get("lexical_density"):
        current_avg_lexical = np.mean(current.complexity["lexical_density"])
        baseline_avg_lexical = np.mean(baseline.complexity["lexical_density"])
        
        lexical_diff = percentage_diff(current_avg_lexical, baseline_avg_lexical)
        details["lexical_density_diff"] = lexical_diff
        
        if lexical_diff > 0.15:
            reasons.append(f"Lexical density deviation: {lexical_diff:.1%}")
    
    # Compare formality score (threshold: ±10%)
    if current.average_formality > 0 and baseline.average_formality > 0:
        formality_diff = percentage_diff(current.average_formality, baseline.average_formality)
        details["formality_diff"] = formality_diff
        
        if formality_diff > 0.10:
            reasons.append(f"Formality deviation: {formality_diff:.1%}")
    
    # Compare tone distribution using cosine similarity
    if current.tone_distribution and baseline.tone_distribution:
        # Convert counts to proportions for fair comparison
        current_total = sum(current.tone_distribution.values())
        baseline_total = sum(baseline.tone_distribution.values())
        
        if current_total > 0 and baseline_total > 0:
            current_tone_props = {k: v/current_total for k, v in current.tone_distribution.items()}
            baseline_tone_props = {k: v/baseline_total for k, v in baseline.tone_distribution.items()}
            
            tone_similarity = tone_similarity_score(current_tone_props, baseline_tone_props)
            details["tone_similarity"] = tone_similarity
            
            if tone_similarity < 0.85:
                reasons.append(f"Tone distribution shift: similarity {tone_similarity:.2f}")
    
    # Compare lexical diversity (threshold: ±15%)
    if current.average_lexical_diversity > 0 and baseline.average_lexical_diversity > 0:
        lexical_diversity_diff = percentage_diff(current.average_lexical_diversity, baseline.average_lexical_diversity)
        details["lexical_diversity_diff"] = lexical_diversity_diff
        
        if lexical_diversity_diff > 0.15:
            reasons.append(f"Lexical diversity deviation: {lexical_diversity_diff:.1%}")
    
    # Compare sentiment (threshold: ±20%)
    if current.average_sentiment != 0 and baseline.average_sentiment != 0:
        sentiment_diff = percentage_diff(current.average_sentiment, baseline.average_sentiment)
        details["sentiment_diff"] = sentiment_diff
        
        if sentiment_diff > 0.20:
            reasons.append(f"Sentiment deviation: {sentiment_diff:.1%}")
    
    # Determine if anomaly exists
    anomaly_detected = len(reasons) > 0
    
    return {
        "anomaly": anomaly_detected,
        "anomaly_reasons": reasons,
        "details": details
    } 