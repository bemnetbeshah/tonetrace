#!/usr/bin/env python3
"""
Historical Data Demo - Showcasing the new database-driven approach

This script demonstrates how the refactored system works:
1. StyleProfile only stores current averages (no redundant historical data)
2. Historical data is queried directly from the database
3. Much more memory efficient and flexible
"""

import asyncio
import json
from datetime import datetime, timedelta
from typing import Dict, Any

# Mock data to simulate what would come from the database
MOCK_ANALYSIS_RESULTS = [
    {
        "submission_id": 1,
        "created_at": (datetime.utcnow() - timedelta(days=5)).isoformat(),
        "results": {
            "sentiment": {"score": 0.8, "polarity": 0.8},
            "formality": {"flesch_kincaid_grade": 12.5},
            "lexical_diversity": {"score": 0.75},
            "tone": {"bucket": "professional", "confidence": 0.9}
        }
    },
    {
        "submission_id": 2,
        "created_at": (datetime.utcnow() - timedelta(days=3)).isoformat(),
        "results": {
            "sentiment": {"score": 0.2, "polarity": 0.2},
            "formality": {"flesch_kincaid_grade": 10.2},
            "lexical_diversity": {"score": 0.68},
            "tone": {"bucket": "casual", "confidence": 0.7}
        }
    },
    {
        "submission_id": 3,
        "created_at": (datetime.utcnow() - timedelta(days=1)).isoformat(),
        "results": {
            "sentiment": {"score": -0.1, "polarity": -0.1},
            "formality": {"flesch_kincaid_grade": 14.8},
            "lexical_diversity": {"score": 0.82},
            "tone": {"bucket": "formal", "confidence": 0.95}
        }
    }
]

def simulate_style_profile_update():
    """Simulate how StyleProfile would be updated with new analysis data."""
    print("🔄 Simulating StyleProfile Update Process")
    print("=" * 50)
    
    # This would be the new simplified StyleProfile structure
    profile = {
        "total_texts": 0,
        "average_sentiment": 0.0,
        "average_formality": 0.0,
        "average_lexical_diversity": 0.0,
        "tone_distribution": {},
        "last_updated": ""
    }
    
    for i, analysis in enumerate(MOCK_ANALYSIS_RESULTS):
        print(f"\n📝 Processing Analysis #{i+1} (Submission {analysis['submission_id']})")
        
        # Update profile with new analysis
        profile["total_texts"] += 1
        
        # Calculate rolling averages (no need to store historical lists!)
        sentiment = analysis["results"]["sentiment"]["polarity"]
        profile["average_sentiment"] = (profile["average_sentiment"] * (profile["total_texts"] - 1) + sentiment) / profile["total_texts"]
        
        formality = analysis["results"]["formality"]["flesch_kincaid_grade"]
        profile["average_formality"] = (profile["average_formality"] * (profile["total_texts"] - 1) + formality) / profile["total_texts"]
        
        diversity = analysis["results"]["lexical_diversity"]["score"]
        profile["average_lexical_diversity"] = (profile["average_lexical_diversity"] * (profile["total_texts"] - 1) + diversity) / profile["total_texts"]
        
        # Update tone distribution
        tone = analysis["results"]["tone"]["bucket"]
        profile["tone_distribution"][tone] = profile["tone_distribution"].get(tone, 0) + 1
        
        print(f"   Sentiment: {sentiment:.2f} → Avg: {profile['average_sentiment']:.2f}")
        print(f"   Formality: {formality:.1f} → Avg: {profile['average_formality']:.1f}")
        print(f"   Diversity: {diversity:.2f} → Avg: {profile['average_lexical_diversity']:.2f}")
        print(f"   Tone: {tone}")
    
    print(f"\n✅ Final Profile Summary:")
    print(f"   Total texts analyzed: {profile['total_texts']}")
    print(f"   Average sentiment: {profile['average_sentiment']:.2f}")
    print(f"   Average formality: {profile['average_formality']:.1f}")
    print(f"   Average lexical diversity: {profile['average_lexical_diversity']:.2f}")
    print(f"   Tone distribution: {profile['tone_distribution']}")
    
    return profile

