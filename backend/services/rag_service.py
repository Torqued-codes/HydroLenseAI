from __future__ import annotations

from src.rag.local_llm import generate_answer
from src.rag.retrieve_guidance import retrieve_documents


def get_guidance(
    query: str,
    top_k: int = 5,
):

    return retrieve_documents(
        query,
        top_k=top_k,
    )


def create_explanation(
    analysis: dict,
    query: str = "water quality anomaly verification",
):

    guidance = get_guidance(
        query,
        top_k=4,
    )

    if not guidance:

        return (
            "The observation was flagged as unusual "
            "relative to the model baseline. Relevant "
            "guidance could not be retrieved from the "
            "local knowledge base."
        )

    context = "\n\n".join(
        item.get("text", "")
        for item in guidance
    )

    anomaly = analysis.get(
        "anomaly"
    )

    score = analysis.get(
        "anomaly_score"
    )

    if anomaly:

        intro = (
            "The machine-learning model flagged "
            "this observation as unusual relative "
            "to its learned baseline."
        )

    else:

        intro = (
            "The machine-learning model did not "
            "flag this observation as unusual "
            "relative to its learned baseline."
        )

    score_text = ""

    if score is not None:

        score_text = (
            f" The anomaly score is "
            f"{float(score):.3f}."
        )

    return (
        f"{intro}{score_text}\n\n"
        "Relevant retrieved guidance:\n"
        f"{context}\n\n"
        "An ML anomaly is not, by itself, "
        "a determination that water is safe "
        "or unsafe. Use appropriate "
        "verification for consequential decisions."
    )


def answer_question(
    question: str,
):

    question = (
        question or ""
    ).strip()

    if not question:

        return {
            "answer": (
                "Please enter a "
                "water-quality question."
            ),
            "sources": [],
        }

    documents = get_guidance(
        question,
        top_k=5,
    )

    # IMPORTANT:
    # This lets us see whether retrieval is actually
    # finding WHO/knowledge-base content.
    print(
        f"\n[RAG] Question: {question}"
    )

    print(
        f"[RAG] Retrieved documents: "
        f"{len(documents)}"
    )

    for item in documents:

        print(
            "[RAG] Source:",
            item.get("source"),
            "| Page:",
            item.get("page"),
            "| Score:",
            item.get("score"),
        )

    answer = generate_answer(
        question,
        documents,
    )

    sources = []

    for item in documents:

        source_info = {
            "source": item.get(
                "source",
                "Unknown source",
            ),
            "page": item.get("page"),
            "score": item.get("score"),
        }

        sources.append(
            source_info
        )

    return {
        "answer": answer,
        "sources": sources,
    }
