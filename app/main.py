from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from routes.analyze import router as analyze_router
from routes import profile

app = FastAPI()

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
    return {"message": "You are now using tonetrace API"}

app.include_router(analyze_router)
app.include_router(profile.router)