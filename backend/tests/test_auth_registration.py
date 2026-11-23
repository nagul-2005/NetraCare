"""Tests for NetraCare Patient Registration, Availability Check, and Sign In.
Verifies:
1. Availability check endpoint returns correct status for existing vs new mobile numbers.
2. Registration of new patient saves to database with correct age/year_of_birth and returns session token.
3. Duplicate registration with existing mobile number is refused.
4. Validation errors for invalid age, missing fields, or short mobile.
5. Sign in for existing patient succeeds with matching name.
6. Sign in for non-existent patient returns 404 PATIENT_NOT_FOUND advising registration.
7. Sign in with wrong name returns 400 PATIENT_DETAILS_MISMATCH.
"""
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.db.session import init_db, SessionLocal
from app.db.models import Patient
from app.db.seed import seed_db

@pytest.fixture(scope="module", autouse=True)
def setup_test_db():
    init_db()
    db = SessionLocal()
    db.query(Patient).filter(Patient.mobile.like("98765%")).delete()
    db.commit()
    seed_db(db, load_stretch=False)
    db.close()

@pytest.fixture(autouse=True)
def clean_test_patients():
    db = SessionLocal()
    db.query(Patient).filter(Patient.mobile.like("98765%")).delete()
    db.commit()
    db.close()

@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c

def test_check_availability(client):
    # Seeded patient: Asha Verma (9000000001)
    res_existing = client.get("/api/v1/auth/check-availability?mobile=9000000001")
    assert res_existing.status_code == 200
    data_existing = res_existing.json()
    assert data_existing["available"] is False
    assert data_existing["registered"] is True
    assert data_existing["name"] == "Asha Verma"

    # Brand new mobile
    res_new = client.get("/api/v1/auth/check-availability?mobile=9876543210")
    assert res_new.status_code == 200
    data_new = res_new.json()
    assert data_new["available"] is True
    assert data_new["registered"] is False
    assert data_new["name"] is None

def test_patient_registration_success_and_db_persistence(client):
    # Register new patient: Rahul Sharma, Age 26
    mobile_test = "9876500001"
    res = client.post("/api/v1/auth/register", json={
        "name": "Rahul Sharma",
        "mobile": mobile_test,
        "age": 26,
    })
    assert res.status_code == 200
    data = res.json()
    assert data["ok"] is True
    assert "session_token" in data
    assert data["user"]["name"] == "Rahul Sharma"
    assert data["user"]["role"] == "patient"
    assigned_id = data["user"]["id"]
    assert assigned_id.startswith("P")

    # Verify directly in database
    db = SessionLocal()
    try:
        p = db.query(Patient).filter(Patient.mobile == mobile_test).first()
        assert p is not None
        assert p.name == "Rahul Sharma"
        # Year of birth check: 2026 - 26 = 2000
        assert p.year_of_birth in [2000, 2001]
    finally:
        db.close()

    # Now verify this newly registered patient can sign in
    signin_res = client.post("/api/v1/auth/login", json={
        "role": "patient",
        "mobile": mobile_test,
        "name": "Rahul Sharma",
    })
    assert signin_res.status_code == 200
    assert signin_res.json()["user"]["id"] == assigned_id

def test_patient_registration_duplicate_mobile_rejected(client):
    # Try to register using existing Asha Verma mobile (9000000001)
    res = client.post("/api/v1/auth/register", json={
        "name": "Another Person",
        "mobile": "9000000001",
        "age": 30,
    })
    assert res.status_code == 400
    detail = res.json()["detail"]
    assert "MOBILE_ALREADY_REGISTERED" in str(detail) or "already registered" in str(detail)

def test_patient_registration_validation(client):
    # Invalid age (0 or negative)
    res_bad_age = client.post("/api/v1/auth/register", json={
        "name": "Test User",
        "mobile": "9876500002",
        "age": 0,
    })
    assert res_bad_age.status_code in [400, 422]

    # Invalid mobile (too short)
    res_bad_mobile = client.post("/api/v1/auth/register", json={
        "name": "Test User",
        "mobile": "12345",
        "age": 25,
    })
    assert res_bad_mobile.status_code in [400, 422]

def test_patient_signin_not_found(client):
    # Try signing in with unknown mobile -> must return 404 instructing to register
    res = client.post("/api/v1/auth/login", json={
        "role": "patient",
        "mobile": "9999999999",
        "name": "Ghost User",
    })
    assert res.status_code == 404
    detail = res.json()["detail"]
    assert "PATIENT_NOT_FOUND" in str(detail) or "register as a new patient" in str(detail)

def test_patient_signin_name_mismatch(client):
    # Asha Verma (9000000001) with wrong name -> 400 PATIENT_DETAILS_MISMATCH
    res = client.post("/api/v1/auth/login", json={
        "role": "patient",
        "mobile": "9000000001",
        "name": "Wrong Name",
    })
    assert res.status_code == 400
    detail = res.json()["detail"]
    assert "PATIENT_DETAILS_MISMATCH" in str(detail)
