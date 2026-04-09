import logging
from dataclasses import dataclass

import httpx

from app.core.config import get_settings


logger = logging.getLogger(__name__)


@dataclass(slots=True)
class TelegramSendResult:
    success: bool
    error_code: int | None = None
    description: str | None = None


class TelegramBotSender:
    def __init__(self) -> None:
        settings = get_settings()
        self.token = settings.telegram_bot_token
        self.enabled = settings.telegram_notifications_enabled and bool(self.token)

    async def send_message(self, telegram_id: int, text: str) -> TelegramSendResult:
        if not self.enabled:
            logger.info("Telegram notifications disabled, skipping send for user %s", telegram_id)
            return TelegramSendResult(success=False, description="notifications_disabled")

        url = f"https://api.telegram.org/bot{self.token}/sendMessage"
        payload = {
            "chat_id": telegram_id,
            "text": text,
            "disable_web_page_preview": True,
        }

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.post(url, json=payload)
        except httpx.TimeoutException:
            logger.warning("Telegram send timeout for user %s", telegram_id)
            return TelegramSendResult(success=False, description="timeout")
        except httpx.HTTPError as exc:
            logger.warning("Telegram send network error for user %s: %s", telegram_id, exc)
            return TelegramSendResult(success=False, description="network_error")

        if response.is_success:
            logger.info("Telegram notification sent to user %s", telegram_id)
            return TelegramSendResult(success=True)

        error_code = response.status_code
        try:
            payload = response.json()
            description = payload.get("description") or response.text
        except ValueError:
            description = response.text

        if error_code == 403:
            logger.warning("Telegram bot cannot message user %s yet: %s", telegram_id, description)
        else:
            logger.warning("Telegram send failed for user %s: %s %s", telegram_id, error_code, description)

        return TelegramSendResult(success=False, error_code=error_code, description=description)
