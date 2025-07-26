# 🧰 ToneTrace – Step 8: Tech Stack Selection

This document outlines the technologies chosen to build the ToneTrace MVP, based on user needs, project scope, and long-term flexibility.

The focus is on using **tools that align with the project goals**, are easy to deploy, and support fast iteration.

---

## 🧠 Guiding Principles

- ✅ Use the **best tool for the job**, not just the most popular
- ✅ Prioritize **deployability and simplicity**
- ✅ Minimize friction for development and testing
- ✅ Keep things **modular** for future growth

---

## 🔧 1. Backend

| Tool      | Role            | Reason for Use                        |
|-----------|------------------|----------------------------------------|
| **FastAPI** | Main backend     | Async, modern, lightweight, well-documented |
| Uvicorn   | ASGI server      | Compatible with FastAPI                |

---

## 🧪 2. Analysis & NLP Tools

| Tool             | Purpose                          | Notes                                |
|------------------|----------------------------------|--------------------------------------|
| `TextBlob`       | Sentiment analysis               | Simple polarity detection            |
| `spaCy`          | Passive voice detection          | English NLP pipeline + parsing       |
| `textstat`       | Readability metrics              | Flesch, Fog, Dale-Chall              |
| `HuggingFace` model (`bsingh/roberta_goEmotion`) | Tone classification | Pre-trained, multi-label emotion model |

---

## 🗃️ 3. Database

| Tool       | Use          | Notes                                |
|------------|--------------|--------------------------------------|
| **SQLite** | MVP database | Lightweight, file-based, deployable  |
| PostgreSQL | Later        | Upgrade path for multi-user support  |
| ORM        | SQLAlchemy   | ORM layer for ease and flexibility   |

---

## 🌐 4. Frontend

| Tool             | Use                     | Notes                                 |
|------------------|--------------------------|----------------------------------------|
| **Jinja2**       | Template rendering       | Server-side HTML for MVP               |
| HTML/CSS         | Basic structure/styling | Keep minimal for demo clarity          |
| HTMX (optional)  | Dynamic interactions     | Enhances Jinja pages without React     |
| Tailwind CSS     | (Optional) styling tool  | Simple utility-first CSS for structure |

---

## 🧪 5. Testing & Dev Tools

| Tool        | Purpose               |
|-------------|------------------------|
| Pytest      | Backend unit testing   |
| Postman     | Manual API testing     |
| Coverage.py | Optional code coverage |

---

## 🚀 6. Deployment

| Platform     | Role                     | Notes                                    |
|--------------|--------------------------|------------------------------------------|
| **Render**   | Backend & DB hosting     | Easy deployment with auto GitHub deploy  |
| Railway      | Alternative platform     | SQLite + FastAPI friendly                |
| Docker       | Optional                 | For packaging, not required in MVP       |

---

## ✅ Final Stack Summary

| Layer        | Technology                             |
|--------------|-----------------------------------------|
| Backend      | FastAPI + Uvicorn                      |
| Analysis     | TextBlob, spaCy, HuggingFace, textstat |
| Database     | SQLite (via SQLAlchemy)                |
| Frontend     | Jinja2 + HTML (HTMX/Tailwind optional) |
| Testing      | Pytest + Postman                       |
| Deployment   | Render (or Railway)                    |

---

## 🔄 Next Steps

- Scaffold the FastAPI project structure
- Set up environment & dependencies
- Implement CORS middleware
- Start wiring MVP endpoints

