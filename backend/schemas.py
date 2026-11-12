
from datetime import date, datetime

from sqlmodel import Field, SQLModel


class DiaryCreate(SQLModel):
    title: str = Field(min_length=1, max_length=200)
    content: str = Field(min_length=1)
    diary_date: date

    mood: str | None = Field(
        default=None,
        max_length=30
    )

    weather: str | None = Field(
        default=None,
        max_length=30
    )


class DiaryRead(DiaryCreate):
    id: int
    image_path: str | None = None
    created_at: datetime
    updated_at: datetime
