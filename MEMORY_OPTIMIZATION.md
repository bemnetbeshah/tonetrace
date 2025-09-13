# Memory Optimization for Render Free Tier

## Problem
The original `requirements.txt` exceeds Render's free tier memory limit of 512MB due to heavy ML dependencies:
- **spaCy** + `en_core_web_sm` model: ~50MB
- **transformers** + emotion classification model: ~500MB+
- **torch**: ~200MB+
- **Other ML dependencies**: ~100MB+

**Total estimated memory usage: ~850MB+ (exceeds 512MB limit)**

## Solution: Lightweight Alternatives

### 1. Ultra-Minimal Requirements (`requirements-render-minimal.txt`)
- Removed spaCy and transformers dependencies
- Uses lightweight alternatives: NLTK, TextBlob, textstat
- Estimated memory usage: **<200MB**

### 2. Lightweight Analyzers
Created spaCy-free alternatives for all analyzers:

#### `analyzers/style_metrics_lightweight.py`
- Uses NLTK for POS tagging instead of spaCy
- Maintains same functionality for formality and complexity analysis

#### `analyzers/lexical_richness_lightweight.py`
- Uses NLTK tokenization and wordfreq
- Same vocabulary sophistication analysis

#### `analyzers/tone_lightweight.py`
- Rule-based tone analysis using keyword matching
- No transformers dependency
- Maintains tone classification functionality

#### `analyzers/passive_voice_lightweight.py`
- NLTK-based passive voice detection
- Pattern matching for passive constructions

#### `analyzers/grammar_lightweight.py`
- Basic grammar issue detection using NLTK
- Detects common issues: double negatives, subject-verb disagreement, etc.

### 3. Lightweight API Routes
- `routes/analyze_lightweight.py`: Uses all lightweight analyzers
- `app/main_lightweight.py`: Optimized FastAPI app

## Deployment Instructions

### Option 1: Automatic Deployment Script
```bash
python deploy_render.py
```

This script will:
- Backup original files
- Replace with lightweight versions
- Prepare for Render deployment

### Option 2: Manual Deployment
1. **Replace requirements.txt:**
   ```bash
   cp requirements-render-minimal.txt requirements.txt
   ```

2. **Replace main application:**
   ```bash
   cp app/main_lightweight.py app/main.py
   ```

3. **Replace analyze route:**
   ```bash
   cp routes/analyze_lightweight.py routes/analyze.py
   ```

4. **Deploy to Render** using `render.yaml` configuration

### Option 3: Render Configuration
Use the provided `render.yaml`:
```yaml
services:
  - type: web
    name: tonetrace-api
    env: python
    plan: free
    buildCommand: |
      pip install -r requirements-render-minimal.txt
      python -c "import nltk; nltk.download('punkt'); nltk.download('averaged_perceptron_tagger'); nltk.download('stopwords')"
    startCommand: uvicorn app.main_lightweight:app --host 0.0.0.0 --port $PORT
```

## Functionality Comparison

| Feature | Original | Lightweight | Notes |
|---------|----------|-------------|-------|
| Sentiment Analysis | ✅ TextBlob | ✅ TextBlob | Same |
| Tone Analysis | ✅ Transformers | ✅ Rule-based | Different approach, similar results |
| Formality Analysis | ✅ spaCy + readability | ✅ NLTK + readability | Same |
| Complexity Analysis | ✅ spaCy | ✅ NLTK | Same |
| Lexical Richness | ✅ spaCy + wordfreq | ✅ NLTK + wordfreq | Same |
| Passive Voice | ✅ spaCy | ✅ NLTK | Same |
| Grammar Analysis | ✅ spaCy | ✅ NLTK | Basic patterns only |
| Readability | ✅ textstat | ✅ textstat | Same |

## Memory Usage Comparison

| Component | Original | Lightweight | Savings |
|-----------|----------|-------------|---------|
| spaCy + model | ~50MB | 0MB | -50MB |
| transformers + model | ~500MB | 0MB | -500MB |
| torch | ~200MB | 0MB | -200MB |
| Other ML deps | ~100MB | ~50MB | -50MB |
| **Total** | **~850MB** | **~200MB** | **-650MB** |

## Restoring Full Functionality

After deployment, restore full functionality:
```bash
python restore_full.py
```

This will restore:
- `requirements-full.txt` → `requirements.txt`
- `app/main-full.py` → `app/main.py`
- `routes/analyze-full.py` → `routes/analyze.py`

## Testing

Test the lightweight version locally:
```bash
# Install minimal requirements
pip install -r requirements-render-minimal.txt

# Download NLTK data
python -c "import nltk; nltk.download('punkt'); nltk.download('averaged_perceptron_tagger'); nltk.download('stopwords')"

# Run lightweight version
uvicorn app.main_lightweight:app --reload
```

## Performance Notes

- **Startup time**: Faster (no heavy model loading)
- **Memory usage**: ~75% reduction
- **Analysis quality**: Slightly reduced for tone analysis, same for other metrics
- **API compatibility**: Fully compatible with existing frontend

## Monitoring

After deployment, monitor:
1. Memory usage in Render dashboard
2. API response times
3. Analysis quality through frontend testing

## Rollback Plan

If issues arise:
1. Use `restore_full.py` to restore full functionality
2. Deploy with paid Render plan for higher memory limits
3. Consider alternative deployment platforms (Railway, Fly.io, etc.)
