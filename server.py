from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn
from typing import Optional
from Karm import karma_ai

app = FastAPI()

class QuestionRequest(BaseModel):
    question: str

class AnswerResponse(BaseModel):
    answer: str

@app.get("/")
def read_root():
    return {"message": "Q&A Server is running!"}

@app.post("/api/question")
def answer_question(question_request: QuestionRequest):
    # Simple example responses - in a real app, this would be connected to a model or database
    if not question_request.question:
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    # Call karma_ai function
    answer = karma_ai(question_request.question)

    return {"answer": answer}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)