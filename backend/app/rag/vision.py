"""NetraCare Multimodal Clinical Vision Service.
Analyzes user-uploaded prescription cards, spectacle reports, and external eye photos.
Enforces strict 0-diagnosis clinical rules (never diagnoses diseases like conjunctivitis or cataracts).
Extracts optical prescription parameters (OD, OS, SPH, CYL, Axis) or clinical observations.
"""
import os
import re
import json
import base64
from typing import Dict, Any, Optional
from google import genai
from google.genai import types

from app.config import settings

VISION_PROMPT = """You are the Multimodal Clinical Intake Assistant for NetraCare Eye Clinic.
You are analyzing an image uploaded by a patient. The image may be:
1. A spectacle / contact lens prescription card, autorefractor slip, or doctor's prescription note.
2. An external photo of an eye (e.g., redness, eyelid swelling, stye, discharge).
3. An unreadable, blurry, or non-clinical photo.

CRITICAL CLINICAL & SAFETY RULES:
1. ZERO DIAGNOSIS: NEVER diagnose or name a condition or disease the patient might have (e.g. NEVER say "you have conjunctivitis", "this looks like a cataract", or "this is uveitis").
2. NO TREATMENT: NEVER prescribe or suggest eye drops, ointments, medicines, or home remedies.
3. If it is an OPTICAL PRESCRIPTION:
   - Extract Right Eye (OD) and Left Eye (OS) Sphere (SPH), Cylinder (CYL), Axis, and Near Addition (ADD) if visible.
   - Summarize the prescription values clearly.
   - Suggest appropriate clinic routing:
     * For myopia/astigmatism correction inquiry -> Refractive Surgery / LASIK suitability check with Dr. Fatima Khan.
     * For general lens check / updated prescription -> General Ophthalmology (Dr. Anand Rao, Dr. Meera Iyer, or Dr. Kiran Shah).
4. If it is an EXTERNAL EYE PHOTO:
   - Describe ONLY neutral, objective visual observations (e.g. "Visible redness on the conjunctiva", "Localized swelling along the upper eyelid margin").
   - Route to Cornea & Anterior Segment (Dr. Fatima Khan) or General Ophthalmology.
   - If acute trauma, chemical splash, or deep bleeding is visible, flag is_emergency: true.
5. If unreadable, blurry, or not an eye/prescription image:
   - State politely that the image could not be read clearly and advise bringing the physical paper to the clinic.

Return STRICT JSON with these exact keys:
{
  "image_type": "prescription" | "eye_photo" | "unclear" | "other",
  "summary": "Clear, friendly clinical summary for the patient (under 90 words)",
  "extracted_parameters": {
    "od": {"sph": "string or null", "cyl": "string or null", "axis": "string or null", "add": "string or null"},
    "os": {"sph": "string or null", "cyl": "string or null", "axis": "string or null", "add": "string or null"}
  },
  "recommended_speciality": "Refractive" | "Cornea" | "General" | "Paediatric" | null,
  "recommended_doctor": "Dr. Fatima Khan" | "Dr. Anand Rao" | "Dr. Vikram Menon" | null,
  "is_emergency": false
}
"""

def analyze_eye_image(
    image_base64: str,
    mime_type: str = "image/jpeg",
    user_prompt: str = "",
) -> Dict[str, Any]:
    """Analyze an uploaded optical prescription or eye photo using Gemini Vision."""
    # 1. Clean base64 header if present (e.g., 'data:image/jpeg;base64,...')
    clean_b64 = image_base64
    if "," in clean_b64:
        header, data = clean_b64.split(",", 1)
        clean_b64 = data
        if "data:" in header and ";base64" in header:
            mime_match = re.search(r"data:([^;]+);base64", header)
            if mime_match:
                mime_type = mime_match.group(1)

    try:
        image_bytes = base64.b64decode(clean_b64)
    except Exception as e:
        return {
            "image_type": "unclear",
            "summary": "Unable to decode the uploaded image. Please ensure the file is a valid JPG or PNG image.",
            "extracted_parameters": {},
            "recommended_speciality": None,
            "recommended_doctor": None,
            "is_emergency": False,
        }

    api_key = settings.GEMINI_API_KEY or os.getenv("GOOGLE_API_KEY")
    if not api_key:
        return {
            "image_type": "prescription",
            "summary": "Image received. Optical card attached to your clinical consultation intake notes.",
            "extracted_parameters": {},
            "recommended_speciality": "General",
            "recommended_doctor": "Dr. Anand Rao",
            "is_emergency": False,
        }

    # Attempt analysis with gemini-3.5-flash-lite, fallback to gemini-2.5-flash
    models_to_try = ["gemini-3.5-flash-lite", "gemini-2.5-flash"]
    for model_name in models_to_try:
        try:
            client = genai.Client(api_key=api_key)
            part = types.Part.from_bytes(data=image_bytes, mime_type=mime_type)
            
            prompt_text = f"{VISION_PROMPT}\n\nPatient Note / Query: {user_prompt or 'Please analyze this clinical image.'}"
            res = client.models.generate_content(
                model=model_name,
                contents=[part, prompt_text],
                config=types.GenerateContentConfig(
                    temperature=0.1,
                    response_mime_type="application/json",
                ),
            )
            raw_text = res.text.strip()
            # Clean markdown code block fences if present
            raw_text = re.sub(r"^```json\s*", "", raw_text)
            raw_text = re.sub(r"^```\s*", "", raw_text)
            raw_text = re.sub(r"\s*```$", "", raw_text)

            parsed = json.loads(raw_text)
            if isinstance(parsed, list) and len(parsed) > 0 and isinstance(parsed[0], dict):
                parsed = parsed[0]
            if isinstance(parsed, dict):
                return parsed
        except Exception:
            continue

    # Deterministic fallback if network is offline
    return {
        "image_type": "prescription",
        "summary": "Your prescription image has been received and attached to your consultation intake. Our ophthalmologist will inspect your optical values during your visit.",
        "extracted_parameters": {},
        "recommended_speciality": "General",
        "recommended_doctor": "Dr. Anand Rao",
        "is_emergency": False,
    }
