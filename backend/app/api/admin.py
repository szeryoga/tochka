from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_session
from app.models.course import Course
from app.models.event import Event
from app.models.registration import Registration, RegistrationEntityType
from app.models.settings import AppSettings
from app.models.teacher import Teacher
from app.models.user import User
from app.repositories.content import get_item_by_id, list_items
from app.schemas.admin_registration import (
    AdminRegisteredUser,
    AdminRegistrationDetail,
    AdminRegistrationSummary,
)
from app.schemas.course import CourseCreate, CourseRead, CourseUpdate
from app.schemas.event import EventCreate, EventRead, EventUpdate
from app.schemas.settings import SettingsRead, SettingsUpdate
from app.schemas.teacher import TeacherCreate, TeacherRead, TeacherUpdate


router = APIRouter(prefix="/admin", tags=["admin"])


def _teacher_name(teacher: Teacher | None) -> str:
    if not teacher:
        return "Не назначен"
    return f"{teacher.first_name} {teacher.last_name}".strip()


def _user_full_name(user: User) -> str:
    full_name = " ".join(part for part in [user.first_name, user.last_name] if part)
    return full_name or user.username or f"Пользователь {user.telegram_id}"


async def _registration_counts(
    session: AsyncSession,
    entity_type: RegistrationEntityType,
) -> dict[int, int]:
    rows = (
        await session.execute(
            select(Registration.entity_id, func.count(Registration.id))
            .where(Registration.entity_type == entity_type)
            .group_by(Registration.entity_id)
        )
    ).all()
    return {entity_id: count for entity_id, count in rows}


async def _registration_summary(
    session: AsyncSession,
    model: type[Event] | type[Course],
    entity_type: RegistrationEntityType,
) -> list[AdminRegistrationSummary]:
    items = await list_items(session, model, published_only=False)
    counts = await _registration_counts(session, entity_type)
    summary: list[AdminRegistrationSummary] = []
    for item in items:
        participants_count = counts.get(item.id, 0)
        summary.append(
            AdminRegistrationSummary(
                id=item.id,
                title=item.title,
                presenter_name=_teacher_name(item.teacher),
                participants_count=participants_count,
                free_places=max(item.total_places - participants_count, 0),
                total_places=item.total_places,
            )
        )
    return summary


