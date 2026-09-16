def explain_risk(analysis: dict) -> dict:
    if analysis.get("anomaly"):
        return {
            "priority": "High",
            "status": "Unusual pattern detected",
            "explanation": (
                "One or more measurements differ from the learned baseline. "
                "The result should be verified before taking consequential action."
            )
        }

    return {
        "priority": "Routine",
        "status": "No unusual pattern detected",
        "explanation": (
            "The submitted measurements are within the model's learned pattern. "
            "Routine monitoring and appropriate testing should continue."
        )
    }
