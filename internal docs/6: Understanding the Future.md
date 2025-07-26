# 📈 ToneTrace – Step 6: Understanding the Future

This document outlines the projected future of the ToneTrace project, so technical decisions today align with long-term goals. It helps prevent over-engineering features that may never matter — or under-engineering core foundations.

---

## ⏳ 1. Project Duration & Commitment

- **Initial Timeline**: Summer 2025
- **Post-Summer Plan**: Present ToneTrace to English professors during the school year to gather feedback
- **Decision Point**: Depending on reception, decide whether to evolve ToneTrace into a full product (Level 3)

---

## 🧭 2. Target Scope Level

| Level | Description                                   | Your Target? |
|-------|-----------------------------------------------|--------------|
| 🟢 1   | MVP + resume/demo project                     | ✅ Complete during summer |
| 🟡 2   | Real, deployable backend + demo frontend      | ✅ Core goal |
| 🔵 3   | Full SaaS platform with UI, auth, users       | 🔜 If validated |

> 🔹 **Your Plan**:  
Build a working Level 2 version this summer with:
- Fully functioning backend
- Real fingerprinting and anomaly detection logic
- A **basic frontend** for testing or demo purposes
- Leave room for fine-tuning models and feature UX later

Then, **re-evaluate based on user feedback** and consider expanding to Level 3 during the school year.

---

## 🛠️ 3. Future Feature Roadmap

| Feature                           | Planned? | Notes |
|-----------------------------------|----------|-------|
| Writing style drift detection     | ✅ Yes   | Core to MVP |
| Progress analytics                | ✅ Yes   | Basic trends at least |
| Student-facing feedback           | ✅ Yes   | Later, optional |
| Tone-conditioned LLM output       | ✅ Yes   | Research project or v2 |
| Multi-language support            | ✅ Yes   | Future priority |
| Editor/plugin integration         | 🔲 Maybe | Stretch |
| Offline / low-resource support    | 🔲 Maybe | Possible future grant angle |
| School-wide dashboards            | 🔲 Future| Institutional scale |

---

## 🧠 4. Engineering Implications

- ✅ **Persist writing samples and fingerprints** in a relational DB
- ✅ **Structure analysis as modular services** so new analyzers can be added easily
- ✅ **Abstract NLP tools** to enable multilingual expansion
- ✅ **Design with teacher/student separation** in mind for easy user auth later
- ✅ **Expose JSON responses in frontend-friendly format** to reduce UI complexity

---

## ✅ Summary

- This is a **serious, summer-focused MVP** with long-term potential
- Goal is to reach a **Level 2 deployable backend + basic frontend**
- Further investment into Level 3 depends on **real user feedback from educators**

