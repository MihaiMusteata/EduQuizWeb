from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.endpoints import quiz
from src.config.settings import FRONTEND_URLS

app = FastAPI()
origins = FRONTEND_URLS.split(",") if FRONTEND_URLS else []

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(quiz.router, prefix="/api/ai/quiz", tags=["Quiz"])

