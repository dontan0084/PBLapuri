
import os
from collections.abc import Generator

from sqlmodel import Session, SQLModel, create_engine

import models


DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL is None:
    raise RuntimeError(
        "DATABASE_URLが設定されていません"
    )


engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True
)


def create_db_and_tables() -> None:
    SQLModel.metadata.create_all(engine)


def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session
