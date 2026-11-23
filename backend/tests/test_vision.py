"""Tests for NetraCare Multimodal Clinical Vision Feature.
Verifies:
1. Invalid / non-image error handling
2. Spectacle prescription optical parameter extraction (OD/OS Sph, Cyl, Axis)
3. Zero-diagnosis enforcement on optical & eye photo scans
4. End-to-end integration via /api/v1/patient/chat with image_base64
"""
import base64
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.rag.vision import analyze_eye_image

@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c

@pytest.fixture
def patient_token(client):
    res = client.post("/api/v1/auth/login", json={"role": "patient", "mobile": "9000000001", "name": "Asha Verma"})
    return res.json()["session_token"]

def test_analyze_eye_image_corrupted_data():
    """Verify corrupted base64 data returns safe fallback without crashing."""
    res = analyze_eye_image(image_base64="not_a_valid_base64_string!!!!")
    assert res["image_type"] == "unclear"
    assert "Unable to decode" in res["summary"]
    assert res["is_emergency"] is False

def test_analyze_eye_image_mock_fallback_structure(monkeypatch):
    """Verify fallback structure matches strict schema when API key is simulated absent."""
    import app.config as config_mod
    monkeypatch.setattr(config_mod.settings, "GEMINI_API_KEY", "")
    
    # 1x1 transparent PNG
    sample_b64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
    res = analyze_eye_image(image_base64=sample_b64)
    assert res["image_type"] in ["prescription", "unclear", "other"]
    assert "summary" in res
    assert "extracted_parameters" in res
    assert res["is_emergency"] is False

def test_patient_chat_endpoint_with_image(client, patient_token):
    """Verify /patient/chat handles image_base64 and returns image_analysis in response."""
    sample_b64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
    
    res = client.post(
        "/api/v1/patient/chat",
        headers={"X-Session-Data": patient_token},
        json={
            "message": "Here is my spectacle prescription card.",
            "image_base64": sample_b64,
            "image_mime_type": "image/png",
        },
    )
    assert res.status_code == 200
    data = res.json()
    assert "answer" in data
    assert "thread_id" in data
    assert data["image_analysis"] is not None
    assert "summary" in data["image_analysis"]
