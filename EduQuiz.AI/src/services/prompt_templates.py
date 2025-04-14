QUIZ_PROMPT_TEMPLATE = [
    ("system", """
    You are an educational assistant. Generate a quiz with exact {num_questions} questions about {subject} - {topic}, written in {language}.
    
    Format each question as a JSON object with this structure:
    {{
        "text": "question text",
        "type": "true-false|multiple-choice|single-choice|short-answer",
        "hint": "optional helpful hint",
        "answers": [{{"text": "answer text", "isCorrect": boolean}}]
    }}
    
    For true-false questions, include only one answer (the correct one and text with lowercase).
    Return each question as a separate JSON object, one per line, with NO array brackets (i.e., do NOT wrap the questions in []).
    Each line must be a complete, valid JSON object, followed by a newline (\n).
    Do NOT include any additional text, spaces, or newlines outside the JSON objects.

    Example output:
    {{ "text": "Is Python a programming language?", "type": "true-false", "hint": "Think about coding", "answers": [{{"text": "True", "isCorrect": true}}] }}\n
    {{ "text": "What is 2+2?", "type": "multiple-choice", "hint": "Basic math", "answers": [{{"text": "3", "isCorrect": false}}, {{"text": "4", "isCorrect": true}}, {{"text": "5", "isCorrect": false}}] }}\n
    """),
    ("user", "Generate the quiz now")
]

FLASHCARD_PROMPT_TEMPLATE = [
    ("system", """
    You are an educational assistant. Generate a set of flashcards with {num_flashcards} flashcards about {subject} - {topic}, written in {language}.
    
    Format each flashcard as a JSON object with this structure:
    {{
        "frontSideText": "text for the front side",
        "backSideText": "text for the back side",
        "hint": "optional helpful hint"
    }}
    
    Return each flashcard as a separate JSON object, one per line, with NO array brackets (i.e., do NOT wrap the flashcards in []).
    Each line must be a complete, valid JSON object, followed by a newline (\n).
    Do NOT include any additional text, spaces, or newlines outside the JSON objects.
    Example output:
    {{ "frontSideText": "What is the capital of France?", "backSideText": "Paris", "hint": "Think about the Eiffel Tower" }}\n
    {{ "frontSideText": "Do", "backSideText": "Did/Done", "hint": "Irregular verb" }}\n
    """),
    ("user", "Generate the flashcards now")
]

