from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from routes import analyze_alt

# Create FastAPI app
app = FastAPI(
    title="ToneTrace API (Alternative Version)",
    description="Alternative API version without spaCy dependencies for Render deployment",
    version="1.0.0"
)

# Configure CORS
origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:8000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(analyze_alt.router, prefix="/api/v1", tags=["analysis"])

@app.get("/")
async def root():
    return {
        "message": "ToneTrace API (Alternative Version)",
        "description": "This version uses lightweight NLP libraries instead of spaCy",
        "status": "running",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "Alternative ToneTrace API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
