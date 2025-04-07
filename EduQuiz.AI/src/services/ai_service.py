from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
import json
from typing import AsyncGenerator

from src.config.settings import GROQ_API_KEY, MODEL_NAME
from src.services.prompt_templates import QUIZ_PROMPT_TEMPLATE, FLASHCARD_PROMPT_TEMPLATE

llm = ChatGroq(
    api_key=GROQ_API_KEY,
    model=MODEL_NAME,
    temperature=0.7,
    max_tokens=4000,
    streaming=True,
)

quiz_prompt = ChatPromptTemplate.from_messages(QUIZ_PROMPT_TEMPLATE)
flashcard_prompt = ChatPromptTemplate.from_messages(FLASHCARD_PROMPT_TEMPLATE)

async def _stream_llm_json(prompt: str) -> AsyncGenerator[str, None]:
    buffer = ""
    try:
        async for chunk in llm.astream(prompt):
            buffer += chunk.content
            try:
                item = json.loads(buffer)
                buffer = ""
                yield json.dumps(item) + "\n"
            except json.JSONDecodeError:
                continue
    except Exception as e:
        yield json.dumps({"error": str(e)})

async def stream_quiz(subject: str, topic: str, num_questions: int, language: str) -> AsyncGenerator[str, None]:
    formatted_prompt = quiz_prompt.format(
        subject=subject,
        topic=topic,
        num_questions=num_questions,
        language=language
    )
    async for item in _stream_llm_json(formatted_prompt):
        yield item

async def stream_flashcard(subject: str, topic: str, num_flashcards: int, language: str) -> AsyncGenerator[str, None]:
    formatted_prompt = flashcard_prompt.format(
        subject=subject,
        topic=topic,
        num_flashcards=num_flashcards,
        language=language
    )
    async for item in _stream_llm_json(formatted_prompt):
        yield item