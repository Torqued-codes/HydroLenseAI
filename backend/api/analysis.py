from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from backend.services.anomaly_service import run_anomaly_analysis
from backend.services.rag_service import create_explanation
from backend.services.recommendation_service import build_recommendations

router = APIRouter(prefix="/analysis", tags=["Analysis"])

class WaterQualityInput(BaseModel):
    pH: float
    turbidity_ntu: float = Field(..., ge=0)
    tds_mg_l: float = Field(..., ge=0)
    temperature_c: float
    dissolved_oxygen_mg_l: float = Field(..., ge=0)
    conductivity_us_cm: float = Field(..., ge=0)

@router.post("")
def analyze_water_quality(data: WaterQualityInput):
    try:
        analysis = run_anomaly_analysis(data.model_dump())
        return {
            "success": True,
            "analysis": analysis,
            "risk": build_recommendations(analysis)["risk"],
            "recommendations": build_recommendations(analysis)["recommendations"],
            "explanation": create_explanation(analysis),
            "disclaimer": "Anomaly detection is decision support, not a certification of water safety."
        }
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc))
