import httpx

def test_analyze():
    url = "http://localhost:8000/analyze"
    payload = {
        "text": (
            "The methodology utilized in the experimental analysis significantly "
            "impacted the outcome, which was not immediately evident."
        )
    }

    try:
        response = httpx.post(url, json=payload)
        response.raise_for_status()  # Raise error for non-200 responses
        result = response.json()
        print("API response:")
        for key, value in result.items():
            print(f"{key}:\n  {value}\n")
    except Exception as e:
        print("API call failed:", str(e))

if __name__ == "__main__":
    test_analyze()
