from fastapi import FastAPI
from routes.analyze import router as analyze_router
from routes import profile

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "You are now using tonetrace API"}

app.include_router(analyze_router)
app.include_router(profile.router)