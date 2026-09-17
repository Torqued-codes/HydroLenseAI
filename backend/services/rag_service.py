from src.rag.retrieve_guidance import retrieve_guidance
from src.rag.generate_explanation import generate_explanation

def get_guidance(query: str, top_k: int = 3):
    return retrieve_guidance(query, top_k=top_k)

def create_explanation(analysis: dict, query: str = "water quality anomaly verification"):
    return generate_explanation(analysis, get_guidance(query))

def answer_question(question: str):
    guidance = get_guidance(question, top_k=4)
    if guidance:
        answer = ("Based on the available AquaGuard guidance, verify unusual "
                  "measurements before consequential decisions.\n\n" +
                  "\n\n".join(guidance))
    else:
        answer = "No matching guidance was found in the local knowledge base."
    return {"answer": answer, "sources": guidance}
