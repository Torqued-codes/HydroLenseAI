def generate_explanation(analysis: dict, guidance=None) -> str:
    label = analysis.get("label", "unknown")
    score = analysis.get("anomaly_score")

    if label == "anomaly":
        message = (
            f"The submitted water-quality pattern was flagged as unusual "
            f"relative to the model baseline (anomaly score: {score:.3f}). "
            "This is an early warning, not a determination that the water is unsafe. "
            "Verify the measurements and consider appropriate field or laboratory testing."
        )
    else:
        message = (
            f"The submitted pattern was not flagged as unusual by the model "
            f"(anomaly score: {score:.3f}). This does not certify that the water is safe; "
            "continue normal monitoring and appropriate testing."
        )

    if guidance:
        message += "\n\nRelevant guidance:\n" + "\n".join(guidance[:2])

    return message
