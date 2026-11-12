
from contextlib import asynccontextmanager

from fastapi import FastAPI

from database import create_db_and_tables


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(
    title="Picture Diary API",
    description="絵日記アプリのバックエンドAPI",
    version="0.1.0",
    lifespan=lifespan,
)


@app.get("/")
def root():
    return {"message": "FastAPI is running"}


@app.get("/health")
def health():
    return {"status": "ok"}
