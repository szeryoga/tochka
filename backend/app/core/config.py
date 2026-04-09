from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Tochka API"
    api_prefix: str = "/api"
    debug: bool = False

    postgres_db: str = Field(default="tochka")
    postgres_user: str = Field(default="tochka")
    postgres_password: str = Field(default="tochka")
    postgres_host: str = Field(default="postgres")
    postgres_port: int = Field(default=5432)

    backend_port: int = Field(default=8000)
    frontend_origin: str = Field(default="http://localhost")
    admin_origin: str = Field(default="http://localhost/admin")
    cors_origins: str = Field(default="http://localhost,http://127.0.0.1")

    dev_telegram_id: int = Field(default=777000123)
    dev_telegram_username: str = Field(default="tochka_guest")
    dev_telegram_first_name: str = Field(default="Гость")
    dev_telegram_last_name: str = Field(default="Точки")
    dev_telegram_photo_url: str = Field(
        default="https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=320&q=80"
    )
    telegram_bot_token: str = Field(default="")
    telegram_bot_username: str = Field(default="tochka_miniapp_bot")
    telegram_notifications_enabled: bool = Field(default=True)

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    @property
    def database_url(self) -> str:
        return (
            f"postgresql+asyncpg://{self.postgres_user}:{self.postgres_password}"
            f"@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
        )

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
