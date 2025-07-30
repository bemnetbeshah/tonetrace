# ✨ ToneTrace

**ToneTrace** is an AI-powered educational tool designed to revolutionize writing assessment and learning support. Built with **FastAPI**, it provides stylometric fingerprinting, tone analysis, and progress tracking to support fair and data-driven writing assessment while paving the way for more accessible, high-quality education worldwide.

---

## 🌍 Educational Vision

ToneTrace is more than just a writing analysis tool—it's a step toward democratizing quality education globally. Our mission is to:

### 🎯 **Increase Education Quality**
- Provide teachers with data-driven insights to make more informed assessment decisions
- Enable personalized feedback that adapts to each student's unique writing style
- Support evidence-based teaching practices through comprehensive writing analytics

### 🌐 **Make Education More Widespread**
- Scale educational support in regions with limited teacher resources
- Provide consistent, high-quality writing assessment regardless of geographic location
- Enable remote and hybrid learning environments with reliable evaluation tools

### 🗣️ **Aid Language Learning Efficiency**
- Support multilingual education through future language expansion capabilities
- Help language learners track their writing progress across different languages
- Provide consistent assessment standards for non-native speakers

---

## 🎯 Purpose

ToneTrace solves two key problems for educators:
1. **"Is my student using AI to write this?"** - Detects potential AI usage through style drift analysis
2. **"Is my student actually improving over time?"** - Tracks writing progress with measurable metrics

By providing data-backed, explainable analysis, ToneTrace helps teachers make confident, fair decisions while supporting student growth through constructive feedback.

---

## 🚀 Features

### 👨‍🏫 For Teachers (Primary Users)
- ✍️ **Register and manage students** in the system
- 📝 **Upload student writing samples** for analysis
- 🧬 **View writing fingerprints** with detailed stylometric metrics
- 📈 **Track student progress** over time with historical trends
- ⚠️ **Detect writing style anomalies** that may indicate AI usage
- 🔍 **Compare submissions** to identify style drift

### 🧬 Analysis Metrics
- **Tone Classification**: Formal, confident, academic, etc.
- **Sentiment Analysis**: TextBlob polarity scoring
- **Passive Voice Detection**: Percentage of passive sentences
- **Readability Metrics**: Flesch-Kincaid, Gunning Fog, Dale-Chall scores
- **Lexical Density**: Content vs function word ratios
- **Sentence Structure**: Average length and complexity

---

## 🛡️ Ethical Design

- 🔒 **Data Privacy**: Student data is private and accessible only to the registering teacher
- 🚫 **Non-Judgmental**: Never labels writing as "bad" - only highlights changes and trends
- 🤖 **Responsible Detection**: Style drift alerts are suggestions, not accusations
- 🧼 **Clean Output**: Analysis results are readable by non-technical users
- 🌍 **Accessibility**: Designed for resource-limited educational environments

---

## 🧱 Tech Stack

- **Backend**: FastAPI, Uvicorn
- **Analysis**: TextBlob, spaCy, HuggingFace transformers, textstat
- **Database**: SQLite (MVP), PostgreSQL (future)
- **Frontend**: Jinja2 templates (MVP), React (future)
- **Deployment**: Render/Railway

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

# Download spaCy model
python -m spacy download en_core_web_sm
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

## 📝 API Usage Examples

### Register a Student
```bash
POST /students/
{
  "name": "Abel T.",
  "language": "English"
}
```

### Upload Writing Sample
```bash
POST /students/{student_id}/samples/
{
  "content": "The research demonstrates significant findings...",
  "metadata": {"assignment_type": "essay"}
}
```

### View Student Profile
```bash
GET /students/{student_id}/profile/
```

### Example Analysis Response
```json
{
  "student": "Abel T.",
  "sample_date": "2025-01-15",
  "fingerprint": {
    "tone": ["formal", "confident"],
    "sentiment": 0.23,
    "passive_voice_pct": 19.0,
    "reading_grade_level": 9.3,
    "lexical_density": 0.51,
    "avg_sentence_length": 15.6
  },
  "trends": {
    "passive_voice_change": "+4%",
    "formality_increase": "slight",
    "style_consistency": "consistent"
  },
  "anomalies": "none detected"
}
```

---

## 🧪 Testing

Run the test suite:
```bash
pytest tests/
```

Manual API testing with Postman or curl is recommended for endpoint verification.

---

## 📚 API Documentation

Explore and test the API using the interactive Swagger UI:

👉 [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## 🎯 MVP Status

**Current Phase**: Backend API development
- ✅ Core analysis modules implemented
- ✅ Student management endpoints
- ✅ Writing fingerprint generation
- 🔄 Style drift detection (in progress)
- ⏳ Teacher dashboard UI (planned)
- ⏳ Progress tracking visualization (planned)

---

## 🤝 Contributing

This project is focused on educational technology and responsible AI. Contributions that improve:
- Analysis accuracy
- Educational fairness
- Data privacy
- Accessibility

are especially welcome. Please open issues or submit pull requests.

---

## 📄 License

MIT License

---

## 🎓 Educational Impact

ToneTrace aims to support educators in:
- **Fair Assessment**: Data-driven writing evaluation
- **Student Growth**: Trackable progress over time
- **AI Literacy**: Understanding AI's role in writing
- **Resource Efficiency**: Scalable solutions for large classes
- **Global Accessibility**: Future multilingual support

### 🌟 Long-Term Educational Goals

**Quality Enhancement**: Transform writing assessment from subjective evaluation to objective, data-driven insights that help teachers provide more effective feedback and support.

**Accessibility Expansion**: Bridge educational gaps in underserved regions by providing consistent, high-quality writing assessment tools that can scale with limited teacher resources.

**Language Learning Support**: Enable more efficient language acquisition through consistent writing assessment standards and progress tracking across multiple languages.

**Educational Equity**: Ensure that students everywhere have access to the same quality of writing assessment and feedback, regardless of their geographic location or available resources.
