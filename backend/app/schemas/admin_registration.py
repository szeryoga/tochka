from datetime import datetime

from pydantic import BaseModel


class AdminRegistrationSummary(BaseModel):
    id: int
    title: str
    presenter_name: str
    participants_count: int
    free_places: int
    total_places: int


class AdminRegisteredUser(BaseModel):
    user_id: int
    full_name: str
    telegram_username: str | None = None
    registered_at: datetime


class AdminRegistrationDetail(AdminRegistrationSummary):
    registrations: list[AdminRegisteredUser]
