from typing import Any
from src.models.detect_anomaly import analyze_single

REQUIRED_FIELDS = ["pH", "turbidity_ntu", "tds_mg_l", "temperature_c",
                   "dissolved_oxygen_mg_l", "conductivity_us_cm"]

def validate_input(values: dict[str, Any]) -> dict[str, float]:
    missing = [x for x in REQUIRED_FIELDS if x not in values]
    if missing:
        raise ValueError("Missing required fields: " + ", ".join(missing))
    result = {}
    for field in REQUIRED_FIELDS:
        try:
            result[field] = float(values[field])
        except (TypeError, ValueError):
            raise ValueError(f"{field} must be numeric")
    return result

def run_anomaly_analysis(values: dict[str, Any]) -> dict:
    return analyze_single(validate_input(values))
