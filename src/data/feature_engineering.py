import pandas as pd
from src.utils.config import CLEAN_DATA_PATH, FEATURE_DATA_PATH, WATER_FEATURES
from src.utils.logger import get_logger

logger = get_logger(__name__)

def create_features(df: pd.DataFrame) -> pd.DataFrame:
    features = df[WATER_FEATURES].copy()

    features["tds_conductivity_ratio"] = (
        features["tds_mg_l"] /
        features["conductivity_us_cm"].replace(0, pd.NA)
    )
    features["oxygen_temp_ratio"] = (
        features["dissolved_oxygen_mg_l"] /
        features["temperature_c"].replace(0, pd.NA)
    )

    features = features.replace([float("inf"), float("-inf")], pd.NA).dropna()
    return features.reset_index(drop=True)

def save_features(features: pd.DataFrame, path=FEATURE_DATA_PATH):
    path.parent.mkdir(parents=True, exist_ok=True)
    features.to_csv(path, index=False)
    logger.info("Saved features to %s", path)

if __name__ == "__main__":
    clean = pd.read_csv(CLEAN_DATA_PATH)
    features = create_features(clean)
    save_features(features)
