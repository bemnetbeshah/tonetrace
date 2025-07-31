from profile.style_profile import StyleProfile

# Create a new style profile
profile = StyleProfile()

# Example analysis results
sample_analysis = {
    "tone": "professional",
    "emotion": "neutral",
    "sentiment": {"polarity": 0.2},
    "lexical_diversity": {"score": 0.75},
    "formality": {"grade": 0.8},
    "complexity": {
        "sentence_length": 15.5,
        "lexical_density": 0.65
    },
    "passive_voice": {"ratio": 0.1},
    "hedging": {"count": 2}
}

# Update the profile with the analysis
profile.update(sample_analysis)

# Print the current state
print("Style Profile after first analysis:")
print(f"Total texts: {profile.total_texts}")
print(f"Tone distribution: {profile.tone_distribution}")
print(f"Average sentiment: {profile.average_sentiment:.3f}")
print(f"Average lexical diversity: {profile.average_lexical_diversity:.3f}")
print(f"Average formality: {profile.average_formality:.3f}")
print(f"Hedging count: {profile.hedging_count}")

# Add another analysis
second_analysis = {
    "tone": "casual",
    "emotion": "positive",
    "sentiment": {"polarity": 0.7},
    "lexical_diversity": {"score": 0.6},
    "formality": {"grade": 0.3},
    "complexity": {
        "sentence_length": 12.0,
        "lexical_density": 0.55
    },
    "passive_voice": {"ratio": 0.05},
    "hedging": {"count": 1}
}

profile.update(second_analysis)

print("\nStyle Profile after second analysis:")
print(f"Total texts: {profile.total_texts}")
print(f"Tone distribution: {profile.tone_distribution}")
print(f"Average sentiment: {profile.average_sentiment:.3f}")
print(f"Average lexical diversity: {profile.average_lexical_diversity:.3f}")
print(f"Average formality: {profile.average_formality:.3f}")
print(f"Hedging count: {profile.hedging_count}") 