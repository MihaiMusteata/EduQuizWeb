from pydantic import BaseModel
from typing import Literal, List
class Answer(BaseModel):
    text: str
    isCorrect: bool

class QuizQuestion(BaseModel):
    text: str
    type: Literal['true-false', 'multiple-choice', 'single-choice', 'short-answer']
    hint: str
    answers: List[Answer]

class QuizRequest(BaseModel):
    subject: str
    topic: str
    numQuestions: int
    language: str = "English"