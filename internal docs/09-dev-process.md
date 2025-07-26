
# 🔧 ToneTrace – Step 9: Development Process

This document outlines the backend development workflow for ToneTrace, covering folder structure, naming conventions, dev tools, testing, and frontend readiness. The goal is to maintain clean code, testability, and room for growth.

---

## 🗂️ 1. Folder Structure

```bash
tonetrace/
├── app/
│   ├── main.py                 # FastAPI app instance
│   ├── models/                 # Pydantic + SQLAlchemy schemas
│   │   ├── student.py
│   │   ├── writing_sample.py
│   ├── db/                     # Database connection and session
│   │   └── database.py
│   ├── analyzers/              # NLP/AI modules (tone, sentiment, etc.)
│   │   ├── tone.py
│   │   ├── sentiment.py
│   │   ├── readability.py
│   ├── routers/                # API endpoints
│   │   ├── students.py
│   │   ├── analyze.py
│   ├── services/               # Analysis orchestration logic
│   ├── utils/                  # Helper functions, constants
│   └── templates/              # ✅ HTML templates (Jinja2 for MVP UI)
├── tests/
│   ├── test_students.py
│   ├── test_analyzers.py
├── requirements.txt
├── README.md
├── .env
└── .gitignore
```

---

## ✍️ 2. Naming Conventions

- **Functions**: `snake_case()`
- **Classes**: `PascalCase`
- **Routes**: lowercase, RESTful, snake_case (`/students/`, `/analyze/`)
- **Files**: lowercase with underscores

---

## ⚙️ 3. Dev Environment Setup

### Recommended Tools:
- Python 3.10+
- VS Code with Python + Pylance extensions
- Virtualenv: `python -m venv .venv`
- Dependency: `pip` (or `poetry` if preferred)

### Commands
```bash
# Create virtual environment
python -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install fastapi uvicorn textblob spacy textstat transformers

# Run development server
uvicorn app.main:app --reload
```

---

## 🌐 4. API Development Workflow

| Step             | Task                                       |
|------------------|---------------------------------------------|
| 1. Define models  | Use Pydantic + SQLAlchemy                  |
| 2. Create routers | Use `APIRouter` to organize endpoints      |
| 3. Implement analyzers | Modular logic per analysis type        |
| 4. Wire routes    | Call analyzer logic in `services/`         |
| 5. Test           | Run `pytest` or use Postman for testing    |

---

## 🧪 5. Testing & CI/CD

| Tool         | Purpose                        |
|--------------|--------------------------------|
| `pytest`     | Unit + integration tests       |
| `Postman`    | Manual endpoint verification   |
| `ruff`       | Linting (optional, recommended)|
| GitHub Actions | Future CI pipeline           |

---

## 🎨 6. Frontend Readiness

The folder structure supports **both server-side and client-side UIs**:

### ✅ Option 1: Server-side Jinja2 (MVP)
- Use `app/templates/` for teacher-facing HTML pages
- Great for basic demo, MVP, and deployment

### ✅ Option 2: Client-side React/Vue (Future)
If UI becomes more dynamic, simply add:

```
tonetrace/
├── frontend/          # SPA code here
│   ├── src/
│   ├── public/
│   └── package.json
```

- Communicate via CORS-enabled backend
- Host separately or bundle using Docker or Render

This modular structure ensures **no need for rewrites** when evolving to a full-stack system.

---

## ✅ Summary

ToneTrace’s development setup emphasizes:
- Clean backend structure
- Separation of concerns
- Early testability
- Growth-friendly architecture for both backend and frontend evolution
