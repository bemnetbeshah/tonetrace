# 🧩 ToneTrace – Step 2: User Features & Experience

## 🎯 Purpose
Define what the users must be able to do — focusing on essential features, sensible guardrails, and a user-centered mindset. This list is **tech-agnostic** and intended to guide feature scope, not implementation details.

---

## 👥 Core Features (MVP-Oriented)

### 👨‍🏫 For Teachers (Primary Users)
- ✅ **Register a student**  
  Create and manage student profiles within the system

- ✅ **Upload student writing samples**  
  Send new writing for analysis via API

- ✅ **View writing fingerprint**  
  Get metrics like tone, complexity, sentence length, lexical density, and passive voice

- ✅ **Track student progress over time**  
  See historical trends in tone and readability to measure growth

- ✅ **Detect anomalies in writing style**  
  Identify potential AI usage or ghostwriting through style drift analysis

- ✅ **Compare submissions**  
  View differences between writing samples over time

---

### 👩‍🎓 For Students (Secondary Users – Future Phase)
- ⏳ Submit writing directly via UI (Future)
- ⏳ View their writing improvement and style metrics (Future)
- ⏳ Receive personalized, constructive feedback (Future)

---

## 🛡️ Guardrails (Ethical and UX Constraints)

- 🔒 **Data Privacy**  
  Students’ data is private. Only the registering teacher can access it.

- 🚫 **No Judgmental Language**  
  Never label tone or style as "bad" — only highlight *changes*, *inconsistencies*, or *notable trends*.

- 🤖 **Responsible Anomaly Detection**  
  Style drift alerts are suggestions, not accusations of AI use. The system avoids punitive framing.

- 🧼 **Clean, Jargon-Free Output**  
  Analysis results should be readable by non-technical users (e.g., teachers without CS background).

- 🌍 **Accessibility Awareness**  
  Keep the experience minimal and usable on slower devices or in resource-limited schools.

---

## 📝 Notes

- Focus only on backend/API in MVP. UI and mobile support are out of scope for now.
- Prioritize building a teacher-centered API that’s easy to integrate into dashboards later.
- Every feature should map to one of the following questions:
  1. “Is my student using AI?”
  2. “Is my student improving?”

---


