from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api.analysis import router as analysis_router
from backend.api.chat import router as chat_router

app = FastAPI(title="AquaGuard AI API", version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True,
                   allow_methods=["*"], allow_headers=["*"])
app.include_router(analysis_router, prefix="/api")
app.include_router(chat_router, prefix="/api")

@app.get("/")
def root():
    return {"name": "AquaGuard AI", "status": "running"}

@app.get("/health")
def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
