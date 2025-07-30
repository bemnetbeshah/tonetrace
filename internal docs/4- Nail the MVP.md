# 🚀 ToneTrace – Step 4: Nail the MVP

This document defines the **minimum viable product (MVP)** for ToneTrace. The goal is to ship a functioning backend API that delivers real value to teachers by analyzing student writing.

---

## 🎯 MVP Goal Statement

> **ToneTrace MVP** is a backend-only FastAPI service where **teachers can register students**, **submit writing**, and receive a **stylometric fingerprint** (tone, sentiment, complexity) for each sample.  
> It stores all results so teachers can start identifying student patterns manually — forming the base for style drift detection and dashboards in future releases.

---

## ✅ 1. Core MVP Endpoints

| Endpoint                         | Purpose                                  |
|----------------------------------|------------------------------------------|
| `POST /students/`               | Register a new student                   |
| `POST /students/{id}/samples/` | Upload a new writing sample              |
| `GET /students/{id}/profile/`  | Return most recent fingerprint analysis  |

---

## 🧬 2. Fingerprint Output (Per Sample)

Each uploaded sample will be analyzed and produce the following metrics:

- **Tone labels** (from HuggingFace classifier)
- **Sentiment score** (TextBlob polarity)
- **Passive voice %** (spaCy-based)
- **Readability metrics**:
  - Flesch-Kincaid Grade Level
  - Gunning Fog Index
  - Dale-Chall score
- **Sentence length average**
- **Lexical density**

All fingerprints will be **stored permanently** and linked to their original writing sample for future comparison and trend analysis.

---

## 🗃️ 3. Persistent Models (Implemented for MVP)

- `Teacher`
- `Student`
- `WritingSample`
- `WritingFingerprint`

Each writing sample and fingerprint will be stored in structured form to enable analysis, plotting, and extension later.

---

## 🛠️ 4. MVP Development Scope

| Area             | Task Description                          |
|------------------|--------------------------------------------|
| Backend API      | FastAPI server with defined endpoints      |
| Analyzer Logic   | Sentiment, tone, style, syntax             |
| Data Modeling    | Entities from Step 3 implemented           |
| Storage Layer    | Use SQLite or in-memory DB for MVP         |
| Testing          | Test endpoints using Postman or Pytest     |
| Documentation    | Add usage docs to README.md                |

---

## 🚫 5. Deferred Features (for Later Versions)

| Feature                         | Reason for Deferment                      |
|----------------------------------|-------------------------------------------|
| Teacher dashboard UI            | Not needed for API-first MVP              |
| Student self-submission         | Teachers can upload for now               |
| Style drift alerts              | Nice-to-have, not essential at first      |
| Progress snapshots              | Can be generated later or manually        |
| AI-generated feedback           | Needs LLM pipeline, V2+ scope              |

---

This MVP is lean but useful — it delivers actionable feedback to educators with minimal setup, and establishes the foundation for future features.


