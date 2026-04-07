from datetime import datetime

from sqlalchemy import DateTime, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class AppSettings(Base):
    __tablename__ = "settings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, default=1)
    contact_phone: Mapped[str] = mapped_column(String(64), default="8 800 201 36 74")
    contact_subtitle: Mapped[str] = mapped_column(String(128), default="г. Санкт-Петербург")
    events_page_title: Mapped[str] = mapped_column(String(120), default="Мероприятия")
    events_page_subtitle: Mapped[str] = mapped_column(
        String(255),
        default="Вдохновение, актерство, импровизация. Выбери событие и стань частью момента!",
    )
    courses_page_title: Mapped[str] = mapped_column(String(120), default="Курсы")
    courses_page_subtitle: Mapped[str] = mapped_column(
        String(255),
        default="Освой новые навыки, раскрой себя и выступай увереннее каждый день!",
    )
    profile_page_title: Mapped[str] = mapped_column(String(120), default="Профиль")
    profile_page_subtitle: Mapped[str] = mapped_column(
        String(255),
        default="Здесь твоя информация и настройки. Управляй своим участием в Точке!",
    )
    my_registrations_page_title: Mapped[str] = mapped_column(
        String(120), default="Мои записи"
    )
    my_registrations_page_subtitle: Mapped[str] = mapped_column(
        String(255),
        default="Здесь все, на что ты записан. Не пропусти свой момент!",
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
