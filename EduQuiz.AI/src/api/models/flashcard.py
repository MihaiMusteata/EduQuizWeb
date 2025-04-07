from pydantic import BaseModel
class Flashcard(BaseModel):
    frontSideText: str
    backSideText: str
    hint: str
    
class FlashcardRequest(BaseModel):
    subject: str
    topic: str
    numFlashcards: int
    language: str = "English"