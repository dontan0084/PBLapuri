
from datetime import date, datetime, timezone

from sqlalchemy import Column, DateTime
from sqlmodel import Field, SQLModel

#現在時刻をUTCで返す関数
def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class Diary(SQLModel, table=True):
    __tablename__ = "diaries"

    #日記の識別ID
    id: int | None = Field(
        default=None,
        primary_key=True
    )

    #日記のタイトル名
    title: str = Field(max_length=200)

    #本文
    content: str

    #日記の日付
    diary_date: date = Field(index=True)

    #気分
    mood: str | None = Field(
        default=None,
        max_length=30
    )

    #天気
    weather: str | None = Field(
        default=None,
        max_length=30
    )

    #日記に添付した画像の保存場所(画像自体じゃない)
    image_path: str | None = Field(
        default=None,
        max_length=500
    )

    #日記作成の日時
    created_at: datetime = Field(
        default_factory=utc_now,
        sa_column=Column(
            DateTime(timezone=True),
            nullable=False
        )
    )

    #日記を更新した日時
    updated_at: datetime = Field(
        default_factory=utc_now,
        sa_column=Column(
            DateTime(timezone=True),
            nullable=False
        )
    )
