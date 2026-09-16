import json
import joblib
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler

from src.utils.config import (
    FEATURE_DATA_PATH, MODEL_DIR, MODEL_PATH, SCALER_PATH,
    METADATA_PATH, RANDOM_STATE, ANOMALY_CONTAMINATION
)
from src.utils.logger import get_logger

logger = get_logger(__name__)

def train_anomaly_model():
    df = pd.read_csv(FEATURE_DATA_PATH)

    scaler = StandardScaler()
    X = scaler.fit_transform(df)

    model = IsolationForest(
        n_estimators=200,
        contamination=ANOMALY_CONTAMINATION,
        random_state=RANDOM_STATE
    )
    model.fit(X)

    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, MODEL_PATH)
    joblib.dump(scaler, SCALER_PATH)

    metadata = {
        "model": "IsolationForest",
        "n_estimators": 200,
        "contamination": ANOMALY_CONTAMINATION,
        "random_state": RANDOM_STATE,
        "feature_columns": list(df.columns),
        "training_rows": len(df)
    }
    METADATA_PATH.write_text(json.dumps(metadata, indent=2))

    logger.info("Model saved to %s", MODEL_PATH)
    return model, scaler, metadata

if __name__ == "__main__":
    train_anomaly_model()
