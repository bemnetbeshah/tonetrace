# analyzers/passive_voice.py

import spacy

nlp = spacy.load("en_core_web_sm")

def detect_passive_sentences(text: str) -> dict:
    doc = nlp(text)
    passive_count = 0
    total_sentences = 0

    for sent in doc.sents:
        total_sentences += 1
        for token in sent:
            if (token.dep_ == "auxpass") or (
                token.tag_ == "VBN" and token.head.dep_ == "auxpass"
            ):
                passive_count += 1
                break  # One detection is enough for the sentence

    return {
        "passive_sentence_ratio": passive_count / total_sentences if total_sentences else 0.0,
        "passive_count": passive_count,
        "total_sentences": total_sentences,
    }
