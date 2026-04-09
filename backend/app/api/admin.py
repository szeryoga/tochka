from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_session
from app.models.course import Course
from app.models.event import Event
from app.models.settings import AppSettings
from app.models.teacher import Teacher
from app.repositories.content import get_item_by_id, list_items
from app.schemas.course import CourseCreate, CourseRead, CourseUpdate
from app.schemas.event import EventCreate, EventRead, EventUpdate
from app.schemas.settings import SettingsRead, SettingsUpdate
from app.schemas.teacher import TeacherCreate, TeacherRead, TeacherUpdate


router = APIRouter(prefix="/admin", tags=["admin"])


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
