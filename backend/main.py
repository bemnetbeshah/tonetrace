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
# This ensures NLTK data can be found in Render and other hosting environments
# Use a try-except to prevent crashes if NLTK setup fails
try:
    # Set NLTK data path - try multiple locations for different hosting environments
    nltk_data_dir = None
    
    # Try Render's home directory first
    if os.path.exists('/opt/render'):
        nltk_data_dir = '/opt/render/.local/share/nltk_data'
    # Try user home directory
    elif os.path.exists(os.path.expanduser('~')):
        nltk_data_dir = os.path.join(os.path.expanduser('~'), 'nltk_data')
    # Fallback to /tmp for serverless environments
    elif os.path.exists('/tmp'):
        nltk_data_dir = '/tmp/nltk_data'
    
    if nltk_data_dir:
        try:
            os.makedirs(nltk_data_dir, exist_ok=True)
            os.environ['NLTK_DATA'] = nltk_data_dir
        except Exception:
            pass
    
    # Try to import and set up NLTK path if possible
    try:
        import nltk
        if nltk_data_dir and nltk_data_dir not in nltk.data.path:
            nltk.data.path.insert(0, nltk_data_dir)
        # Also add common fallback paths
        for path in ['/tmp', os.path.expanduser('~'), '/opt/render/.local/share']:
            if path and os.path.exists(path) and path not in nltk.data.path:
                nltk.data.path.append(path)
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
    # Use PORT from environment variable (Render provides this) or default to 8000
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
