from fastapi import APIRouter
from pydantic import BaseModel, Field
from backend.services.rag_service import answer_question

router = APIRouter(prefix="/chat", tags=["RAG Chat"])

class ChatRequest(BaseModel):
    question: str = Field(..., min_length=2, max_length=2000)

@router.post("")
def chat(request: ChatRequest):
    return {
        "success": True,
        **answer_question(request.question),
        "disclaimer": "Use appropriate testing and official guidance for consequential decisions."
    }
