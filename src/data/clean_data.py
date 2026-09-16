import pandas as pd
from src.utils.config import RAW_DATA_PATH, CLEAN_DATA_PATH, WATER_FEATURES
from src.utils.logger import get_logger

logger = get_logger(__name__)

def clean_water_quality_data(df: pd.DataFrame) -> pd.DataFrame:
    data = df.copy()
    data.columns = [c.strip() for c in data.columns]

    if "timestamp" in data.columns:
        data["timestamp"] = pd.to_datetime(data["timestamp"], errors="coerce")

    for column in WATER_FEATURES:
        if column in data.columns:
            data[column] = pd.to_numeric(data[column], errors="coerce")

    before = len(data)
    data = data.drop_duplicates()
    data = data.dropna(subset=[c for c in WATER_FEATURES if c in data.columns])
    data = data.sort_values("timestamp").reset_index(drop=True) if "timestamp" in data.columns else data.reset_index(drop=True)

    logger.info("Cleaned %d rows; removed %d rows", len(data), before - len(data))
    return data

def save_clean_data(df: pd.DataFrame, path=CLEAN_DATA_PATH):
    path.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(path, index=False)
    logger.info("Saved cleaned data to %s", path)

if __name__ == "__main__":
    raw = pd.read_csv(RAW_DATA_PATH)
    clean = clean_water_quality_data(raw)
    save_clean_data(clean)
