from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from src.api.models.quiz import QuizRequest
from src.services.ai_service import stream_quiz

router = APIRouter()
@router.post("/generate")
async def generate_quiz_endpoint(request: QuizRequest):
    try:
        return StreamingResponse(
            stream_quiz(
                subject=request.subject,
                topic=request.topic,
                num_questions=request.numQuestions,
                language=request.language,
            ),
            media_type="application/x-ndjson",
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating quiz: {str(e)}")