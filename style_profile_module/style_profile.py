from dataclasses import dataclass, field
from typing import List, Dict


@dataclass
class StyleProfile:
    # Tone and emotion distribution (aggregated counts)
    tone_distribution: Dict[str, int] = field(default_factory=dict)
    emotion_distribution: Dict[str, int] = field(default_factory=dict)

    # Current averages (computed from database, not stored lists)
    average_sentiment: float = 0.0
    average_lexical_diversity: float = 0.0
    average_formality: float = 0.0
    average_grammar_errors: float = 0.0
    average_lexical_richness: float = 0.0
    
    # Complexity averages
    average_sentence_length: float = 0.0
    average_lexical_density: float = 0.0
    
    # Passive voice and hedging averages
    average_passive_voice_ratio: float = 0.0
    total_hedging_count: int = 0
    
    # Readability averages
    average_readability: Dict[str, float] = field(default_factory=lambda: {
        "flesch_kincaid_grade": 0.0,
        "smog_index": 0.0,
        "gunning_fog": 0.0,
        "dale_chall_score": 0.0
    })
    
    # Overall statistics
    total_texts: int = 0
    last_updated: str = ""

    def to_dict(self) -> Dict:
        """Convert the StyleProfile to a dictionary for storage."""
        return {
            "tone_distribution": self.tone_distribution,
            "emotion_distribution": self.emotion_distribution,
            "average_sentiment": self.average_sentiment,
            "average_lexical_diversity": self.average_lexical_diversity,
            "average_formality": self.average_formality,
            "average_grammar_errors": self.average_grammar_errors,
            "average_lexical_richness": self.average_lexical_richness,
            "average_sentence_length": self.average_sentence_length,
            "average_lexical_density": self.average_lexical_density,
            "average_passive_voice_ratio": self.average_passive_voice_ratio,
            "total_hedging_count": self.total_hedging_count,
            "average_readability": self.average_readability,
            "total_texts": self.total_texts,
            "last_updated": self.last_updated
        }

    @classmethod
    def from_dict(cls, data: Dict) -> 'StyleProfile':
        """Create a StyleProfile from a dictionary."""
        return cls(
            tone_distribution=data.get("tone_distribution", {}),
            emotion_distribution=data.get("emotion_distribution", {}),
            average_sentiment=data.get("average_sentiment", 0.0),
            average_lexical_diversity=data.get("average_lexical_diversity", 0.0),
            average_formality=data.get("average_formality", 0.0),
            average_grammar_errors=data.get("average_grammar_errors", 0.0),
            average_lexical_richness=data.get("average_lexical_richness", 0.0),
            average_sentence_length=data.get("average_sentence_length", 0.0),
            average_lexical_density=data.get("average_lexical_density", 0.0),
            average_passive_voice_ratio=data.get("average_passive_voice_ratio", 0.0),
            total_hedging_count=data.get("total_hedging_count", 0),
            average_readability=data.get("average_readability", {
                "flesch_kincaid_grade": 0.0,
                "smog_index": 0.0,
                "gunning_fog": 0.0,
                "dale_chall_score": 0.0
            }),
            total_texts=data.get("total_texts", 0),
            last_updated=data.get("last_updated", "")
        )

    def update_averages(self, new_analysis: dict, total_texts: int):
        """Update the style profile averages with new analysis results."""
        self.total_texts = total_texts
        
        # Update tone distribution
        tone = new_analysis.get("tone")
        if tone:
            self.tone_distribution[tone] = self.tone_distribution.get(tone, 0) + 1

        # Update emotion distribution
        emotion = new_analysis.get("emotion")
        if emotion:
            self.emotion_distribution[emotion] = self.emotion_distribution.get(emotion, 0) + 1

        # Update sentiment average
        sentiment = new_analysis.get("sentiment", {}).get("polarity", 0)
        self.average_sentiment = (self.average_sentiment * (total_texts - 1) + sentiment) / total_texts

        # Update lexical diversity average
        lexical_diversity = new_analysis.get("lexical_diversity", {}).get("score", 0)
        self.average_lexical_diversity = (self.average_lexical_diversity * (total_texts - 1) + lexical_diversity) / total_texts

        # Update formality average
        formality = new_analysis.get("formality", {}).get("flesch_kincaid_grade", 0)
        self.average_formality = (self.average_formality * (total_texts - 1) + formality) / total_texts

        # Update complexity averages
        complexity_data = new_analysis.get("complexity", {})
        if "sentence_length" in complexity_data:
            sentence_length = complexity_data["sentence_length"]
            self.average_sentence_length = (self.average_sentence_length * (total_texts - 1) + sentence_length) / total_texts
        if "lexical_density" in complexity_data:
            lexical_density = complexity_data["lexical_density"]
            self.average_lexical_density = (self.average_lexical_density * (total_texts - 1) + lexical_density) / total_texts

        # Update passive voice average
        passive_voice = new_analysis.get("passive_voice", {}).get("score", 0)
        self.average_passive_voice_ratio = (self.average_passive_voice_ratio * (total_texts - 1) + passive_voice) / total_texts

        # Update hedging count
        hedging = new_analysis.get("hedging", {}).get("score", 0)
        self.total_hedging_count += hedging
        
        # Update grammar error average
        grammar_errors = new_analysis.get("grammar", {}).get("num_errors", 0)
        self.average_grammar_errors = (self.average_grammar_errors * (total_texts - 1) + grammar_errors) / total_texts
        
        # Update lexical richness average
        lexical_richness = new_analysis.get("lexical_richness", {}).get("score", 0)
        self.average_lexical_richness = (self.average_lexical_richness * (total_texts - 1) + lexical_richness) / total_texts
        
        # Update readability averages
        readability_data = new_analysis.get("readability", {})
        for metric in ["flesch_kincaid_grade", "smog_index", "gunning_fog", "dale_chall_score"]:
            if metric in readability_data:
                current_avg = self.average_readability[metric]
                new_value = readability_data[metric]
                self.average_readability[metric] = (current_avg * (total_texts - 1) + new_value) / total_texts 