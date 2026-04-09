from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_session
from app.core.config import get_settings
from app.models.course import Course
from app.models.event import Event
from app.models.registration import Registration, RegistrationEntityType
from app.models.settings import AppSettings
from app.models.teacher import Teacher
from app.models.user import User
from app.repositories.content import get_item_by_id, list_items
from app.schemas.course import CourseRead
from app.schemas.event import EventRead
from app.schemas.profile import TelegramProfile, TelegramProfileUpsert
from app.schemas.registration import (
    RegistrationCreate,
    RegistrationDelete,
    RegistrationItem,
    RegistrationResponse,
    RegistrationsGrouped,
)
from app.schemas.settings import SettingsRead
from app.schemas.teacher import TeacherRead
from app.services.registration_service import create_registration_with_notification


router = APIRouter(tags=["public"])


@router.get("/settings/header", response_model=SettingsRead)
async def get_header_settings(session: AsyncSession = Depends(get_session)) -> AppSettings:
    result = await session.execute(select(AppSettings).limit(1))
    settings = result.scalar_one()
    return settings


@router.get("/events", response_model=list[EventRead])
async def get_events(session: AsyncSession = Depends(get_session)) -> list[Event]:
    return await list_items(session, Event, published_only=True)


@router.get("/events/{event_id}", response_model=EventRead)
async def get_event(event_id: int, session: AsyncSession = Depends(get_session)) -> Event:
    event = await get_item_by_id(session, Event, event_id)
    if not event or not event.is_published:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
    return event


@router.get("/courses", response_model=list[CourseRead])
async def get_courses(session: AsyncSession = Depends(get_session)) -> list[Course]:
    return await list_items(session, Course, published_only=True)


@router.get("/courses/{course_id}", response_model=CourseRead)
async def get_course(course_id: int, session: AsyncSession = Depends(get_session)) -> Course:
    course = await get_item_by_id(session, Course, course_id)
    if not course or not course.is_published:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")
    return course


@router.get("/teachers", response_model=list[TeacherRead])
async def get_teachers(session: AsyncSession = Depends(get_session)) -> list[Teacher]:
    result = await session.execute(select(Teacher).order_by(Teacher.last_name.asc(), Teacher.first_name.asc()))
    return list(result.scalars().all())


@router.get("/teachers/{teacher_id}", response_model=TeacherRead)
async def get_teacher(teacher_id: int, session: AsyncSession = Depends(get_session)) -> Teacher:
    teacher = await session.get(Teacher, teacher_id)
    if not teacher:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Teacher not found")
    return teacher


@router.get("/me/registrations", response_model=RegistrationsGrouped)
async def get_my_registrations(
    telegram_id: int = Query(...),
    session: AsyncSession = Depends(get_session),
) -> RegistrationsGrouped:
    user = await session.scalar(select(User).where(User.telegram_id == telegram_id))
    if not user:
        return RegistrationsGrouped(events=[], courses=[])

    registrations = (
        await session.execute(
            select(Registration).where(Registration.user_id == user.id).order_by(Registration.created_at.desc())
        )
    ).scalars().all()

    event_ids = [item.entity_id for item in registrations if item.entity_type == RegistrationEntityType.event]
    course_ids = [item.entity_id for item in registrations if item.entity_type == RegistrationEntityType.course]

    events_map = {}
    courses_map = {}
    if event_ids:
        events = (await session.execute(select(Event).where(Event.id.in_(event_ids)))).scalars().all()
        events_map = {item.id: item for item in events}
    if course_ids:
        courses = (await session.execute(select(Course).where(Course.id.in_(course_ids)))).scalars().all()
        courses_map = {item.id: item for item in courses}

    event_items: list[RegistrationItem] = []
    course_items: list[RegistrationItem] = []
    for item in registrations:
        if item.entity_type == RegistrationEntityType.event and item.entity_id in events_map:
            event = events_map[item.entity_id]
            event_items.append(
                RegistrationItem(
                    id=item.id,
                    entity_type=item.entity_type,
                    entity_id=item.entity_id,
                    title=event.title,
                    short_description=event.short_description,
                    date_label=event.event_datetime.strftime("%d.%m %H:%M"),
                    datetime_value=event.event_datetime,
                    created_at=item.created_at,
                )
            )
        if item.entity_type == RegistrationEntityType.course and item.entity_id in courses_map:
            course = courses_map[item.entity_id]
            course_items.append(
                RegistrationItem(
                    id=item.id,
                    entity_type=item.entity_type,
                    entity_id=item.entity_id,
                    title=course.title,
                    short_description=course.short_description,
                    date_label=course.start_date.strftime("%d.%m.%Y"),
                    datetime_value=course.start_date,
                    created_at=item.created_at,
                )
            )

    return RegistrationsGrouped(events=event_items, courses=course_items)


@router.post("/registrations", response_model=RegistrationResponse, status_code=status.HTTP_201_CREATED)
async def create_registration(
    payload: RegistrationCreate,
    session: AsyncSession = Depends(get_session),
) -> RegistrationResponse:
    return await create_registration_with_notification(session, payload)


@router.delete("/registrations", status_code=status.HTTP_204_NO_CONTENT)
async def delete_registration(
    payload: RegistrationDelete,
    session: AsyncSession = Depends(get_session),
) -> None:
    user = await session.scalar(select(User).where(User.telegram_id == payload.telegram_id))
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    registration = await session.scalar(
        select(Registration).where(
            Registration.user_id == user.id,
            Registration.entity_type == payload.entity_type,
            Registration.entity_id == payload.entity_id,
        )
    )
    if not registration:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Registration not found")

    model = Event if payload.entity_type == RegistrationEntityType.event else Course
    entity = await get_item_by_id(session, model, payload.entity_id)
    if entity:
        entity.available_slots += 1

    await session.delete(registration)
    await session.commit()


@router.put("/profile", response_model=TelegramProfile)
async def upsert_profile(
    payload: TelegramProfileUpsert,
    session: AsyncSession = Depends(get_session),
) -> TelegramProfile:
    user = await session.scalar(select(User).where(User.telegram_id == payload.telegram_id))
    if not user:
        user = User(
            telegram_id=payload.telegram_id,
            username=payload.username,
            first_name=payload.first_name,
            last_name=payload.last_name,
            photo_url=payload.photo_url,
            notifications=True if payload.notifications is None else payload.notifications,
        )
        session.add(user)
    else:
        user.username = payload.username
        user.first_name = payload.first_name
        user.last_name = payload.last_name
        user.photo_url = payload.photo_url
        if payload.notifications is not None:
            user.notifications = payload.notifications

    await session.commit()
    await session.refresh(user)
    return TelegramProfile.model_validate(user, from_attributes=True)


@router.get("/profile/telegram-dev", response_model=TelegramProfile)
async def get_dev_telegram_profile() -> TelegramProfile:
    settings = get_settings()
    return TelegramProfile(
        telegram_id=settings.dev_telegram_id,
        username=settings.dev_telegram_username,
        first_name=settings.dev_telegram_first_name,
        last_name=settings.dev_telegram_last_name,
        photo_url=settings.dev_telegram_photo_url,
        notifications=True,
    )
