# ✨ ToneTrace

**ToneTrace** is an AI-powered web application that analyzes writing samples to help users trace, understand, and reproduce their personal writing tone. Built with **FastAPI**, it provides RESTful APIs for tone analysis, style detection, and content generation. ToneTrace is designed for writers, students, and anyone interested in improving or understanding their writing style.

---


## 🚀 Features

- ✍️ Upload or paste writing samples
- 🧠 Analyze writing tone, style, and patterns
- 🎯 Generate writing prompts or new content in your own tone
- 📊 Track changes in tone over time (upcoming versions)
- 🛠️ RESTful API with interactive docs (Swagger UI)

---

## 🔧 New Modules & Features

- **Created `analyzers/style_metrics.py`**
  - `compute_formality()`: Returns a formality bucket and underlying readability scores:
    - `flesch_kincaid_grade`
    - `gunning_fog_index`
    - `dale_chall_score`
  - `compute_complexity()`: Returns
    - `average_sentence_length` (via textstat)
    - `lexical_density` (via spaCy)
  - Loads spaCy model globally (`nlp = spacy.load("en_core_web_sm")`)

---

## 🔁 Route Refactor

- Moved logic into `routes/analyze.py`
- Created a clean `APIRouter`
- Defined `AnalyzeRequest` model
- Added `/analyze` route using `async def`
- Integrated analyzers:
  - `compute_formality`
  - `compute_complexity`
  - `classify_tone`
  - `analyze_sentiment`
  - `detect_passive_sentences`
- Updated `main.py`:
  - Imported and included the router:
    ```python
    from routes.analyze import router as analyze_router
    app.include_router(analyze_router)
    ```

---

## 🧪 Testing

- Wrote and ran a custom test script (`tests/test_analyze_api.py`)
- Sent a POST request to `/analyze`
- Validated the output
- Confirmed everything worked as expected

---

## 🧱 Tech Stack

- **Backend**: FastAPI, Pydantic
- **Server**: Uvicorn
- **Language Model**: OpenAI / LLM integration (planned)
- **Frontend**: (coming soon – React/Tailwind planned)
- **Database**: (to be added – likely PostgreSQL or Firestore)

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/bemnetbeshah/tonetrace.git
cd tonetrace

# Create a virtual environment (Windows)
python -m venv .venv
.\.venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

---

## ▶️ Running ToneTrace Locally

Start the FastAPI server with Uvicorn:

```bash
uvicorn main:app --reload
```

The API will be available at: [http://127.0.0.1:8000](http://127.0.0.1:8000)

Interactive API docs (Swagger UI): [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## 📝 Example Usage

### Example Input

POST `/analyze` (JSON body):

```json
{
  "text": "I think the project could be improved. It was not as successful as we hoped."
}
```

### Example Output

```json
{
  "sentiment": "neutral",
  "passive_voice": true,
  "suggestions": [
    "Try using more active voice for clarity.",
    "Consider adding positive language."
  ]
}
```

---

## 📚 API Documentation

Explore and test the API using the interactive Swagger UI:

👉 [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## 🤝 Contributing

Contributions are welcome! Please open issues or submit pull requests for new features, bug fixes, or improvements.

---

## 📄 License

MIT License
