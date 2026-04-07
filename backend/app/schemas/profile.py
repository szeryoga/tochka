from pydantic import BaseModel


class TelegramProfile(BaseModel):
    telegram_id: int
    username: str | None = None
    first_name: str
    last_name: str | None = None
    photo_url: str | None = None
