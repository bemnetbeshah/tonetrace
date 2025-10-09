# analyzers/grammar_rules.py

def check_subject_verb_agreement(doc):
    """
    Detects mismatches between subject and verb number (e.g., "She run" or "They runs").
    """
    errors = []
    for token in doc:
        if token.dep_ == "nsubj":
            subject = token
            verb = subject.head

            # Make sure the head is a verb
            if verb.pos_ != "VERB":
                continue

            # Check singular/plural
            # PRP = personal pronoun (he, she, it = singular; they = plural)
            # NNS = plural noun
            subj_plural = subject.tag_ == "NNS" or subject.text.lower() == "they"
            # VBP = verb, present tense, not 3rd person singular (plural)
            # VBZ = verb, present tense, 3rd person singular
            verb_plural = verb.tag_ == "VBP"
            
            # For singular subjects (he, she, it), we expect VBZ (3rd person singular)
            # For plural subjects (they, plural nouns), we expect VBP (plural)
            # Error cases:
            # 1. Singular subject (he) + plural verb (VBP) -> should be VBZ
            # 2. Plural subject (they) + singular verb (VBZ) -> should be VBP
            is_singular_subject = subject.tag_ == "PRP" and subject.text.lower() in ["he", "she", "it"]
            is_plural_subject = subj_plural
            
            if (is_singular_subject and verb.tag_ == "VBP") or (is_plural_subject and verb.tag_ == "VBZ"):
                errors.append({
                    "type": "Subject-Verb Agreement",
                    "error": f"'{subject.text}' may not agree with '{verb.text}'",
                    "sentence": subject.sent.text.strip()
                })

    return errors

def check_sentence_fragments(doc):
    """
    Detects sentence fragments—clauses that lack a subject or a main verb,
    or start with subordinating conjunctions.
    """
    errors = []
    
    # Common subordinating conjunctions
    subordinating_conjunctions = {
        "because", "although", "though", "unless", "until", "while", 
        "whereas", "whenever", "wherever", "whether", "if", "since",
        "as", "before", "after", "when", "where", "why", "how"
    }
    
    for sent in doc.sents:
        has_subject = any(tok.dep_ in ("nsubj", "nsubjpass") for tok in sent)
        has_main_verb = any(tok.dep_ == "ROOT" and tok.pos_ in ("VERB", "AUX") for tok in sent)
        
        # Check if sentence starts with a subordinating conjunction
        starts_with_subordinator = (
            sent[0].text.lower() in subordinating_conjunctions and 
            sent[0].pos_ == "SCONJ"
        )

        if not has_subject or not has_main_verb or starts_with_subordinator:
            errors.append({
                "type": "Sentence Fragment",
                "error": "This may be a sentence fragment (missing subject or verb, or starts with a subordinating conjunction).",
                "sentence": sent.text.strip()
            })

    return errors

def run_all_rules(doc):
    """
    Runs all grammar rules and returns a flat list of detected errors.
    """
    errors = []
    errors.extend(check_subject_verb_agreement(doc))
    errors.extend(check_sentence_fragments(doc))
    return errors
