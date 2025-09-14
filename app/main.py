from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from routes.analyze_lightweight import router as analyze_router
# from routes import profile  # Disabled for lightweight version

app = FastAPI(title="ToneTrace API - Lightweight Version", version="1.0.0")

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
    return {
        "message": "ToneTrace API - Lightweight Version",
        "version": "1.0.0",
        "status": "running",
        "optimized_for": "Render free tier (512MB limit)"
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "version": "lightweight",
        "memory_optimized": True
    }

app.include_router(analyze_router, prefix="/api", tags=["analysis"])
# app.include_router(profile.router, prefix="/api", tags=["profile"])  # Disabled for lightweight version
