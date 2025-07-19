from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

@app.get("/")
def read_root():
    return {"message" : "You are now using tonetrace API"}

class textInput(BaseModel):
    text: str

@app.post("/analyze")
def analyze_text(input_data: textInput):
    return {"message": "Text received", "input_length": len(input_data.text)}

