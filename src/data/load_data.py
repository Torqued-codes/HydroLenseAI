import pandas as pd
from src.utils.config import RAW_DATA_PATH, CLEAN_DATA_PATH
from src.utils.logger import get_logger

logger = get_logger(__name__)

def load_water_quality_data(path=None) -> pd.DataFrame:
    file_path = path or RAW_DATA_PATH
    logger.info("Loading data from %s", file_path)
    df = pd.read_csv(file_path)
    return df

def load_clean_data(path=None) -> pd.DataFrame:
    file_path = path or CLEAN_DATA_PATH
    logger.info("Loading cleaned data from %s", file_path)
    return pd.read_csv(file_path)

if __name__ == "__main__":
    df = load_water_quality_data()
    print(df.head())
    print(f"Rows: {len(df)}")
