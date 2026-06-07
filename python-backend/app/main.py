# app/main.py
from fastapi import FastAPI
from app.api.routes import router as predict_router
import uvicorn

app = FastAPI(title="Dog Breed AI Microservice", version="1.0")

# Nhúng các router vào
app.include_router(predict_router)

if __name__ == "__main__":
    # Nhớ trỏ đúng đường dẫn app.main:app
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=False)