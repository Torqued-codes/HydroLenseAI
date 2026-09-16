from src.models.detect_anomaly import analyze_single
from src.rag.retrieve_guidance import retrieve_guidance
from src.rag.generate_explanation import generate_explanation
from src.assistant.risk_explainer import explain_risk
from src.assistant.recommendations import get_recommendations

def analyze_water(values: dict) -> dict:
    analysis = analyze_single(values)
    risk = explain_risk(analysis)
    guidance = retrieve_guidance("water quality anomaly verification guidance")
    explanation = generate_explanation(analysis, guidance)
    recommendations = get_recommendations(analysis)

    return {
        "analysis": analysis,
        "risk": risk,
        "explanation": explanation,
        "recommendations": recommendations,
        "guidance_sources": guidance
    }

if __name__ == "__main__":
    demo = {
        "pH": 6.1,
        "turbidity_ntu": 11.5,
        "tds_mg_l": 710,
        "temperature_c": 29.0,
        "dissolved_oxygen_mg_l": 3.0,
        "conductivity_us_cm": 860
    }
    print(analyze_water(demo))
