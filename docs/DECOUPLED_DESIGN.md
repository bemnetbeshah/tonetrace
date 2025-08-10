# Decoupled Database Design for Analysis Results

This document explains the new decoupled database design that stores all analyzer results in a single, generic `analysis_results` table with JSONB payloads.

## Overview

The new design follows the principle of **keeping your database decoupled from specific analyzers** and only adding columns or extra tables when you know you'll query those metrics frequently.

## Database Schema

### Core Tables

#### `users`
- Standard user management table
- No changes from original design

#### `submissions`
- One row per text submission
- No changes from original design

#### `analysis_results` (Enhanced)
```sql
CREATE TABLE analysis_results (
    id SERIAL PRIMARY KEY,
    submission_id INTEGER REFERENCES submissions(id) ON DELETE CASCADE,
    analyzer_name VARCHAR(100) NOT NULL,
    analyzer_version VARCHAR(50) DEFAULT 'v1',
    status VARCHAR(20) DEFAULT 'ok',
    error_message VARCHAR(500),
    duration_ms INTEGER,
    result_json JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

**Key Features:**
- **Generic storage**: All analyzer outputs go into `result_json`
- **Versioning**: `analyzer_version` allows safe analyzer evolution
- **Metadata**: `status`, `error_message`, `duration_ms` for monitoring
- **Indexing**: Optimized for common query patterns

#### `submission_summaries` (Optional)
```sql
CREATE TABLE submission_summaries (
    submission_id INTEGER PRIMARY KEY REFERENCES submissions(id) ON DELETE CASCADE,
    sentiment_score FLOAT,
    tone_primary VARCHAR(100),
    readability_grade FLOAT,
    updated_at TIMESTAMP DEFAULT NOW()
);
```

**Purpose**: Fast dashboard queries for frequently accessed metrics

### Indexes

```sql
-- Composite index for fetching all results of a submission
CREATE INDEX ix_analysis_results_submission_analyzer 
ON analysis_results (submission_id, analyzer_name);

-- GIN index for efficient JSON queries
CREATE INDEX ix_analysis_results_jsonb 
ON analysis_results USING GIN (result_json);

-- Standard indexes
CREATE INDEX ix_analysis_results_analyzer_name ON analysis_results (analyzer_name);
CREATE INDEX ix_analysis_results_submission_id ON analysis_results (submission_id);
```

## Standardized Analyzer Contract

All analyzers must return this common shape:

```python
{
    "score": <float or null>,          # Single headline score if applicable
    "bucket": "<string|null>",         # e.g., "positive", "complex"
    "raw": {...},                      # Analyzer-specific details (full output)
    "confidence": <float|null>,        # Confidence in the analysis
    "details": {...}                   # Optional normalized sub-metrics
}
```

### Example Responses

#### Sentiment Analyzer
```python
{
    "score": 0.8,
    "bucket": "positive",
    "raw": {
        "polarity": 0.8,
        "subjectivity": 0.6,
        "textblob_sentiment": {...}
    },
    "confidence": 0.8,
    "details": {
        "polarity_range": "positive",
        "subjectivity_level": "subjective"
    }
}
```

#### Readability Analyzer
```python
{
    "score": 12.5,
    "bucket": "high_school",
    "raw": {
        "flesch_kincaid_grade": 12.5,
        "smog_index": 8.2,
        "gunning_fog": 14.1,
        "dale_chall_score": 7.8,
        "word_count": 150,
        "sentence_count": 8
    },
    "confidence": 0.9,
    "details": {
        "interpretations": {...},
        "primary_metric": "flesch_kincaid_grade",
        "text_stats": {...}
    }
}
```

## Usage Examples

### Running Analysis with Timing

```python
from services.analysis_timing import time_analysis_run
from analyzers.sentiment import analyze_sentiment

# Run analysis with automatic timing and storage
with time_analysis_run(submission_id, "sentiment", "v1", db) as timing_data:
    result = analyze_sentiment(text)
    timing_data["result"] = result
    timing_data["status"] = "ok"
```

### Querying Results

#### JSONB Queries
```sql
-- All positive sentiment results
SELECT ar.*
FROM analysis_results ar
WHERE ar.analyzer_name = 'sentiment'
  AND ar.result_json->>'bucket' = 'positive';

-- Sort by numeric score inside JSON
SELECT ar.submission_id,
       (ar.result_json->>'score')::float AS score
FROM analysis_results ar
WHERE ar.analyzer_name = 'readability'
ORDER BY score DESC
LIMIT 20;

-- Filter by confidence threshold
SELECT ar.*
FROM analysis_results ar
WHERE ar.analyzer_name = 'tone'
  AND (ar.result_json->>'confidence')::float > 0.8;
```

#### Summary Table Queries
```python
from services.summary_service import SummaryService

# Get recent positive submissions
positive_summaries = SummaryService.get_summaries_for_dashboard(
    db, limit=10, sentiment_filter='positive'
)

# Get submissions suitable for high school level
hs_summaries = SummaryService.get_summaries_for_dashboard(
    db, limit=10, readability_min=9.0, readability_max=12.0
)
```

### Updating Summaries

```python
# Automatically update summary after analysis
summary = SummaryService.update_submission_summary(submission_id, db)
```

## When to Add Columns or Tables

### ✅ Add Columns/Summary Tables When:
- You need to filter/sort/aggregate by a metric frequently
- You need constraints (non-null, ranges)
- You need to join this metric efficiently in many queries
- Dashboard performance is critical

### ❌ Don't Add When:
- You're just storing analyzer outputs
- You don't know which metrics will be queried often
- You want to avoid schema migrations

## Migration Strategy

1. **Phase 1**: Deploy new schema with enhanced `analysis_results`
2. **Phase 2**: Update analyzers to use standardized response format
3. **Phase 3**: Add `submission_summaries` table for dashboard optimization
4. **Phase 4**: Monitor query patterns and add more summary columns as needed

## Benefits

### Future-Proof
- Analyzers can evolve without schema changes
- New analyzers require no database modifications
- Easy to A/B test different analyzer versions

### Performance
- JSONB enables efficient querying of analyzer-specific data
- Summary tables provide fast dashboard queries
- Composite indexes optimize common access patterns

### Maintainability
- Single table for all analysis results
- Consistent data structure across analyzers
- Easy to add monitoring and debugging

### Flexibility
- Store any analyzer output without schema changes
- Query specific metrics using JSON operators
- Evolve analyzers independently

## Best Practices

1. **Always use the standardized response format** for new analyzers
2. **Store full analyzer output in `raw`** for debugging and future use
3. **Use `details` for normalized, queryable metrics**
4. **Set appropriate `analyzer_version`** when changing analyzer logic
5. **Monitor query performance** and add summary columns as needed
6. **Use the timing context manager** for consistent metadata collection

## Example Implementation

See `examples/decoupled_analysis_example.py` for a complete working example of the new system. 