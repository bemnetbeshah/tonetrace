from dataclasses import dataclass, field
from typing import List, Dict


@dataclass
class StyleProfile:
    tone_distribution: Dict[str, int] = field(default_factory=dict)
    emotion_distribution: Dict[str, int] = field(default_factory=dict)

    sentiment_history: List[float] = field(default_factory=list)
    average_sentiment: float = 0.0

    lexical_diversity_scores: List[float] = field(default_factory=list)
    average_lexical_diversity: float = 0.0

    formality_grades: List[float] = field(default_factory=list)
    average_formality: float = 0.0

    complexity: Dict[str, List[float]] = field(default_factory=lambda: {
        "sentence_length": [],
        "lexical_density": []
    })

    passive_voice_ratios: List[float] = field(default_factory=list)
    hedging_count: int = 0
    total_texts: int = 0

    def update(self, new_analysis: dict):
        """Update the style profile with new analysis results."""
        self.total_texts += 1

        # Update tone distribution
        tone = new_analysis.get("tone")
        if tone:
            self.tone_distribution[tone] = self.tone_distribution.get(tone, 0) + 1

        # Update emotion distribution
        emotion = new_analysis.get("emotion")
        if emotion:
            self.emotion_distribution[emotion] = self.emotion_distribution.get(emotion, 0) + 1

        # Update sentiment history and average
        sentiment = new_analysis.get("sentiment", {}).get("polarity", 0)
        self.sentiment_history.append(sentiment)
        self.average_sentiment = sum(self.sentiment_history) / len(self.sentiment_history)

        # Update lexical diversity
        lexical_diversity = new_analysis.get("lexical_diversity", {}).get("score", 0)
        self.lexical_diversity_scores.append(lexical_diversity)
        self.average_lexical_diversity = sum(self.lexical_diversity_scores) / len(self.lexical_diversity_scores)

        # Update formality grades
        formality = new_analysis.get("formality", {}).get("grade", 0)
        self.formality_grades.append(formality)
        self.average_formality = sum(self.formality_grades) / len(self.formality_grades)

        # Update complexity metrics
        complexity_data = new_analysis.get("complexity", {})
        if "sentence_length" in complexity_data:
            self.complexity["sentence_length"].append(complexity_data["sentence_length"])
        if "lexical_density" in complexity_data:
            self.complexity["lexical_density"].append(complexity_data["lexical_density"])

        # Update passive voice ratio
        passive_voice = new_analysis.get("passive_voice", {}).get("ratio", 0)
        self.passive_voice_ratios.append(passive_voice)

        # Update hedging count
        hedging = new_analysis.get("hedging", {}).get("count", 0)
        self.hedging_count += hedging 