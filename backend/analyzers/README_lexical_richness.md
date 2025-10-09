# Lexical Richness Analyzer

The Lexical Richness Analyzer helps teachers track student vocabulary growth and sophistication over time, providing insights into how students are developing more advanced writing skills and expanding their academic vocabulary. This tool is part of ToneTrace's mission to give teachers **superpowers** — the insights they need to ensure no student feels invisible in their writing journey.

## Educational Purpose

This analyzer helps teachers understand **vocabulary quality** in student writing, complementing diversity metrics to give a complete picture of lexical development. By tracking how students progress from basic to sophisticated vocabulary, teachers can identify students who need vocabulary support and celebrate those showing advanced growth.

## Student Vocabulary Metrics

| Metric | Description | Teacher Insight |
|--------|-------------|-----------------|
| `avg_zipf_score` | Average word frequency score | Lower scores indicate more sophisticated, academic vocabulary development |
| `percent_rare_words` | % of words below Zipf 4.5 | Higher percentages show students expanding beyond basic vocabulary |
| `num_advanced_words` | Count of rare words used | Raw count helps track vocabulary growth over time |
| `total_tokens` | Vocabulary sample size | Indicates confidence in analysis and student engagement |

## Student Vocabulary Development Levels

- **Sophisticated** (score: 0.9): Students using very advanced, academic vocabulary (< 4.0 Zipf) with >30% rare words
- **Advanced** (score: 0.7): Students showing strong vocabulary growth (< 5.0 Zipf) with >15% rare words  
- **Developing** (score: 0.5): Students expanding vocabulary appropriately (< 6.0 Zipf) with >5% rare words
- **Needs Support** (score: 0.3): Students using primarily basic vocabulary (≥ 6.0 Zipf) or <5% rare words

## Teacher Usage

### Analyzing Student Writing

```python
from analyzers.lexical_richness import analyze_lexical_richness

# Analyze a student's writing sample
student_writing = "The sophisticated lexicon demonstrates exceptional erudition."
result = analyze_lexical_richness(student_writing)

print(f"Student Vocabulary Level: {result['bucket']}")
print(f"Development Score: {result['score']}")
print(f"Vocabulary Sophistication: {result['details']['avg_zipf_score']}")
print(f"Advanced Words Used: {result['details']['percent_rare_words']:.1%}")

# Use this data to provide targeted vocabulary support or celebrate growth
```

### Teacher Dashboard Integration

```bash
POST /analyze/lexical-richness
Content-Type: application/json

{
    "text": "Student's writing sample to analyze",
    "student_id": "student_identifier_for_progress_tracking"
}
```

## Student Vocabulary Analysis Output

```json
{
    "score": 0.9,
    "bucket": "sophisticated",
    "vocabulary_metrics": [
        {"label": "avg_zipf_score", "score": 0.525},
        {"label": "percent_rare_words", "score": 0.875},
        {"label": "num_advanced_words", "score": 0.14}
    ],
    "confidence": 0.267,
    "details": {
        "avg_zipf_score": 3.8,
        "percent_rare_words": 0.875,
        "num_advanced_words": 7,
        "total_tokens": 8,
        "rare_threshold": 4.5,
        "vocabulary_sophistication": {
            "very_rare_words": 1,
            "rare_words": 6,
            "common_words": 1,
            "very_common_words": 0
        },
        "zipf_distribution": {
            "min_score": 2.39,
            "max_score": 4.71,
            "median_score": 4.05
        }
    }
}
```

This output helps teachers understand:
- **Student's current vocabulary level** (sophisticated in this example)
- **Growth indicators** (87.5% rare words shows strong development)
- **Specific vocabulary breakdown** for targeted instruction
- **Confidence level** in the analysis for reliable insights

## Teacher's Guide to Zipf Scores

Understanding vocabulary sophistication levels helps teachers provide appropriate support:

- **< 3.0**: Very rare words (academic, specialized vocabulary) - Students showing exceptional vocabulary growth
- **3.0 - 4.5**: Rare words (advanced vocabulary) - Students developing strong academic vocabulary
- **4.5 - 6.0**: Common words (everyday vocabulary) - Students using appropriate grade-level vocabulary
- **> 6.0**: Very common words (basic vocabulary) - Students who may need vocabulary development support

## Dependencies

- `spacy` - For tokenization and stop word removal
- `wordfreq` - For Zipf frequency scores
- `en_core_web_sm` - English language model for SpaCy

## Testing

Run the tests with:

```bash
python -m pytest tests/test_lexical_richness.py -v
```

## Educational Demo

See `examples/lexical_richness_demo.py` for a comprehensive demonstration showing how teachers can use this analyzer to track student vocabulary development across different writing samples and grade levels.

---

**Built with ❤️ for educators and students everywhere**

*Helping teachers understand and support student vocabulary growth.* 