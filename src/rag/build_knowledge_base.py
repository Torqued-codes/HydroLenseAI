from pathlib import Path

from src.rag.vector_store import build_index
from src.utils.config import KNOWLEDGE_BASE_DIR


DEFAULT_ANOMALY_GUIDANCE = """
# HydroLense AI Anomaly Response Guidance

An anomaly is a statistical indication that a measurement
pattern differs from the model's learned baseline.

It is not a certification that water is safe or unsafe.

When an anomaly is detected:

1. Verify the measurement and sensor condition.
2. Compare with recent and historical observations.
3. Review relevant water-quality guidance.
4. Check whether multiple parameters changed together.
5. Arrange appropriate field or laboratory verification when warranted.
6. Do not make public-health decisions from the ML score alone.
""".strip()


def build_knowledge_base():

    # ---------------------------------------------------------
    # 1. Check that the official WHO PDF exists
    # ---------------------------------------------------------

    pdf_path = (
        KNOWLEDGE_BASE_DIR
        / "water_quality_guidelines"
        / "WHO_guidelines.pdf"
    )

    if not pdf_path.exists():

        raise FileNotFoundError(
            "WHO_guidelines.pdf was not found at:\n"
            f"{pdf_path}\n\n"
            "Place the official WHO PDF at that exact location."
        )

    # ---------------------------------------------------------
    # 2. Make sure the local safety guidance exists BEFORE
    #    building the vector index.
    # ---------------------------------------------------------

    safety_dir = (
        KNOWLEDGE_BASE_DIR
        / "water_safety"
    )

    safety_dir.mkdir(
        parents=True,
        exist_ok=True,
    )

    anomaly_file = (
        safety_dir
        / "anomaly_response.md"
    )

    if not anomaly_file.exists():

        anomaly_file.write_text(
            DEFAULT_ANOMALY_GUIDANCE + "\n",
            encoding="utf-8",
        )

    # ---------------------------------------------------------
    # 3. Build / rebuild the search index.
    #
    # This now indexes:
    #
    # WHO_guidelines.pdf
    # guideline_summary.md
    # water_safety_guidance.md
    # anomaly_response.md
    #
    # ---------------------------------------------------------

    index_dir = Path("data/vector_store")

    result = build_index(
        KNOWLEDGE_BASE_DIR,
        index_dir,
    )

    return result


if __name__ == "__main__":

    result = build_knowledge_base()

    print(
        "\nRAG knowledge base built successfully."
    )

    print(
        f"Indexed chunks: {result['documents']}"
    )

    print("\nSources:")

    for source in result["sources"]:
        print(
            f"  - {source}"
        )

    print(
        f"\nIndex location: {result['index_dir']}"
    )






