from __future__ import annotations

from pathlib import Path
from typing import Any

from src.rag.vector_store import KnowledgeRetriever


INDEX_DIR = Path("data/vector_store")

_RETRIEVER = None


def _get_retriever():
    global _RETRIEVER

    if _RETRIEVER is None:
        _RETRIEVER = KnowledgeRetriever(INDEX_DIR)

    return _RETRIEVER


def retrieve_documents(
    query: str,
    top_k: int = 5,
) -> list[dict[str, Any]]:

    query = str(query or "").strip()

    if not query:
        return []

    # Expand the query so normal user questions
    # match terminology used in the WHO document.
    expanded_query = f"""
    {query}

    drinking water water quality
    water quality monitoring
    water safety
    unusual water quality measurements
    anomaly verification investigation
    turbidity pH dissolved oxygen
    contamination treatment changes
    sensor readings complaints
    WHO drinking-water guidance
    """

    try:
        results = _get_retriever().search(
            expanded_query,
            top_k=top_k,
        )

        return results or []

    except Exception as exc:
        print(
            f"RAG retrieval error: {exc}"
        )
        return []


def _format_source(
    document: dict[str, Any],
) -> str:

    source = document.get(
        "source",
        "Unknown source",
    )

    page = document.get("page")

    if page:
        return f"{source}, page {page}"

    return source


def retrieve_guidance(
    query: str,
    top_k: int = 5,
) -> list[str]:

    documents = retrieve_documents(
        query,
        top_k=top_k,
    )

    formatted = []

    for document in documents:

        source = _format_source(
            document
        )

        score = document.get(
            "score",
            0,
        )

        formatted.append(
            f"[Source: {source} | "
            f"relevance: {score:.4f}]\n"
            f"{document.get('text', '')}"
        )

    return formatted


if __name__ == "__main__":

    question = input(
        "Ask a water-quality question: "
    ).strip()

    results = retrieve_documents(
        question,
        top_k=5,
    )

    if not results:

        print(
            "\nNO DOCUMENTS WERE RETRIEVED."
        )

    else:

        print(
            f"\nRetrieved {len(results)} "
            "relevant passages:\n"
        )

        for item in results:

            source = item.get(
                "source",
                "Unknown source",
            )

            if item.get("page"):
                source += (
                    f", page {item['page']}"
                )

            print(
                f"--- {source} | "
                f"score {item.get('score', 0):.4f} ---"
            )

            print(
                item.get(
                    "text",
                    "",
                )
            )

            print()