from fastapi.testclient import TestClient
from api.main import app

client = TestClient(app)
BASE = {"amount": 34000, "monthlyBenefit": 1840, "daysSinceNotice": 27, "monthlyIncome": 1840, "essentialExpenses": 1760, "program": "title2", "fault": "reported"}

def test_health():
    assert client.get("/health").json() == {"status": "ok"}

def test_title_two_readiness_calculates_pressure_and_routes():
    response = client.post("/readiness", json=BASE)
    assert response.status_code == 200
    body = response.json()
    assert body["urgency"] == "ACT NOW"
    assert body["estimatedWithholding"] == 920
    assert body["hardshipGap"] == 840
    assert [route["title"] for route in body["routes"]] == ["Request a waiver", "Request a lower recovery rate", "Reconsider the amount"]

def test_ssi_uses_ten_percent_assumption():
    payload = {**BASE, "program": "ssi", "daysSinceNotice": 5}
    body = client.post("/readiness", json=payload).json()
    assert body["defaultRate"] == 0.1
    assert body["estimatedWithholding"] == 184
    assert body["urgency"] == "PLAN NEXT STEP"

def test_invalid_amount_is_rejected():
    response = client.post("/readiness", json={**BASE, "amount": 0})
    assert response.status_code == 422

def test_invalid_program_is_rejected():
    response = client.post("/readiness", json={**BASE, "program": "medicare"})
    assert response.status_code == 422
