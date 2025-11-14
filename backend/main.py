"""
ToneTrace API - Main Application Entry Point

A FastAPI-based backend service for analyzing student writing and providing
educational insights to teachers.

This is the primary entry point for the ToneTrace backend service.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import sys

# Set up NLTK path early, before any analyzer imports
# This ensures NLTK data can be found in serverless environments
# Use a try-except to prevent crashes if NLTK setup fails
try:
    # Set NLTK data path directly without importing analyzers
    # This avoids potential circular import issues
    if os.path.exists('/tmp'):
        nltk_data_dir = '/tmp/nltk_data'
        try:
            os.makedirs(nltk_data_dir, exist_ok=True)
        except Exception:
            pass
        os.environ['NLTK_DATA'] = nltk_data_dir
    
    # Try to import and set up NLTK path if possible
    try:
        import nltk
        if '/tmp/nltk_data' not in nltk.data.path:
            nltk.data.path.insert(0, '/tmp/nltk_data')
        if '/tmp' not in nltk.data.path:
            nltk.data.path.append('/tmp')
    except ImportError:
        # NLTK not available, that's okay - fallbacks will handle it
        pass
    except Exception as e:
        # Log but continue - fallbacks will handle missing NLTK data
        print(f"Warning: Could not set up NLTK path: {e}", file=sys.stderr)
except Exception as e:
    # Log but continue - fallbacks will handle missing NLTK data
    print(f"Warning: Could not set up NLTK path: {e}", file=sys.stderr)

# Create FastAPI application
app = FastAPI(
    title="ToneTrace API",
    description="Educational writing analysis API for teachers",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
origins = os.getenv('ALLOWED_ORIGINS', 'http://localhost:5173,https://tonetrace.vercel.app').split(',')
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

@app.get("/api")
def read_root():
    """Root endpoint providing API information."""
    return {
        "message": "ToneTrace API",
        "version": "1.0.0",
        "status": "running",
        "description": "Educational writing analysis API for teachers"
    }

@app.get("/api/health")
def health_check():
    """Health check endpoint for monitoring."""
    return {
        "status": "healthy",
        "version": "1.0.0",
        "service": "tonetrace-api"
    }

# Include API routers with error handling
try:
    from routes.analyze_lightweight import router as analyze_router
    app.include_router(analyze_router, prefix="/api", tags=["analysis"])
except Exception as e:
    # If analyze router fails to import, log but continue
    import sys
    print(f"Warning: Failed to import analyze_router: {e}", file=sys.stderr)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
