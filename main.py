from fastapi import FastAPI
from pydantic import BaseModel
from textblob import TextBlob
from analyzers.sentiment import analyze_sentiment
from analyzers.passive_voice import detect_passive_sentences



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

    passive_analysis = detect_passive_sentences(input_data.text)

    return {
        "sentiment": {
            "polarity": polarity,
            "subjectivity": subjectivity,
        },
        "passive_analysis": passive_analysis
    }
