from pathlib import Path
from src.utils.config import KNOWLEDGE_BASE_DIR

def load_guidance() -> str:
    texts = []
    for path in KNOWLEDGE_BASE_DIR.rglob("*.md"):
        try:
            texts.append(path.read_text(encoding="utf-8"))
        except OSError:
            pass
    return "\n\n".join(texts)

def retrieve_guidance(query: str, top_k: int = 3):
    text = load_guidance()
    if not text:
        return []

    terms = {word.lower() for word in query.split() if len(word) > 2}
    chunks = [c.strip() for c in text.split("\n\n") if c.strip()]

    scored = []
    for chunk in chunks:
        score = sum(term in chunk.lower() for term in terms)
        scored.append((score, chunk))

    scored.sort(key=lambda x: x[0], reverse=True)
    return [chunk for score, chunk in scored[:top_k]]

if __name__ == "__main__":
    for item in retrieve_guidance("anomaly water quality verification"):
        print(item, "\n")
