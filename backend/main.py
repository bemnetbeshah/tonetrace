"""
ToneTrace API - Main Application Entry Point

A FastAPI-based backend service for analyzing student writing and providing
educational insights to teachers.

This is the primary entry point for the ToneTrace backend service.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

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

@app.get("/")
def read_root():
    """Root endpoint providing API information."""
    return {
        "message": "ToneTrace API",
        "version": "1.0.0",
        "status": "running",
        "description": "Educational writing analysis API for teachers"
    }

@app.get("/health")
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

try:
    from routes import profile
    app.include_router(profile.router, prefix="/api", tags=["profile"])
except Exception as e:
    # If profile router fails to import, log but continue
    import sys
    print(f"Warning: Failed to import profile router: {e}", file=sys.stderr)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
