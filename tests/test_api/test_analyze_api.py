import httpx

def test_classify_tone_model_via_api():
    url = "http://localhost:8000/analyze"
    samples = [
        {
            "text": (
                "I'm really sorry for not getting back to you sooner. I completely understand if you're frustrated, "
                "and I take full responsibility for the delay. Please let me know how I can make this right."
            ),
            "expected_tone": "apologetic"
        },
        {
            "text": (
                "This solution is clearly the most effective. We've tested it across multiple scenarios, and the results "
                "speak for themselves. There's no doubt in my mind that it's the right choice."
            ),
            "expected_tone": "confident"
        },
        {
            "text": (
                "I can’t believe this happened again. It’s absolutely unacceptable and shows a complete lack of respect. "
                "I’m tired of excuses — this needs to be fixed immediately."
            ),
            "expected_tone": "angry"
        },
        {
            "text": (
                "Imagine how much better your life could be with just a few small changes. You deserve to feel confident "
                "and in control — and this program will help you get there."
            ),
            "expected_tone": "persuasive"
        },
        {
            "text": (
                "The report summarizes our quarterly performance, noting changes in revenue and operational costs. "
                "No major anomalies were found in the financial audit."
            ),
            "expected_tone": "neutral"
        },
    ]

    for idx, sample in enumerate(samples, 1):
        try:
            response = httpx.post(url, json={"text": sample["text"]})
            response.raise_for_status()
            result = response.json()
            print(f"Sample {idx}:")
            print(f"  Expected tone: {sample['expected_tone']}")
            print(f"  Detected tone: {result.get('tone')}")
            print(f"  Emotions: {result.get('emotions')}\n")
        except Exception as e:
            print(f"Sample {idx} API call failed:", str(e))

