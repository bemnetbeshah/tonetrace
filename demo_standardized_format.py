#!/usr/bin/env python3
"""
Demonstration of the standardized analyzer response format.

This script shows how all analyzers now return a consistent JSON schema
without requiring heavy dependencies like transformers.
"""

from analyzers.sentiment import analyze_sentiment
from analyzers.lexical import compute_lexical_diversity
from analyzers.hedging import detect_hedging
from analyzers.passive_voice import detect_passive_sentences
import json

def print_analysis_result(analyzer_name: str, result: dict):
    """Pretty print an analysis result."""
    print(f"\n{'='*60}")
    print(f"ANALYZER: {analyzer_name.upper()}")
    print(f"{'='*60}")
    print(json.dumps(result, indent=2))

def main():
    # Example texts for analysis
    sample_texts = {
        "Positive Sentiment": "This is absolutely wonderful! I love how everything works perfectly.",
        "High Hedging": "I think this might be a good idea, perhaps we should consider it carefully.",
        "Passive Voice": "The experiment was conducted by the researchers. The results were analyzed thoroughly.",
        "Lexical Diversity": "The sophisticated methodology employed comprehensive analytical techniques."
    }
    
    print("STANDARDIZED ANALYZER RESPONSE FORMAT DEMONSTRATION")
    print("=" * 60)
    
    # Test sentiment analysis
    print("\n1. SENTIMENT ANALYSIS")
    print("Text:", sample_texts["Positive Sentiment"])
    result = analyze_sentiment(sample_texts["Positive Sentiment"])
    print_analysis_result("Sentiment Analysis", result)
    
    # Test hedging detection
    print("\n2. HEDGING DETECTION")
    print("Text:", sample_texts["High Hedging"])
    result = detect_hedging(sample_texts["High Hedging"])
    print_analysis_result("Hedging Detection", result)
    
    # Test passive voice detection
    print("\n3. PASSIVE VOICE DETECTION")
    print("Text:", sample_texts["Passive Voice"])
    result = detect_passive_sentences(sample_texts["Passive Voice"])
    print_analysis_result("Passive Voice Detection", result)
    
    # Test lexical diversity
    print("\n4. LEXICAL DIVERSITY")
    print("Text:", sample_texts["Lexical Diversity"])
    result = compute_lexical_diversity(sample_texts["Lexical Diversity"])
    print_analysis_result("Lexical Diversity", result)
    
    print(f"\n{'='*60}")
    print("SUMMARY OF STANDARDIZED RESPONSE FORMAT")
    print(f"{'='*60}")
    print("""
    ✅ All analyzers now return a consistent JSON structure:
    
    {
        "score": 0.88,                    # Primary metric (0.0-1.0 range)
        "bucket": "persuasive",           # Categorical classification
        "raw_emotions": [                 # Detailed breakdown
            {"label": "confidence", "score": 0.92},
            {"label": "enthusiasm", "score": 0.75}
        ],
        "confidence": 0.85,               # Analysis confidence (0.0-1.0)
        "details": {                      # Additional metrics
            "top_emotion": "pride",
            "complexity_factors": {...}
        }
    }
    
    🎯 Benefits of this standardization:
    - Compare results across different analyzers
    - Build consistent UI components
    - Implement filtering and sorting
    - Create unified dashboards
    - Easy integration with frontend frameworks
    """)

if __name__ == "__main__":
    main() 