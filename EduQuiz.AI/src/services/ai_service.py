from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
import json
from typing import AsyncGenerator

from src.config.settings import GROQ_API_KEY, MODEL_NAME
from src.services.prompt_templates import QUIZ_PROMPT_TEMPLATE

llm = ChatGroq(
    api_key=GROQ_API_KEY,
    model=MODEL_NAME,
    temperature=0.7,
    max_tokens=4000,
    streaming=True,
)

quiz_prompt = ChatPromptTemplate.from_messages(QUIZ_PROMPT_TEMPLATE)

async def stream_quiz(subject: str, topic: str, num_questions: int, language: str) -> AsyncGenerator[str, None]:
    try:
        buffer = ""

        formatted_prompt = quiz_prompt.format(
            subject=subject,
            topic=topic,
            num_questions=num_questions,
            language=language
        )
        
        async for chunk in llm.astream(formatted_prompt):
            buffer += chunk.content
            try:
                question = json.loads(buffer)
                buffer = ""
                yield json.dumps(question) + "\n"
            except json.JSONDecodeError:
                continue
    except Exception as e:
        yield json.dumps({"error": str(e)})
