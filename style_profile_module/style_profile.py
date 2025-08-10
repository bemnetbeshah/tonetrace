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
    
    # New fields for additional analyzers
    grammar_error_counts: List[int] = field(default_factory=list)
    average_grammar_errors: float = 0.0
    
    lexical_richness_scores: List[float] = field(default_factory=list)
    average_lexical_richness: float = 0.0
    
    readability_scores: Dict[str, List[float]] = field(default_factory=lambda: {
        "flesch_kincaid_grade": [],
        "smog_index": [],
        "gunning_fog": [],
        "dale_chall_score": []
    })
    average_readability: Dict[str, float] = field(default_factory=lambda: {
        "flesch_kincaid_grade": 0.0,
        "smog_index": 0.0,
        "gunning_fog": 0.0,
        "dale_chall_score": 0.0
    })
    
    total_texts: int = 0

    def to_dict(self) -> Dict:
        """Convert the StyleProfile to a dictionary for storage."""
        return {
            "tone_distribution": self.tone_distribution,
            "emotion_distribution": self.emotion_distribution,
            "sentiment_history": self.sentiment_history,
            "average_sentiment": self.average_sentiment,
            "lexical_diversity_scores": self.lexical_diversity_scores,
            "average_lexical_diversity": self.average_lexical_diversity,
            "formality_grades": self.formality_grades,
            "average_formality": self.average_formality,
            "complexity": self.complexity,
            "passive_voice_ratios": self.passive_voice_ratios,
            "hedging_count": self.hedging_count,
            "grammar_error_counts": self.grammar_error_counts,
            "average_grammar_errors": self.average_grammar_errors,
            "lexical_richness_scores": self.lexical_richness_scores,
            "average_lexical_richness": self.average_lexical_richness,
            "readability_scores": self.readability_scores,
            "average_readability": self.average_readability,
            "total_texts": self.total_texts
        }

    @classmethod
    def from_dict(cls, data: Dict) -> 'StyleProfile':
        """Create a StyleProfile from a dictionary."""
        return cls(
            tone_distribution=data.get("tone_distribution", {}),
            emotion_distribution=data.get("emotion_distribution", {}),
            sentiment_history=data.get("sentiment_history", []),
            average_sentiment=data.get("average_sentiment", 0.0),
            lexical_diversity_scores=data.get("lexical_diversity_scores", []),
            average_lexical_diversity=data.get("average_lexical_diversity", 0.0),
            formality_grades=data.get("formality_grades", []),
            average_formality=data.get("average_formality", 0.0),
            complexity=data.get("complexity", {"sentence_length": [], "lexical_density": []}),
            passive_voice_ratios=data.get("passive_voice_ratios", []),
            hedging_count=data.get("hedging_count", 0),
            grammar_error_counts=data.get("grammar_error_counts", []),
            average_grammar_errors=data.get("average_grammar_errors", 0.0),
            lexical_richness_scores=data.get("lexical_richness_scores", []),
            average_lexical_richness=data.get("average_lexical_richness", 0.0),
            readability_scores=data.get("readability_scores", {
                "flesch_kincaid_grade": [],
                "smog_index": [],
                "gunning_fog": [],
                "dale_chall_score": []
            }),
            average_readability=data.get("average_readability", {
                "flesch_kincaid_grade": 0.0,
                "smog_index": 0.0,
                "gunning_fog": 0.0,
                "dale_chall_score": 0.0
            }),
            total_texts=data.get("total_texts", 0)
        )

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
        
        # Update grammar error count
        grammar_errors = new_analysis.get("grammar", {}).get("num_errors", 0)
        self.grammar_error_counts.append(grammar_errors)
        self.average_grammar_errors = sum(self.grammar_error_counts) / len(self.grammar_error_counts)
        
        # Update lexical richness
        lexical_richness = new_analysis.get("lexical_richness", {}).get("score", 0)
        self.lexical_richness_scores.append(lexical_richness)
        self.average_lexical_richness = sum(self.lexical_richness_scores) / len(self.lexical_richness_scores)
        
        # Update readability scores
        readability_data = new_analysis.get("readability", {})
        for metric in ["flesch_kincaid_grade", "smog_index", "gunning_fog", "dale_chall_score"]:
            if metric in readability_data:
                self.readability_scores[metric].append(readability_data[metric])
                self.average_readability[metric] = sum(self.readability_scores[metric]) / len(self.readability_scores[metric]) 