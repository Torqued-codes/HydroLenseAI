from pathlib import Path
from src.utils.config import KNOWLEDGE_BASE_DIR

DEFAULT_GUIDANCE = """
AquaGuard AI uses trusted water-quality guidance as reference material for explaining
unusual observations. An anomaly is a statistical indication that a measurement
pattern differs from the model's learned baseline. It is not a certification that
water is safe or unsafe.

When an anomaly is detected:
1. Verify the measurement and sensor condition.
2. Compare with recent and historical observations.
3. Consider relevant water-quality guidance.
4. Escalate for appropriate field or laboratory testing when warranted.
5. Do not make public-health decisions from the ML score alone.
"""

def build_knowledge_base():
    target = KNOWLEDGE_BASE_DIR / "water_safety"
    target.mkdir(parents=True, exist_ok=True)
    path = target / "anomaly_response.md"
    if not path.exists():
        path.write_text(DEFAULT_GUIDANCE.strip() + "\n", encoding="utf-8")
    return path

if __name__ == "__main__":
    print(f"Knowledge base ready: {build_knowledge_base()}")
