from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any

import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


INDEX_DIR = Path("data/vector_store")
VECTORIZER_FILE = INDEX_DIR / "tfidf_vectorizer.joblib"
MATRIX_FILE = INDEX_DIR / "tfidf_matrix.joblib"
DOCUMENTS_FILE = INDEX_DIR / "documents.json"


def _normalise(text: str) -> str:
    text = text.replace("\x00", " ")
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def _chunk_text(
    text: str,
    chunk_size: int = 900,
    overlap: int = 150,
) -> list[str]:
    """Split text into overlapping word chunks."""
    words = _normalise(text).split()

    if not words:
        return []

    chunks = []
    step = max(1, chunk_size - overlap)

    for start in range(0, len(words), step):
        chunk = " ".join(words[start:start + chunk_size]).strip()

        if chunk:
            chunks.append(chunk)

        if start + chunk_size >= len(words):
            break

    return chunks


def _read_pdf(path: Path) -> list[dict[str, Any]]:
    from pypdf import PdfReader

    reader = PdfReader(str(path))
    documents = []

    for page_number, page in enumerate(reader.pages, start=1):
        text = page.extract_text() or ""
        text = _normalise(text)

        for chunk_number, chunk in enumerate(
            _chunk_text(text),
            start=1,
        ):
            documents.append(
                {
                    "text": chunk,
                    "source": path.name,
                    "path": str(path).replace("\\", "/"),
                    "page": page_number,
                    "chunk": chunk_number,
                }
            )

    return documents


def _read_markdown(path: Path) -> list[dict[str, Any]]:
    text = path.read_text(
        encoding="utf-8",
        errors="ignore",
    )

    return [
        {
            "text": chunk,
            "source": path.name,
            "path": str(path).replace("\\", "/"),
            "page": None,
            "chunk": number,
        }
        for number, chunk in enumerate(
            _chunk_text(text),
            start=1,
        )
    ]


def collect_documents(
    knowledge_base_dir: Path,
) -> list[dict[str, Any]]:
    """Read PDFs and Markdown/text files from the knowledge base."""

    documents = []

    for path in sorted(knowledge_base_dir.rglob("*")):

        if not path.is_file():
            continue

        suffix = path.suffix.lower()

        if suffix == ".pdf":
            documents.extend(_read_pdf(path))

        elif suffix in {".md", ".txt"}:
            documents.extend(_read_markdown(path))

    return documents


def build_index(
    knowledge_base_dir: Path,
    index_dir: Path = INDEX_DIR,
) -> dict[str, Any]:
    """Extract, chunk and index the knowledge base."""

    documents = collect_documents(knowledge_base_dir)

    if not documents:
        raise RuntimeError(
            f"No PDF/Markdown/text documents found in "
            f"{knowledge_base_dir}"
        )

    texts = [doc["text"] for doc in documents]

    vectorizer = TfidfVectorizer(
        lowercase=True,
        strip_accents="unicode",
        ngram_range=(1, 2),
        max_df=0.98,
        min_df=1,
        sublinear_tf=True,
    )

    matrix = vectorizer.fit_transform(texts)

    index_dir.mkdir(
        parents=True,
        exist_ok=True,
    )

    joblib.dump(
        vectorizer,
        index_dir / VECTORIZER_FILE.name,
    )

    joblib.dump(
        matrix,
        index_dir / MATRIX_FILE.name,
    )

    (
        index_dir / DOCUMENTS_FILE.name
    ).write_text(
        json.dumps(
            documents,
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )

    return {
        "documents": len(documents),
        "sources": sorted(
            {doc["source"] for doc in documents}
        ),
        "index_dir": str(index_dir),
    }


class KnowledgeRetriever:
    """Persistent TF-IDF knowledge-base retriever."""

    def __init__(
        self,
        index_dir: Path = INDEX_DIR,
    ):
        self.index_dir = index_dir
        self.vectorizer = None
        self.matrix = None
        self.documents = []

        self._load()

    def _load(self):
        vectorizer_path = (
            self.index_dir / VECTORIZER_FILE.name
        )

        matrix_path = (
            self.index_dir / MATRIX_FILE.name
        )

        documents_path = (
            self.index_dir / DOCUMENTS_FILE.name
        )

        if not (
            vectorizer_path.exists()
            and matrix_path.exists()
            and documents_path.exists()
        ):
            raise FileNotFoundError(
                "RAG index not found.\n"
                "Run:\n"
                "python -m src.rag.build_knowledge_base"
            )

        self.vectorizer = joblib.load(
            vectorizer_path
        )

        self.matrix = joblib.load(
            matrix_path
        )

        self.documents = json.loads(
            documents_path.read_text(
                encoding="utf-8"
            )
        )

    def search(
        self,
        query: str,
        top_k: int = 4,
    ) -> list[dict[str, Any]]:

        if not query or not query.strip():
            return []

        query_vector = self.vectorizer.transform(
            [query.strip()]
        )

        scores = cosine_similarity(
            query_vector,
            self.matrix,
        ).ravel()

        ranked = scores.argsort()[::-1]

        results = []
        seen = set()

        for index in ranked:

            score = float(scores[index])

            if score <= 0:
                continue

            document = dict(
                self.documents[index]
            )

            key = (
                document.get("source", ""),
                document.get("page"),
                document.get("text", "")[:100],
            )

            if key in seen:
                continue

            seen.add(key)

            document["score"] = round(
                score,
                4,
            )

            results.append(document)

            if len(results) >= top_k:
                break

        return results