"""Authentication router implementing NetraCare patient registration and login.
- Returning patients sign in with Full Name + Mobile Number.
- New patients register with Full Name, Mobile Number, and Age.
- Live check-availability endpoint for real-time mobile verification.
- Doctors pick their profile; staff log in with name.
"""
import re
import base64
import json
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.config import get_clinic_now
from app.db.session import get_db
from app.db.models import Patient, Doctor
from app.services.reasons import ReasonCode, REASON_MESSAGES
from app.api.deps import get_current_user, CurrentUser

router = APIRouter(prefix="/auth", tags=["Auth"])

class LoginRequest(BaseModel):
    role: str  # "patient", "doctor", "staff", "admin"
    mobile: Optional[str] = None
    name: Optional[str] = None
    doctor_id: Optional[str] = None

class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100, description="Full name of patient")
    mobile: str = Field(..., min_length=10, max_length=20, description="10-digit mobile number")
    age: int = Field(..., ge=1, le=120, description="Patient age in years")

class AvailabilityResponse(BaseModel):
    available: bool
    registered: bool
    name: Optional[str] = None
    message: str

class LoginResponse(BaseModel):
    ok: bool
    session_token: str
    user: CurrentUser
    message: str

@router.get("/check-availability", response_model=AvailabilityResponse)
def check_availability(
    mobile: str = Query(..., min_length=3, description="Mobile number to check"),
    db: Session = Depends(get_db),
):
    """Check if a mobile number is already registered or available for a newcomer."""
    mobile_clean = mobile.strip()
    existing = db.query(Patient).filter(Patient.mobile == mobile_clean).first()
    if existing:
        return AvailabilityResponse(
            available=False,
            registered=True,
            name=existing.name,
            message=f"Mobile number is already registered to {existing.name}.",
        )
    return AvailabilityResponse(
        available=True,
        registered=False,
        name=None,
        message="Mobile number is available for registration.",
    )

@router.post("/register", response_model=LoginResponse)
def register_patient(req: RegisterRequest, db: Session = Depends(get_db)):
    """Register a new newcomer patient with Name, Mobile, and Age, saving to the database."""
    name_clean = req.name.strip()
    mobile_clean = req.mobile.strip()

    if not name_clean:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Full name is required for registration.",
        )

    digits_only = re.sub(r"\D", "", mobile_clean)
    if len(digits_only) < 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide a valid mobile number with at least 10 digits.",
        )

    # Check if mobile already exists in database
    existing = db.query(Patient).filter(Patient.mobile == mobile_clean).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "reason_code": ReasonCode.MOBILE_ALREADY_REGISTERED.value,
                "message": f"Mobile {mobile_clean} is already registered under {existing.name}. Please sign in instead.",
            },
        )

    # Derive year_of_birth from age
    now = get_clinic_now()
    year_of_birth = now.year - req.age

    # Generate sequential patient ID (P01, P02, etc.)
    all_patients = db.query(Patient).all()
    max_num = 0
    for p in all_patients:
        pid = (p.id or "").strip()
        if pid.startswith("P") and pid[1:].isdigit():
            try:
                max_num = max(max_num, int(pid[1:]))
            except ValueError:
                pass
    new_id = f"P{max_num + 1:02d}"

    new_patient = Patient(
        id=new_id,
        name=name_clean,
        mobile=mobile_clean,
        year_of_birth=year_of_birth,
    )
    db.add(new_patient)
    db.commit()
    db.refresh(new_patient)

    user = CurrentUser(role="patient", id=new_patient.id, name=new_patient.name)
    session_bytes = json.dumps(user.model_dump()).encode("utf-8")
    session_token = base64.b64encode(session_bytes).decode("utf-8")

    return LoginResponse(
        ok=True,
        session_token=session_token,
        user=user,
        message=f"Welcome to NetraCare, {new_patient.name}! Your account has been created successfully.",
    )

@router.post("/login", response_model=LoginResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    """Sign in existing patients (Name + Mobile), Doctors, or Staff."""
    role = req.role.strip().lower()

    if role == "patient":
        if not req.mobile or not req.name:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Mobile number and name are required for patient login.",
            )
        mobile_clean = req.mobile.strip()
        name_clean = req.name.strip()

        # Check existing patient
        existing = db.query(Patient).filter(Patient.mobile == mobile_clean).first()
        if existing:
            # Check name match
            if existing.name.strip().lower() != name_clean.lower():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail={
                        "reason_code": ReasonCode.PATIENT_DETAILS_MISMATCH.value,
                        "message": REASON_MESSAGES[ReasonCode.PATIENT_DETAILS_MISMATCH],
                    },
                )
            patient = existing
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={
                    "reason_code": ReasonCode.PATIENT_NOT_FOUND.value,
                    "message": f"No patient found with mobile {mobile_clean}. Please register as a new patient.",
                },
            )

        user = CurrentUser(role="patient", id=patient.id, name=patient.name)

    elif role == "doctor":
        if not req.doctor_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Doctor ID is required for doctor login.",
            )
        doc = db.query(Doctor).filter(Doctor.id == req.doctor_id.strip()).first()
        if not doc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Doctor '{req.doctor_id}' not found.",
            )
        user = CurrentUser(role="doctor", id=doc.id, name=doc.name)

    elif role in ["staff", "admin", "sub_admin"]:
        name_clean = req.name.strip() if req.name else "Front Desk Staff"
        user = CurrentUser(role=role, id=f"staff_{name_clean.lower().replace(' ', '_')}", name=name_clean)

    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unknown role '{req.role}'.",
        )

    # Encode user as base64 session token
    session_bytes = json.dumps(user.model_dump()).encode("utf-8")
    session_token = base64.b64encode(session_bytes).decode("utf-8")

    return LoginResponse(
        ok=True,
        session_token=session_token,
        user=user,
        message=f"Welcome {user.name} ({user.role})",
    )

@router.get("/me", response_model=CurrentUser)
def get_me(user: CurrentUser = Depends(get_current_user)):
    return user

@router.post("/logout")
def logout():
    return {"ok": True, "message": "Logged out successfully"}
