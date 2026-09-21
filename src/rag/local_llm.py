from __future__ import annotations

import os
import re
from typing import Any

import requests


OLLAMA_URL = os.getenv(
    "OLLAMA_URL",
    "http://127.0.0.1:11434/api/generate"
)

OLLAMA_MODEL = os.getenv(
    "OLLAMA_MODEL",
    "gemma2:2b"
)


SYSTEM_PROMPT = """
You are HydroLense AI, a concise water-quality
decision-support assistant.

Answer ONLY the user's question using the
retrieved knowledge.

Rules:
- Give a short answer: 2 to 4 sentences.
- Be direct and practical.
- Do not dump retrieved passages.
- Do not repeat the question.
- Do not invent facts or numerical limits.
- Prefer WHO guidance when it directly answers the question.
- An anomaly does not by itself prove contamination
  or that water is unsafe.
- Mention verification when relevant.
- End with a short source reference.
""".strip()


def _clean_text(text: str) -> str:
    text = str(text or "")
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def _source_label(item: dict[str, Any]) -> str:
    source = item.get(
        "source",
        "Knowledge base"
    )

    page = item.get("page")

    if page:
        return f"{source}, p. {page}"

    return str(source)


def _ollama_available() -> bool:
    try:
        response = requests.get(
            OLLAMA_URL.replace(
                "/api/generate",
                "/api/tags"
            ),
            timeout=2
        )

        return response.ok

    except requests.RequestException:
        return False


def _generate_with_ollama(
    question: str,
    context: list[dict[str, Any]],
) -> str | None:

    if not context:
        return None

    blocks = []

    for item in context:

        text = _clean_text(
            item.get("text", "")
        )

        if not text:
            continue

        blocks.append(
            f"SOURCE: {_source_label(item)}\n"
            f"TEXT: {text[:3500]}"
        )

    if not blocks:
        return None

    retrieved = "\n\n".join(blocks)

    prompt = f"""
Question:
{question}

Retrieved knowledge:
{retrieved}

Answer the question directly.

Requirements:
- 2 to 4 sentences maximum.
- Use the retrieved information.
- Prefer WHO information when relevant.
- Summarize instead of copying.
- Do not list entire passages.
- Do not invent information.
- Mention verification if appropriate.
- Include one short source reference.

Return ONLY the final answer.
""".strip()

    try:

        response = requests.post(
            OLLAMA_URL,
            json={
                "model": OLLAMA_MODEL,
                "system": SYSTEM_PROMPT,
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": 0.1,
                    "num_predict": 150,
                },
            },
            timeout=90,
        )

        response.raise_for_status()

        data = response.json()

        answer = str(
            data.get(
                "response",
                ""
            )
        ).strip()

        if answer:
            return answer

    except (
        requests.RequestException,
        ValueError,
    ):
        pass

    return None


def _fallback_answer(
    question: str,
    context: list[dict[str, Any]],
) -> str:

    if not context:
        return (
            "I couldn't find enough relevant information "
            "in the HydroLense knowledge base."
        )

    question_lower = question.lower()

    # Choose the most useful retrieved source.
    best = context[0]

    for item in context:

        source = str(
            item.get("source", "")
        ).lower()

        if "who" in source:
            best = item
            break

    text = _clean_text(
        best.get("text", "")
    )

    source = _source_label(best)

    # Question-specific concise answers.
    if (
        "unusual" in question_lower
        or "anomal" in question_lower
        or "abnormal" in question_lower
    ):

        return (
            "First verify the measurement and check "
            "the sensor or calibration status. Compare "
            "the result with historical readings and, "
            "if the unusual pattern persists, arrange "
            "appropriate verification or testing.\n\n"
            f"**Source:** {source}"
        )

    if "turbidity" in question_lower:

        return (
            "Turbidity should be monitored as part of "
            "water-quality assessment, including during "
            "operational monitoring and when investigating "
            "changes in water quality.\n\n"
            f"**Source:** {source}"
        )

    if (
        "safe" in question_lower
        or "unsafe" in question_lower
    ):

        return (
            "An ML anomaly does not by itself determine "
            "whether water is safe or unsafe. The reading "
            "should be verified using appropriate water-quality "
            "assessment or testing.\n\n"
            f"**Source:** {source}"
        )

    # Generic fallback: take the first useful sentences,
    # rather than dumping the whole retrieved document.
    sentences = re.split(
        r"(?<=[.!?])\s+",
        text
    )

    useful = []

    for sentence in sentences:

        sentence = sentence.strip()

        if len(sentence) < 40:
            continue

        useful.append(sentence)

        if len(useful) == 2:
            break

    if useful:

        answer = " ".join(useful)

        return (
            f"{answer}\n\n"
            f"**Source:** {source}"
        )

    return (
        "The retrieved guidance is relevant, but "
        "there is not enough readable information "
        "to provide a concise answer.\n\n"
        f"**Source:** {source}"
    )


def generate_answer(
    question: str,
    context: list[dict[str, Any]],
) -> str:

    question = str(
        question or ""
    ).strip()

    if not question:

        return (
            "Please enter a water-quality question."
        )

    if not context:

        return (
            "I couldn't find enough relevant information "
            "in the HydroLense knowledge base."
        )

    # Use the real local LLM when available.
    if _ollama_available():

        answer = _generate_with_ollama(
            question,
            context,
        )

        if answer:
            return answer

    # Concise retrieval-based fallback.
    return _fallback_answer(
        question,
        context,
    )






