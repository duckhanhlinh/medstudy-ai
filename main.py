
import os
import time

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai

app = FastAPI(title="MedStudy AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5500",
        "http://127.0.0.1:5500",
        "https://duckhanhlinh.github.io",
    ],
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key) if api_key else None


class ChatRequest(BaseModel):
    message: str


@app.get("/")
def home():
    return {"status": "MedStudy AI API is running"}


@app.post("/chat")
def chat(data: ChatRequest):
    if not client:
        raise HTTPException(
            status_code=500,
            detail="Chưa cấu hình GEMINI_API_KEY."
        )

    message = data.message.strip()
    if not message:
        raise HTTPException(
            status_code=400,
            detail="Vui lòng nhập câu hỏi."
        )

    prompt = (
        "Bạn là MedStudy AI, trợ lý học tập cho sinh viên Y khoa. "
        "Trả lời bằng tiếng Việt, rõ ràng, có cấu trúc. "
        "Không tự nhận đã đọc đề cương hoặc lịch thi nếu chưa được cung cấp. "
        "Nếu thiếu dữ liệu, hãy nói rõ.\n\n"
        f"Câu hỏi: {message}"
    )

    for attempt in range(3):
        try:
            response = client.models.generate_content(
                model=os.getenv("GEMINI_MODEL", "gemini-3.8-flash"),
                contents=prompt,
            )
            return {
                "reply": response.text or "AI chưa có câu trả lời."
            }

        except Exception as e:
            error = str(e)
            temporary_error = any(
                code in error
                for code in ("503", "429", "500", "502", "504")
            )

            if temporary_error and attempt < 2:
                time.sleep(2 * (attempt + 1))
                continue

            print("Gemini API error:", repr(e))
            raise HTTPException(
                status_code=502,
                detail=f"Gemini tạm thời không phản hồi: {error[:500]}"
            )
