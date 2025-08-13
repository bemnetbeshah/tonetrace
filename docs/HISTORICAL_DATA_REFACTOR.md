# Historical Data System Refactor

## Overview

This document describes the refactoring of the historical data system from storing redundant lists in StyleProfile objects to querying historical data directly from the database.

## 🎯 What Changed

### Before (Old System)
- **StyleProfile** stored historical data as lists:
  ```python
  sentiment_history: List[float] = [0.2, -0.1, 0.8, 0.5]
  formality_grades: List[float] = [8.5, 7.2, 9.1]
  lexical_diversity_scores: List[float] = [0.75, 0.82, 0.68]
  ```
- **Problems:**
  - Redundant data storage (same data in StyleProfile AND database)
  - Memory usage grows with history size
  - Data could become stale/out of sync
  - No flexible querying capabilities

### After (New System)
- **StyleProfile** only stores current averages and aggregated stats:
  ```python
  average_sentiment: float = 0.35
  average_formality: float = 8.27
  average_lexical_diversity: float = 0.75
  total_texts: int = 10
  ```
- **Historical data** is queried directly from the database via dedicated endpoints

## 🏗️ New Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   StyleProfile  │    │  Historical Data │    │    Database     │
│                 │    │     Service      │    │                 │
│ • Averages      │◄──►│ • Query functions│◄──►│ • submissions   │
│ • Aggregates    │    │ • Time filtering │    │ • analysis_     │
│ • Distributions │    │ • Limit results  │    │   results       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 📊 New API Endpoints

### Historical Data Endpoints

#### 1. Sentiment History
```http
GET /profile/{user_id}/history/sentiment?limit=50
```
**Response:**
```json
{
  "user_id": "user123",
  "metric": "sentiment",
  "history": [
    {
      "submission_id": 1,
      "score": 0.8,
      "polarity": 0.8,
      "date": "2024-01-15T10:30:00Z",
      "text_preview": "Text from submission 1..."
    }
  ],
  "total_entries": 1
}
```

#### 2. Formality Trends
```http
GET /profile/{user_id}/history/formality?days=30
```
**Response:**
```json
{
  "user_id": "user123",
  "metric": "formality",
  "days_lookback": 30,
  "trends": [
    {
      "submission_id": 1,
      "flesch_kincaid_grade": 12.5,
      "date": "2024-01-15T10:30:00Z",
      "text_preview": "Text from submission 1..."
    }
  ],
  "total_entries": 1
}
```

#### 3. Lexical Diversity History
```http
GET /profile/{user_id}/history/lexical-diversity?limit=100
```

#### 4. Readability History
```http
GET /profile/{user_id}/history/readability?metric=flesch_kincaid_grade&limit=50
```

#### 5. Grammar Error Trends
```http
GET /profile/{user_id}/history/grammar?days=7
```

#### 6. Tone Distribution Over Time
```http
GET /profile/{user_id}/history/tone?days=30
```

#### 7. Performance Metrics
```http
GET /profile/{user_id}/performance?days=30
```

## 🔧 Implementation Details

### StyleProfile Changes

The StyleProfile class was simplified to remove historical data storage:

```python
@dataclass
class StyleProfile:
    # Only current averages (computed from database)
    average_sentiment: float = 0.0
    average_formality: float = 0.0
    average_lexical_diversity: float = 0.0
    
    # Aggregated statistics
    tone_distribution: Dict[str, int] = field(default_factory=dict)
    total_texts: int = 0
    
    # No more historical lists!
    # ❌ sentiment_history: List[float] = []
    # ❌ formality_grades: List[float] = []
```

### Historical Data Service

New service (`services/historical_data.py`) provides database query functions:

```python
async def get_sentiment_history(user_id: str, limit: int = 50) -> List[Dict[str, Any]]:
    """Get sentiment scores over time from database."""
    
async def get_formality_trends(user_id: str, days: int = 30) -> List[Dict[str, Any]]:
    """Get formality scores over the last N days."""
    
async def get_tone_distribution_over_time(user_id: str, days: int = 30) -> Dict[str, List[Dict[str, Any]]]:
    """Get tone distribution over time, grouped by tone type."""
```

