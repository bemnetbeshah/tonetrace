from .style_profile import StyleProfile
from datetime import datetime


def update_style_profile(profile: StyleProfile, new_analysis: dict) -> StyleProfile:
    """
    Update the style profile with new analysis results.
    
    Expected analysis structure:
    {
        "tone": "neutral",
        "sentiment": {"polarity": 0.25, "subjectivity": 0.5},
        "formality": {"flesch_kincaid_grade": 12.5, ...},
        "complexity": {"sentence_length": 17.3, "lexical_density": 0.48},
        "passive_voice": {"score": 0.1},
        "lexical_diversity": {"score": 0.75},
        "hedging": {"score": 2},
        "grammar": {"num_errors": 3, "errors": [...]},
        "lexical_richness": {"score": 0.8},
        "readability": {
            "flesch_kincaid_grade": 12.5,
            "smog_index": 14.2,
            "gunning_fog": 15.1,
            "dale_chall_score": 8.5
        }
    }
    """
    # Update total texts count
    profile.total_texts += 1
    
    # Update timestamp
    profile.last_updated = datetime.utcnow().isoformat()

    # Tone distribution
    tone = new_analysis.get("tone")
    if tone:
        profile.tone_distribution[tone] = profile.tone_distribution.get(tone, 0) + 1

    # Sentiment average (rolling average calculation)
    sentiment = new_analysis.get("sentiment", {}).get("polarity")
    if sentiment is not None:
        profile.average_sentiment = (profile.average_sentiment * (profile.total_texts - 1) + sentiment) / profile.total_texts

    # Lexical diversity average
    diversity = new_analysis.get("lexical_diversity", {}).get("score")
    if diversity is not None:
        profile.average_lexical_diversity = (profile.average_lexical_diversity * (profile.total_texts - 1) + diversity) / profile.total_texts

    # Formality average
    grade = new_analysis.get("formality", {}).get("flesch_kincaid_grade")
    if grade is not None:
        profile.average_formality = (profile.average_formality * (profile.total_texts - 1) + grade) / profile.total_texts

    # Complexity averages
    complexity = new_analysis.get("complexity", {})
    if "sentence_length" in complexity:
        sentence_length = complexity["sentence_length"]
        profile.average_sentence_length = (profile.average_sentence_length * (profile.total_texts - 1) + sentence_length) / profile.total_texts
    if "lexical_density" in complexity:
        lexical_density = complexity["lexical_density"]
        profile.average_lexical_density = (profile.average_lexical_density * (profile.total_texts - 1) + lexical_density) / profile.total_texts

    # Passive voice average
    passive_ratio = new_analysis.get("passive_voice", {}).get("score")
    if passive_ratio is not None:
        profile.average_passive_voice_ratio = (profile.average_passive_voice_ratio * (profile.total_texts - 1) + passive_ratio) / profile.total_texts

    # Hedging count (cumulative)
    hedges = new_analysis.get("hedging", {}).get("score", 0)
    profile.total_hedging_count += hedges
    
    # Grammar errors average
    grammar_errors = new_analysis.get("grammar", {}).get("num_errors")
    if grammar_errors is not None:
        profile.average_grammar_errors = (profile.average_grammar_errors * (profile.total_texts - 1) + grammar_errors) / profile.total_texts
    
    # Lexical richness average
    lexical_richness = new_analysis.get("lexical_richness", {}).get("score")
    if lexical_richness is not None:
        profile.average_lexical_richness = (profile.average_lexical_richness * (profile.total_texts - 1) + lexical_richness) / profile.total_texts
    
    # Readability averages
    readability_data = new_analysis.get("readability", {})
    for metric in ["flesch_kincaid_grade", "smog_index", "gunning_fog", "dale_chall_score"]:
        if metric in readability_data:
            current_avg = profile.average_readability[metric]
            new_value = readability_data[metric]
            profile.average_readability[metric] = (current_avg * (profile.total_texts - 1) + new_value) / profile.total_texts

    return profile 