def simulate_historical_data_queries():
    """Simulate how historical data would be queried from the database."""
    print("\n\n📊 Simulating Historical Data Queries")
    print("=" * 50)
    
    # Simulate sentiment history query
    print("\n🔍 Sentiment History Query (Last 10 entries)")
    sentiment_history = [
        {
            "submission_id": result["submission_id"],
            "score": result["results"]["sentiment"]["score"],
            "polarity": result["results"]["sentiment"]["polarity"],
            "date": result["created_at"],
            "text_preview": f"Text from submission {result['submission_id']}..."
        }
        for result in MOCK_ANALYSIS_RESULTS
    ]
    
    for entry in sentiment_history:
        print(f"   {entry['date']}: Score={entry['score']:.2f}, Polarity={entry['polarity']:.2f}")
    
    # Simulate formality trends query
    print("\n📈 Formality Trends Query (Last 7 days)")
    formality_trends = [
        {
            "submission_id": result["submission_id"],
            "flesch_kincaid_grade": result["results"]["formality"]["flesch_kincaid_grade"],
            "date": result["created_at"],
            "text_preview": f"Text from submission {result['submission_id']}..."
        }
        for result in MOCK_ANALYSIS_RESULTS
    ]
    
    for trend in formality_trends:
        print(f"   {trend['date']}: Grade {trend['flesch_kincaid_grade']:.1f}")
    
    # Simulate tone distribution over time
    print("\n🎭 Tone Distribution Over Time (Last 30 days)")
    tone_distribution = {}
    for result in MOCK_ANALYSIS_RESULTS:
        tone = result["results"]["tone"]["bucket"]
        if tone not in tone_distribution:
            tone_distribution[tone] = []
        
        tone_distribution[tone].append({
            "submission_id": result["submission_id"],
            "confidence": result["results"]["tone"]["confidence"],
            "date": result["created_at"],
            "text_preview": f"Text from submission {result['submission_id']}..."
        })
    
    for tone, entries in tone_distribution.items():
        print(f"   {tone.capitalize()}: {len(entries)} submissions")
        for entry in entries:
            print(f"     {entry['date']}: Confidence {entry['confidence']:.2f}")

def show_memory_efficiency_comparison():
    """Show the memory efficiency improvement."""
    print("\n\n💾 Memory Efficiency Comparison")
    print("=" * 50)
    
    # Old approach (storing historical lists)
    old_memory_usage = {
        "sentiment_history": [0.8, 0.2, -0.1],  # 3 floats
        "formality_grades": [12.5, 10.2, 14.8],  # 3 floats
        "lexical_diversity_scores": [0.75, 0.68, 0.82],  # 3 floats
        "complexity": {
            "sentence_length": [17.3, 15.2, 19.1],  # 3 floats
            "lexical_density": [0.48, 0.42, 0.55]   # 3 floats
        }
    }
    
    # New approach (only averages)
    new_memory_usage = {
        "average_sentiment": 0.3,  # 1 float
        "average_formality": 12.5,  # 1 float
        "average_lexical_diversity": 0.75,  # 1 float
        "average_sentence_length": 17.2,  # 1 float
        "average_lexical_density": 0.48   # 1 float
    }
    
    print("📊 Old Approach (Storing Historical Lists):")
    print(f"   Sentiment history: {len(old_memory_usage['sentiment_history'])} values")
    print(f"   Formality grades: {len(old_memory_usage['formality_grades'])} values")
    print(f"   Lexical diversity: {len(old_memory_usage['lexical_diversity_scores'])} values")
    print(f"   Complexity metrics: {len(old_memory_usage['complexity']['sentence_length'])} values each")
    
    print("\n✅ New Approach (Only Averages):")
    print(f"   Sentiment: 1 average value")
    print(f"   Formality: 1 average value")
    print(f"   Lexical diversity: 1 average value")
    print(f"   Complexity: 1 average value each")
    
    print("\n💡 Benefits of New Approach:")
    print("   • No redundant data storage")
    print("   • Memory usage stays constant regardless of history size")
    print("   • Historical data always fresh from database")
    print("   • Can query any time range or filter criteria")
    print("   • Better database normalization")

def main():
    """Main demo function."""
    print("🚀 Historical Data System Demo")
    print("=" * 60)
    print("This demo shows the new database-driven approach to historical data")
    print("instead of storing redundant lists in StyleProfile objects.\n")
    
    # Run the simulations
    profile = simulate_style_profile_update()
    simulate_historical_data_queries()
    show_memory_efficiency_comparison()
    
    print("\n\n🎯 Summary of Changes:")
    print("1. ✅ StyleProfile now only stores current averages and aggregated stats")
    print("2. ✅ Historical data is queried directly from the database")
    print("3. ✅ New API endpoints for different types of historical data")
    print("4. ✅ Memory efficient - no redundant storage of historical lists")
    print("5. ✅ Flexible queries - can filter by date, limit results, etc.")
    print("6. ✅ Better separation of concerns - profile vs. history")
    
    print("\n🔗 New API Endpoints Available:")
    print("   GET /profile/{user_id}/history/sentiment")
    print("   GET /profile/{user_id}/history/formality")
    print("   GET /profile/{user_id}/history/lexical-diversity")
    print("   GET /profile/{user_id}/history/readability")
    print("   GET /profile/{user_id}/history/grammar")
    print("   GET /profile/{user_id}/history/tone")
    print("   GET /profile/{user_id}/performance")

if __name__ == "__main__":
    main() 