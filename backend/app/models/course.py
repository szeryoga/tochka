from datetime import date

from sqlalchemy import Boolean, Date, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.models.mixins import TimestampMixin


class Course(TimestampMixin, Base):
    __tablename__ = "courses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(160), nullable=False)
    short_description: Mapped[str] = mapped_column(String(255), nullable=False)
    full_description: Mapped[str] = mapped_column(Text, nullable=False)
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    image_url: Mapped[str] = mapped_column(String(500), nullable=False)
    is_published: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
