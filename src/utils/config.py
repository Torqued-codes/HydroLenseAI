from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[2]
DATA_DIR = PROJECT_ROOT / "data"
RAW_DATA_PATH = DATA_DIR / "raw" / "water_quality_raw.csv"
CLEAN_DATA_PATH = DATA_DIR / "processed" / "water_quality_clean.csv"
FEATURE_DATA_PATH = DATA_DIR / "processed" / "water_quality_features.csv"
MODEL_DIR = PROJECT_ROOT / "models"
MODEL_PATH = MODEL_DIR / "anomaly_detector.pkl"
SCALER_PATH = MODEL_DIR / "scaler.pkl"
METADATA_PATH = MODEL_DIR / "model_metadata.json"
KNOWLEDGE_BASE_DIR = PROJECT_ROOT / "knowledge_base"
PROMPTS_DIR = PROJECT_ROOT / "prompts"

WATER_FEATURES = [
    "pH", "turbidity_ntu", "tds_mg_l", "temperature_c",
    "dissolved_oxygen_mg_l", "conductivity_us_cm"
]

RANDOM_STATE = 42
ANOMALY_CONTAMINATION = 0.05
