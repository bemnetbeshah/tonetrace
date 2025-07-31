#!/usr/bin/env python3
"""
Example usage of the standardized analyzer responses.

This script demonstrates how all analyzers now return a consistent JSON schema:
{
    "score": float,           # Primary metric score (0.0 to 1.0 or appropriate range)
    "bucket": str,            # Categorical classification
    "raw_emotions": list,     # Detailed breakdown or additional data
    "confidence": float,      # Confidence in the analysis (0.0 to 1.0)
    "details": dict           # Additional metrics and breakdowns
}
"""

from analyzers.tone import classify_tone_model
from analyzers.sentiment import analyze_sentiment
from analyzers.style_metrics import compute_formality, compute_complexity
from analyzers.lexical import compute_lexical_diversity
from analyzers.passive_voice import detect_passive_sentences
from analyzers.hedging import detect_hedging
import json

def print_analysis_result(analyzer_name: str, result: dict):
    """Pretty print an analysis result."""
    print(f"\n{'='*60}")
    print(f"ANALYZER: {analyzer_name.upper()}")
    print(f"{'='*60}")
    print(json.dumps(result, indent=2))

def main():
    # Example text for analysis
    sample_text = """
    I believe that this innovative solution could potentially revolutionize 
    the way we approach complex problems. The methodology appears to be 
    quite sophisticated and might yield significant improvements. 
    However, I think we should carefully consider the implications 
    before proceeding with implementation.
    """
    
    print("SAMPLE TEXT:")
    print(sample_text.strip())
    
    # Run all analyzers
    analyzers = {
        "Tone Analysis": classify_tone_model,
        "Sentiment Analysis": analyze_sentiment,
        "Formality Analysis": compute_formality,
        "Complexity Analysis": compute_complexity,
        "Lexical Diversity": compute_lexical_diversity,
        "Passive Voice Detection": detect_passive_sentences,
        "Hedging Detection": detect_hedging
    }
    
    for name, analyzer_func in analyzers.items():
        try:
            result = analyzer_func(sample_text)
            print_analysis_result(name, result)
        except Exception as e:
            print(f"\nERROR in {name}: {str(e)}")
    
    print(f"\n{'='*60}")
    print("SUMMARY OF STANDARDIZED RESPONSE FORMAT")
    print(f"{'='*60}")
    print("""
    All analyzers now return a consistent JSON structure:
    
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
    
    This standardization makes it easy to:
    - Compare results across different analyzers
    - Build consistent UI components
    - Implement filtering and sorting
    - Create unified dashboards
    """)

if __name__ == "__main__":
    main() 