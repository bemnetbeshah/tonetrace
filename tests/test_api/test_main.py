from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_analyze_basic():
    response = client.post("/analyze", json={"text": "The cat was chased by the dog."})
    assert response.status_code == 200
    assert "sentiment" in response.json()
    assert "passive_analysis" in response.json()