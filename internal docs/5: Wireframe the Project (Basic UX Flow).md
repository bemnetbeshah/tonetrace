# 🧠 ToneTrace – Step 5: Wireframe the Project (Basic UX Flow)

This document defines the basic user flow and experience for the MVP. Since the initial version is API-first and has no UI, the goal is to simulate and plan how a basic teacher user would interact with the system — focusing on clarity, minimal steps, and user-friendly responses.

---

## 👤 Basic User Persona

**Name**: Ms. Samuel  
**Role**: Middle-school language arts teacher  
**Tech Skill**: Comfortable with simple tools like Google Docs, email, and file uploads  
**Goal**: Understand whether her students are improving and writing their own work  
**Need**: A clear, constructive way to analyze student writing and track changes over time

---

## 🔄 User Flow: Step-by-Step (MVP)

| Step | Ms. Samuel’s Action                        | API Route                            | System Response                         |
|------|--------------------------------------------|--------------------------------------|------------------------------------------|
| 1    | Creates a student record                   | `POST /students/`                    | Returns student ID                       |
| 2    | Uploads a new writing sample               | `POST /students/{id}/samples/`       | Returns computed fingerprint             |
| 3    | Views most recent feedback                 | `GET /students/{id}/profile/`        | Returns latest stylometric fingerprint   |
| 4    | (Future) Views long-term progress          | `GET /students/{id}/progress/`       | Time-series style/complexity analysis    |
| 5    | (Future) Checks for anomalies or AI use    | `GET /students/{id}/anomalies/`      | Flags changes that could suggest drift   |

---

## 🧭 UX Philosophy

> “Paper is cheap, code is expensive.”  
We avoid building UI too early, but we **simulate the user experience** to make sure the API outputs are clean, readable, and human-friendly.

### UX Guidelines:
- ✅ Avoid technical jargon in API responses
- ✅ Use plain language in tone summaries
- ✅ Highlight change and progress over time
- ✅ Present structure like a dashboard (even if JSON)

---

## 🖼️ Simulated Response Example

**👩‍🎓 Student: Abel T.**  
**🗓️ Sample Submitted: July 25, 2025**

### ✍️ Fingerprint Analysis:
- **Tone:** Formal, Confident  
- **Sentiment:** +0.23 (slightly positive)  
- **Passive Voice:** 19% of sentences  
- **Reading Grade Level:** 9.3  
- **Lexical Density:** 0.51  
- **Avg Sentence Length:** 15.6 words  

---

🟡 **Note:** Compared to Abel’s previous sample:
- **+4% more passive voice**
- **Slight increase in formality**
- **Overall style consistent**

✅ No anomalies detected.

---

## ✅ Summary

ToneTrace should feel usable even through basic API testing tools. Every endpoint should respond like it’s part of a future dashboard — understandable by real teachers who care more about growth than graphs.

This UX-first mindset ensures a smoother transition to future UI development.

