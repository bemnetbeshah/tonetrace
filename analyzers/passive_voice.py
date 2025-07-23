# analyzers/passive_voice.py

import spacy

nlp = spacy.load("en_core_web_sm")

def detect_passive_sentences(text: str) -> dict:
    """
    Detects passive voice sentences in the input text.
    Uses spaCy to parse the text and checks each sentence for passive constructions.
    Returns a dictionary with the ratio of passive sentences, the count of passive sentences, and the total number of sentences.
    """
    doc = nlp(text)  # Process the text with spaCy
    passive_count = 0  # Counter for passive sentences
    total_sentences = 0  # Counter for total sentences

    for sent in doc.sents:
        total_sentences += 1
        # Check each token in the sentence for passive voice indicators
        for token in sent:
            # 'auxpass' is a passive auxiliary verb; 'VBN' is a past participle
            if (token.dep_ == "auxpass") or (
                token.tag_ == "VBN" and token.head.dep_ == "auxpass"
            ):
                passive_count += 1
                break  # Only count one passive detection per sentence

    return {
        # Ratio of passive sentences to total sentences (rounded to 2 decimals if needed)
        "passive_sentence_ratio": passive_count / total_sentences if total_sentences else 0.0,
        "passive_count": passive_count,
        "total_sentences": total_sentences,
    }
