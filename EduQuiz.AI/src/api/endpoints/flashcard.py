from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from src.api.models.flashcard import FlashcardRequest
from src.services.ai_service import stream_flashcard

router = APIRouter()

@router.post("/generate")
async def generate_flashcard_endpoint(request: FlashcardRequest):
    try:
        return StreamingResponse(
            stream_flashcard(
                subject=request.subject,
                topic=request.topic,
                num_flashcards=request.numFlashcards,
                language=request.language,
            ),
            media_type="application/x-ndjson",
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating flashcards: {str(e)}")