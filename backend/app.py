"""
AgriShield AI - FastAPI Backend
Wraps the crop_intelligence pipeline for the React frontend demo.
"""
import os
import sys
import numpy as np
from datetime import datetime
from typing import Optional
import uvicorn

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# ── Add project root so that crop_intelligence & temporal_intelligence are importable ──
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, PROJECT_ROOT)

app = FastAPI(title="AgriShield AI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Lazy singleton ──────────────────────────────────────────────────────────────
_validator = None

def get_validator():
    global _validator
    if _validator is None:
        from crop_intelligence.insurance_validation import InsuranceClaimValidator
        _validator = InsuranceClaimValidator()
    return _validator

# ── Region / Season mappings ────────────────────────────────────────────────────
SEASON_TIMESTAMPS = {
    "kharif": [
        "2024-06-01", "2024-07-01", "2024-08-01",
        "2024-09-01", "2024-10-01", "2024-11-01",
    ],
    "rabi": [
        "2024-12-01", "2025-01-01", "2025-02-01",
        "2025-03-01", "2025-04-01", "2025-05-01",
    ],
}

CROP_SEASON = {
    "Paddy":     "kharif",
    "Cotton":    "kharif",
    "Maize":     "kharif",
    "Wheat":     "rabi",
}

# ── Request / Response models ───────────────────────────────────────────────────
class ClaimRequest(BaseModel):
    farmer_name: str = "Farmer"
    crop_type: str          # Paddy | Wheat | Cotton | Sugarcane
    region: str             # andhra_pradesh | punjab | maharashtra
    incident_date: str      # YYYY-MM-DD
    cause_of_loss: str      # Drought | Extreme Heat | Excess Rainfall | Pest/Disease
    farm_area_ha: float = 2.0

# ── JSON serialisation helper (numpy → native Python) ──────────────────────────
def _clean(obj):
    if isinstance(obj, (np.integer,)):
        return int(obj)
    if isinstance(obj, (np.floating,)):
        return float(obj)
    if isinstance(obj, np.ndarray):
        return _clean(obj.tolist())
    if isinstance(obj, dict):
        return {k: _clean(v) for k, v in obj.items()}
    if isinstance(obj, (list, tuple)):
        return [_clean(i) for i in obj]
    return obj

# ── Health check ────────────────────────────────────────────────────────────────
@app.get("/health")
def health():
    return {"status": "ok", "message": "AgriShield AI API is running"}

# ── Main validation endpoint ────────────────────────────────────────────────────
@app.post("/validate-claim")
def validate_claim(claim: ClaimRequest):
    try:
        season = CROP_SEASON.get(claim.crop_type, "kharif")
        timestamps = SEASON_TIMESTAMPS[season]

        # Pick the correct pre-extracted satellite tensor
        data_dir = os.path.join(PROJECT_ROOT, "data")
        if not os.path.exists(data_dir):
            data_dir = os.path.join(PROJECT_ROOT, "data_engineering")
        tensor_file = os.path.join(data_dir, f"farm_timeseries_{season}.npy")

        # Fallback to the generic tensor if the seasonal one doesn't exist yet
        if not os.path.exists(tensor_file):
            tensor_file = os.path.join(data_dir, "farm_timeseries.npy")

        if not os.path.exists(tensor_file):
            raise HTTPException(
                status_code=404,
                detail=(
                    "Satellite tensor not found. "
                    "Please run data_engineering/gee_timeseries_pipeline.py first."
                ),
            )

        claim_id = f"AGS-{int(datetime.now().timestamp())}"

        validator = get_validator()
        result = validator.process_claim(
            claim_id=claim_id,
            reported_crop=claim.crop_type,
            reported_incident_date=claim.incident_date,
            reported_cause=claim.cause_of_loss,
            timestamps=timestamps,
            tensor_filepath=tensor_file,
        )

        # Attach some extra metadata the frontend wants
        result["farmer_name"] = claim.farmer_name
        result["region"] = claim.region
        result["farm_area_ha"] = claim.farm_area_ha
        result["season"] = season
        result["satellite_timestamps"] = timestamps

        return _clean(result)

    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


if __name__ == "__main__":
    print("Starting AgriShield AI FastAPI Server on http://localhost:8000 ...")
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)

