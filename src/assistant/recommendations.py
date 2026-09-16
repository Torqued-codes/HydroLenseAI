def get_recommendations(analysis: dict) -> list[str]:
    if analysis.get("anomaly"):
        return [
            "Verify the sensor reading and check for measurement or calibration errors.",
            "Compare the observation with recent historical readings and nearby measurements.",
            "If the unusual pattern persists, arrange appropriate field or laboratory verification.",
            "Do not treat the model result alone as proof that water is safe or unsafe."
        ]

    return [
        "Continue routine monitoring of water-quality parameters.",
        "Compare future readings with the established baseline to detect changes early.",
        "Use appropriate laboratory or regulatory procedures for formal water-quality decisions."
    ]
