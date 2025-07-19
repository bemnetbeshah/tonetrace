from fastapi import FastAPI
from pydantic import BaseModel
from textblob import TextBlob


app = FastAPI()

@app.get("/")
def read_root():
    return {"message" : "You are now using tonetrace API"}

class textInput(BaseModel):
    text: str

@app.post("/analyze")
def analyze_text(input_data: textInput):
    blob = TextBlob(input_data.text)
    polarity = blob.sentiment.polarity
    subjectivity = blob.sentiment.subjectivity
    return {
        "polarity": polarity,
        "subjectivity": subjectivity,
        "text": input_data.text
    }
