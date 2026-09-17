from src.assistant.risk_explainer import explain_risk
from src.assistant.recommendations import get_recommendations

def build_recommendations(analysis: dict) -> dict:
    return {
        "risk": explain_risk(analysis),
        "recommendations": get_recommendations(analysis)
    }
