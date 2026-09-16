import joblib
import pandas as pd

from src.utils.config import MODEL_PATH, SCALER_PATH
from src.data.feature_engineering import create_features

def load_model():
    return joblib.load(MODEL_PATH), joblib.load(SCALER_PATH)

def detect_anomalies(df: pd.DataFrame) -> pd.DataFrame:
    model, scaler = load_model()
    features = create_features(df)
    X = scaler.transform(features)

    result = df.loc[features.index].copy()
    result["anomaly_label"] = model.predict(X)
    result["anomaly"] = result["anomaly_label"].eq(-1)
    result["anomaly_score"] = -model.decision_function(X)

    return result

def analyze_single(values: dict) -> dict:
    row = pd.DataFrame([values])
    result = detect_anomalies(row).iloc[0]
    return {
        "anomaly": bool(result["anomaly"]),
        "label": "anomaly" if result["anomaly"] else "normal",
        "anomaly_score": float(result["anomaly_score"])
    }

if __name__ == "__main__":
    from src.utils.config import DATA_DIR
    demo = pd.read_csv(DATA_DIR / "sample" / "demo_input.csv")
    print(detect_anomalies(demo).to_string(index=False))
