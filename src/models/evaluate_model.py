import pandas as pd
from src.models.detect_anomaly import detect_anomalies
from src.utils.config import CLEAN_DATA_PATH

def evaluate_anomaly_model(df=None) -> dict:
    data = df if df is not None else pd.read_csv(CLEAN_DATA_PATH)
    result = detect_anomalies(data)

    anomaly_count = int(result["anomaly"].sum())
    total = len(result)

    return {
        "total_samples": total,
        "anomalies": anomaly_count,
        "anomaly_rate": anomaly_count / total if total else 0.0,
        "mean_anomaly_score": float(result["anomaly_score"].mean()) if total else 0.0
    }

if __name__ == "__main__":
    print(evaluate_anomaly_model())
