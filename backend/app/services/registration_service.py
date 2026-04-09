import logging

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.course import Course
from app.models.event import Event
from app.models.registration import Registration, RegistrationEntityType
from app.models.settings import AppSettings
from app.models.user import User
from app.repositories.content import get_item_by_id
from app.schemas.registration import RegistrationCreate, RegistrationResponse
from app.services.notification_texts import build_course_registration_text, build_event_registration_text
from app.services.telegram_bot import TelegramBotSender


logger = logging.getLogger(__name__)


async def _upsert_user(session: AsyncSession, payload: RegistrationCreate) -> User:
    user = await session.scalar(select(User).where(User.telegram_id == payload.telegram_id))
    if not user:
        user = User(
            telegram_id=payload.telegram_id,
            username=payload.username,
            first_name=payload.first_name,
            last_name=payload.last_name,
            photo_url=payload.photo_url,
            notifications=True,
        )
        session.add(user)
        await session.flush()
        return user

    user.username = payload.username
    user.first_name = payload.first_name
    user.last_name = payload.last_name
    user.photo_url = payload.photo_url
    await session.flush()
    return user


async def create_registration_with_notification(
    session: AsyncSession,
    payload: RegistrationCreate,
) -> RegistrationResponse:
    model = Event if payload.entity_type == RegistrationEntityType.event else Course
    entity = await get_item_by_id(session, model, payload.entity_id)
    if not entity or not entity.is_published:
        from fastapi import HTTPException, status

        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Entity not found")

    user = await _upsert_user(session, payload)

    existing = await session.scalar(
        select(Registration).where(
            Registration.user_id == user.id,
            Registration.entity_type == payload.entity_type,
            Registration.entity_id == payload.entity_id,
        )
    )
    if existing:
        logger.info(
            "Registration already exists for telegram_id=%s entity_type=%s entity_id=%s",
            payload.telegram_id,
            payload.entity_type.value,
            payload.entity_id,
        )
        return RegistrationResponse(
            status="already_registered",
            registration_id=existing.id,
            notification_sent=None,
        )

    registration = Registration(
        user_id=user.id,
        entity_type=payload.entity_type,
        entity_id=payload.entity_id,
    )
    session.add(registration)
    await session.commit()
    await session.refresh(registration)

    logger.info(
        "Registration created id=%s telegram_id=%s entity_type=%s entity_id=%s",
        registration.id,
        payload.telegram_id,
        payload.entity_type.value,
        payload.entity_id,
    )

    if not user.notifications:
        logger.info("Notifications disabled for telegram_id=%s", payload.telegram_id)
        return RegistrationResponse(
            status="created",
            registration_id=registration.id,
            notification_sent=False,
            message="Запись сохранена. Уведомления отключены в профиле.",
        )

    app_settings = await session.scalar(select(AppSettings).limit(1))
    text = (
        build_event_registration_text(entity, app_settings)
        if payload.entity_type == RegistrationEntityType.event
        else build_course_registration_text(entity, app_settings)
    )
    sender = TelegramBotSender()
    send_result = await sender.send_message(payload.telegram_id, text)

    if send_result.success:
        return RegistrationResponse(
            status="created",
            registration_id=registration.id,
            notification_sent=True,
        )

    message = "Запись сохранена, но уведомление в Telegram не отправлено."
    if send_result.error_code == 403:
        message = (
            "Запись сохранена, но бот пока не может отправить уведомление. "
            "Откройте бота и нажмите Start."
        )

    return RegistrationResponse(
        status="created",
        registration_id=registration.id,
        notification_sent=False,
        notification_error_code=send_result.error_code,
        message=message,
    )
