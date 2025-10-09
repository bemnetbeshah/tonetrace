"""
Demo script for the Lexical Richness Analyzer.

This script demonstrates how the lexical richness analyzer works with different types of text,
showing how it measures vocabulary sophistication using Zipf frequency scores.
"""

from analyzers.lexical_richness import analyze_lexical_richness

def demo_lexical_richness():
    """Demonstrate lexical richness analysis with different text samples."""
    
    # Sample texts with varying vocabulary sophistication
    samples = [
        {
            "name": "Basic Vocabulary",
            "text": "The cat sat on the mat. It was a nice day. The sun was shining brightly."
        },
        {
            "name": "Moderate Vocabulary", 
            "text": "The intelligent student carefully examined the complex problem and discovered an innovative solution."
        },
        {
            "name": "Advanced Vocabulary",
            "text": "The sophisticated lexicon demonstrates exceptional erudition and profound intellectual capacity."
        },
        {
            "name": "Academic Text",
            "text": "The epistemological framework necessitates comprehensive analysis of ontological presuppositions."
        }
    ]
    
    print("=" * 80)
    print("LEXICAL RICHNESS ANALYZER DEMO")
    print("=" * 80)
    print()
    
    for sample in samples:
        print(f"📝 {sample['name']}")
        print(f"Text: {sample['text']}")
        print()
        
        result = analyze_lexical_richness(sample['text'])
        
        print(f"🏷️  Classification: {result['bucket'].upper()}")
        print(f"📊 Score: {result['score']}")
        print(f"🎯 Confidence: {result['confidence']}")
        print()
        
        details = result['details']
        print(f"📈 Average Zipf Score: {details['avg_zipf_score']} (lower = more sophisticated)")
        print(f"🔍 Rare Words: {details['num_advanced_words']} out of {details['total_tokens']} ({details['percent_rare_words']:.1%})")
        print()
        
        vocab = details['vocabulary_sophistication']
        print("📚 Vocabulary Breakdown:")
        print(f"   • Very Rare Words (< 3.0): {vocab['very_rare_words']}")
        print(f"   • Rare Words (3.0-4.5): {vocab['rare_words']}")
        print(f"   • Common Words (4.5-6.0): {vocab['common_words']}")
        print(f"   • Very Common Words (> 6.0): {vocab['very_common_words']}")
        print()
        
        zipf_dist = details['zipf_distribution']
        print(f"📊 Zipf Distribution: Min={zipf_dist['min_score']}, Median={zipf_dist['median_score']}, Max={zipf_dist['max_score']}")
        print()
        print("-" * 80)
        print()

if __name__ == "__main__":
    demo_lexical_richness() 