async def _registration_detail(
    session: AsyncSession,
    model: type[Event] | type[Course],
    entity_type: RegistrationEntityType,
    entity_id: int,
) -> AdminRegistrationDetail:
    item = await get_item_by_id(session, model, entity_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Entity not found")

    rows = (
        await session.execute(
            select(Registration, User)
            .join(User, Registration.user_id == User.id)
            .where(
                Registration.entity_type == entity_type,
                Registration.entity_id == entity_id,
            )
            .order_by(Registration.created_at.desc())
        )
    ).all()
    registrations = [
        AdminRegisteredUser(
            user_id=user.id,
            full_name=_user_full_name(user),
            telegram_username=user.username,
            registered_at=registration.created_at,
        )
        for registration, user in rows
    ]

    return AdminRegistrationDetail(
        id=item.id,
        title=item.title,
        presenter_name=_teacher_name(item.teacher),
        participants_count=len(registrations),
        free_places=max(item.total_places - len(registrations), 0),
        total_places=item.total_places,
        registrations=registrations,
    )


@router.get("/registrations/events", response_model=list[AdminRegistrationSummary])
async def admin_get_event_registrations_summary(
    session: AsyncSession = Depends(get_session),
) -> list[AdminRegistrationSummary]:
    return await _registration_summary(session, Event, RegistrationEntityType.event)


@router.get("/registrations/courses", response_model=list[AdminRegistrationSummary])
async def admin_get_course_registrations_summary(
    session: AsyncSession = Depends(get_session),
) -> list[AdminRegistrationSummary]:
    return await _registration_summary(session, Course, RegistrationEntityType.course)


@router.get("/registrations/events/{event_id}", response_model=AdminRegistrationDetail)
async def admin_get_event_registrations_detail(
    event_id: int,
    session: AsyncSession = Depends(get_session),
) -> AdminRegistrationDetail:
    return await _registration_detail(session, Event, RegistrationEntityType.event, event_id)


@router.get("/registrations/courses/{course_id}", response_model=AdminRegistrationDetail)
async def admin_get_course_registrations_detail(
    course_id: int,
    session: AsyncSession = Depends(get_session),
) -> AdminRegistrationDetail:
    return await _registration_detail(session, Course, RegistrationEntityType.course, course_id)


@router.get("/teachers", response_model=list[TeacherRead])
async def admin_get_teachers(session: AsyncSession = Depends(get_session)) -> list[Teacher]:
    result = await session.execute(select(Teacher).order_by(Teacher.last_name.asc(), Teacher.first_name.asc()))
    return list(result.scalars().all())


@router.post("/teachers", response_model=TeacherRead, status_code=status.HTTP_201_CREATED)
async def admin_create_teacher(payload: TeacherCreate, session: AsyncSession = Depends(get_session)) -> Teacher:
    teacher = Teacher(**payload.model_dump())
    session.add(teacher)
    await session.commit()
    await session.refresh(teacher)
    return teacher


@router.put("/teachers/{teacher_id}", response_model=TeacherRead)
async def admin_update_teacher(
    teacher_id: int,
    payload: TeacherUpdate,
    session: AsyncSession = Depends(get_session),
) -> Teacher:
    teacher = await session.get(Teacher, teacher_id)
    if not teacher:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Teacher not found")

    for field, value in payload.model_dump().items():
        setattr(teacher, field, value)
    await session.commit()
    await session.refresh(teacher)
    return teacher


@router.delete("/teachers/{teacher_id}", status_code=status.HTTP_204_NO_CONTENT)
async def admin_delete_teacher(teacher_id: int, session: AsyncSession = Depends(get_session)) -> Response:
    teacher = await session.get(Teacher, teacher_id)
    if not teacher:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Teacher not found")

    events = (await session.execute(select(Event).where(Event.teacher_id == teacher_id))).scalars().all()
    courses = (await session.execute(select(Course).where(Course.teacher_id == teacher_id))).scalars().all()
    for event in events:
        event.teacher_id = None
    for course in courses:
        course.teacher_id = None

    await session.delete(teacher)
    await session.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/events", response_model=list[EventRead])
async def admin_get_events(session: AsyncSession = Depends(get_session)) -> list[Event]:
    return await list_items(session, Event, published_only=False)


@router.post("/events", response_model=EventRead, status_code=status.HTTP_201_CREATED)
async def admin_create_event(
    payload: EventCreate,
    session: AsyncSession = Depends(get_session),
) -> Event:
    event = Event(**payload.model_dump())
    session.add(event)
    await session.commit()
    await session.refresh(event)
    return event


@router.put("/events/{event_id}", response_model=EventRead)
async def admin_update_event(
    event_id: int,
    payload: EventUpdate,
    session: AsyncSession = Depends(get_session),
) -> Event:
    event = await get_item_by_id(session, Event, event_id)
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")

    for field, value in payload.model_dump().items():
        setattr(event, field, value)
    await session.commit()
    await session.refresh(event)
    return event


@router.delete("/events/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
async def admin_delete_event(event_id: int, session: AsyncSession = Depends(get_session)) -> Response:
    event = await get_item_by_id(session, Event, event_id)
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
    await session.delete(event)
    await session.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/courses", response_model=list[CourseRead])
async def admin_get_courses(session: AsyncSession = Depends(get_session)) -> list[Course]:
    return await list_items(session, Course, published_only=False)


@router.post("/courses", response_model=CourseRead, status_code=status.HTTP_201_CREATED)
async def admin_create_course(
    payload: CourseCreate,
    session: AsyncSession = Depends(get_session),
) -> Course:
    course = Course(**payload.model_dump())
    session.add(course)
    await session.commit()
    await session.refresh(course)
    return course


@router.put("/courses/{course_id}", response_model=CourseRead)
async def admin_update_course(
    course_id: int,
    payload: CourseUpdate,
    session: AsyncSession = Depends(get_session),
) -> Course:
    course = await get_item_by_id(session, Course, course_id)
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")

    for field, value in payload.model_dump().items():
        setattr(course, field, value)
    await session.commit()
    await session.refresh(course)
    return course


@router.delete("/courses/{course_id}", status_code=status.HTTP_204_NO_CONTENT)
async def admin_delete_course(course_id: int, session: AsyncSession = Depends(get_session)) -> Response:
    course = await get_item_by_id(session, Course, course_id)
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")
    await session.delete(course)
    await session.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/settings", response_model=SettingsRead)
async def admin_get_settings(session: AsyncSession = Depends(get_session)) -> AppSettings:
    settings = await session.scalar(select(AppSettings).limit(1))
    if not settings:
        settings = AppSettings(id=1)
        session.add(settings)
        await session.commit()
        await session.refresh(settings)
    return settings


@router.put("/settings", response_model=SettingsRead)
async def admin_update_settings(
    payload: SettingsUpdate,
    session: AsyncSession = Depends(get_session),
) -> AppSettings:
    settings = await session.scalar(select(AppSettings).limit(1))
    if not settings:
        settings = AppSettings(id=1)
        session.add(settings)

    for field, value in payload.model_dump().items():
        setattr(settings, field, value)

    await session.commit()
    await session.refresh(settings)
    return settings
