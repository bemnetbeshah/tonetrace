# ✨ ToneTrace

**ToneTrace** is an AI-powered educational tool designed to revolutionize writing assessment and language learning. By providing teachers with sophisticated writing analysis capabilities, ToneTrace aims to increase education quality, make learning more accessible in underserved areas, and enhance language acquisition efficiency.

---

## 🎯 Educational Mission

ToneTrace is built with a clear educational mission: **to democratize high-quality writing assessment and language learning support**. Our vision extends beyond individual classrooms to address global educational challenges:

### 🌍 **Global Educational Impact**
- **Quality Enhancement**: Provide sophisticated writing analysis tools to educators worldwide
- **Accessibility**: Support learning in regions with limited teaching resources
- **Language Learning**: Accelerate language acquisition through personalized writing feedback
- **Scalability**: Enable one teacher to effectively support many more students

### 🎓 **Future Vision**
ToneTrace aims to become a comprehensive educational platform that:
- **Supports Multiple Languages**: Breaking down language barriers in education
- **Scales to Underserved Areas**: Where teacher-to-student ratios are challenging
- **Enhances Language Learning**: Through AI-powered writing style analysis and feedback
- **Improves Educational Outcomes**: By providing data-driven insights for personalized learning

---

## 🚀 Current Purpose

ToneTrace solves two immediate problems for educators while building toward our broader educational mission:

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
- **Multilingual support**
- **Resource efficiency for underserved areas**

are especially welcome. Please open issues or submit pull requests.

---

## 📄 License

MIT License

---

## 🎓 Educational Impact & Future Vision

### **Current Impact**
ToneTrace supports educators in:
- **Fair Assessment**: Data-driven writing evaluation
- **Student Growth**: Trackable progress over time
- **AI Literacy**: Understanding AI's role in writing
- **Resource Efficiency**: Scalable solutions for large classes

### **Future Educational Goals**
Our roadmap includes:
- **🌍 Multilingual Support**: Breaking language barriers in education
- **📚 Language Learning Enhancement**: AI-powered writing style analysis for language acquisition
- **🏫 Institutional Scaling**: School-wide dashboards and analytics
- **🌐 Global Accessibility**: Offline/low-resource support for underserved regions
- **🎯 Personalized Learning**: AI-generated writing feedback in students' own style
- **📊 Educational Research**: Data insights for improving teaching methodologies

### **Long-term Vision**
ToneTrace aims to become a cornerstone of modern education technology, helping to:
- **Increase Education Quality**: Through sophisticated, personalized writing analysis
- **Expand Educational Access**: Supporting teachers in regions with limited resources
- **Accelerate Language Learning**: Making language acquisition more efficient and effective
- **Democratize Writing Assessment**: Providing high-quality tools to educators worldwide

By building on our current AI-powered analysis foundation, we're creating a platform that can scale to serve millions of students and teachers, ultimately contributing to better educational outcomes globally.
