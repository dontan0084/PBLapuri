
from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select

from database import create_db_and_tables, get_session
from models import Diary
from schemas import DiaryCreate, DiaryRead


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


# フロントエンドとの通信を許可する
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "FastAPI is running"}


@app.get("/health")
def health():
    return {"status": "ok"}


# 日記を新規登録する
@app.post(
    "/diaries",
    response_model=DiaryRead,
    status_code=status.HTTP_201_CREATED,
)
def create_diary(
    diary: DiaryCreate,
    session: Session = Depends(get_session),
):
    db_diary = Diary.model_validate(diary)

    session.add(db_diary)
    session.commit()
    session.refresh(db_diary)

    return db_diary


# 日記一覧を取得する
@app.get(
    "/diaries",
    response_model=list[DiaryRead],
)
def get_diaries(
    session: Session = Depends(get_session),
):
    statement = select(Diary).order_by(
        Diary.diary_date.desc(),
        Diary.id.desc(),
    )

    diaries = session.exec(statement).all()

    return diaries
