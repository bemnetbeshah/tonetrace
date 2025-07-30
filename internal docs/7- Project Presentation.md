# 🖥️ ToneTrace – Step 7: Project Presentation & Interaction Design

This document defines how users will interact with the ToneTrace system and what form the project will take. It helps guide architectural decisions and prioritizes building the most useful interface for the intended users.

---

## 🎯 Purpose

To ensure the ToneTrace project is accessible, testable, and demoable by real users — especially teachers — the MVP will be presented as a **minimal web application** backed by a FastAPI server.

---

## 👩‍🏫 Primary User Interaction

| Role     | Platform           | Interaction Type                              |
|----------|--------------------|-----------------------------------------------|
| Teacher  | Web Browser         | Submit student writing, view results          |
| Student  | (Future version)    | May view feedback or submit writing           |
| Developer| Postman / CLI       | Test endpoints, monitor logs, iterate fast    |

---

## 🧱 Chosen Presentation Format

> **ToneTrace MVP** will be a simple, deployable **web app** with:
> - A form for uploading student writing
> - A dashboard-like panel to view tone and style analysis
> - A FastAPI backend returning structured JSON
> - A lightweight frontend using React, Jinja, or HTMX

---

## 🌐 CORS + API Architecture

Since the frontend and backend may be served from **different origins** (e.g., React on port 3000, FastAPI on 8000), **CORS (Cross-Origin Resource Sharing)** will be configured in the backend to allow requests from the frontend.

```python
from fastapi.middleware.cors import CORSMiddleware

origins = [
    "http://localhost:3000",
    "https://your-frontend-domain.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