### Profile Update Process

The update process now calculates rolling averages instead of storing lists:

```python
def update_averages(self, new_analysis: dict, total_texts: int):
    """Update averages using rolling average calculation."""
    sentiment = new_analysis.get("sentiment", {}).get("polarity", 0)
    self.average_sentiment = (self.average_sentiment * (total_texts - 1) + sentiment) / total_texts
```

## 💾 Memory Efficiency

### Memory Usage Comparison

| Metric | Old System | New System | Improvement |
|--------|------------|------------|-------------|
| Sentiment | 100 floats | 1 float | 99% reduction |
| Formality | 100 floats | 1 float | 99% reduction |
| Lexical Diversity | 100 floats | 1 float | 99% reduction |
| **Total** | **300 floats** | **3 floats** | **99% reduction** |

### Scalability Benefits

- **Memory usage stays constant** regardless of history size
- **No redundant data storage** between StyleProfile and database
- **Historical data always fresh** from database queries
- **Flexible querying** by date ranges, limits, filters

## 🚀 Usage Examples

### Getting Current Profile
```python
# Get current averages and aggregated stats
profile = await get_user_profile("user123")
print(f"Average sentiment: {profile.average_sentiment}")
print(f"Total texts analyzed: {profile.total_texts}")
```

### Getting Historical Data
```python
# Get sentiment trends over last 30 days
sentiment_history = await get_sentiment_history("user123", limit=100)

# Get formality trends over last week
formality_trends = await get_formality_trends("user123", days=7)

# Get tone distribution over last month
tone_distribution = await get_tone_distribution_over_time("user123", days=30)
```

### Performance Analysis
```python
# Get performance metrics for analyzers
performance = await get_performance_metrics("user123", days=30)
for analyzer, metrics in performance.items():
    print(f"{analyzer}: {metrics['success_rate']:.1f}% success rate")
```

## 🔄 Migration Notes

### For Existing Users

1. **Existing profiles** will continue to work but won't have historical data
2. **New analyses** will use the new rolling average calculation
3. **Historical data** is available through new endpoints
4. **No data loss** - all analysis results remain in database

### For Developers

1. **Update imports** to use new historical data service
2. **Replace profile.history_list** calls with database queries
3. **Use new API endpoints** for historical data needs
4. **Profile updates** now use `update_averages()` method

## 🧪 Testing

### Demo Script

Run the demo to see the new system in action:

```bash
python examples/historical_data_demo.py
```

### Test Coverage

- ✅ StyleProfile simplification
- ✅ Historical data queries
- ✅ Rolling average calculations
- ✅ API endpoint responses
- ✅ Memory efficiency improvements

## 📈 Future Enhancements

### Potential Improvements

1. **Caching layer** for frequently accessed historical data
2. **Aggregation functions** (weekly/monthly summaries)
3. **Trend analysis** (moving averages, regression)
4. **Export functionality** (CSV, JSON, charts)
5. **Real-time updates** via WebSockets

### Database Optimizations

1. **Indexing** on frequently queried fields
2. **Partitioning** by date for large datasets
3. **Materialized views** for complex aggregations
4. **Query optimization** for time-series data

## 🤝 Contributing

When contributing to the historical data system:

1. **Follow the new pattern** - don't add historical lists to StyleProfile
2. **Use database queries** for historical data needs
3. **Add new endpoints** to the historical data service
4. **Update documentation** for new functionality
5. **Test memory efficiency** of any changes

## 📚 Related Documentation

- [StyleProfile API Reference](../style_profile_module/README.md)
- [Database Schema](../app/models.py)
- [Analysis Storage Service](../services/analysis_storage.py)
- [API Routes](../routes/profile.py)

---

**Note**: This refactor significantly improves the system's memory efficiency and data consistency while providing more flexible access to historical data through dedicated API endpoints. 