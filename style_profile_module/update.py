from .style_profile import StyleProfile


def update_style_profile(profile: StyleProfile, new_analysis: dict) -> StyleProfile:
    """
    Update the style profile with new analysis results.
    
    Expected analysis structure:
    {
        "tone": "neutral",
        "sentiment": {"polarity": 0.25, "subjectivity": 0.5},
        "formality": {"flesch_kincaid_grade": 12.5, ...},
        "complexity": {"sentence_length": 17.3, "lexical_density": 0.48},
        "passive_voice": {"passive_sentence_ratio": 0.1},
        "lexical_diversity": 0.75,
        "hedging_count": 2
    }
    """
    profile.total_texts += 1

    # Tone
    tone = new_analysis.get("tone")
    if tone:
        profile.tone_distribution[tone] = profile.tone_distribution.get(tone, 0) + 1

    # Sentiment
    sentiment = new_analysis.get("sentiment", {}).get("polarity")
    if sentiment is not None:
        profile.sentiment_history.append(sentiment)
        profile.average_sentiment = sum(profile.sentiment_history) / len(profile.sentiment_history)

    # Lexical diversity
    diversity = new_analysis.get("lexical_diversity")
    if diversity is not None:
        profile.lexical_diversity_scores.append(diversity)
        profile.average_lexical_diversity = sum(profile.lexical_diversity_scores) / len(profile.lexical_diversity_scores)

    # Formality
    grade = new_analysis.get("formality", {}).get("flesch_kincaid_grade")
    if grade is not None:
        profile.formality_grades.append(grade)
        profile.average_formality = sum(profile.formality_grades) / len(profile.formality_grades)

    # Complexity
    complexity = new_analysis.get("complexity", {})
    if "sentence_length" in complexity:
        profile.complexity["sentence_length"].append(complexity["sentence_length"])
    if "lexical_density" in complexity:
        profile.complexity["lexical_density"].append(complexity["lexical_density"])

    # Passive voice
    passive_ratio = new_analysis.get("passive_voice", {}).get("passive_sentence_ratio")
    if passive_ratio is not None:
        profile.passive_voice_ratios.append(passive_ratio)

    # Hedging
    hedges = new_analysis.get("hedging_count", 0)
    profile.hedging_count += hedges

    return profile 