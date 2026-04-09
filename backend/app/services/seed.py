from datetime import date, datetime, timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.course import Course
from app.models.event import Event
from app.models.settings import AppSettings
from app.models.teacher import Teacher


async def seed_initial_data(session: AsyncSession) -> None:
    settings_exists = await session.scalar(select(AppSettings.id).limit(1))
    if not settings_exists:
        session.add(
            AppSettings(
                id=1,
                contact_phone="8 800 201 36 74",
                contact_subtitle="г. Санкт-Петербург",
                events_page_title="Мероприятия",
                events_page_subtitle="Вдохновение, актерство, импровизация. Выбери событие и стань частью момента!",
                courses_page_title="Курсы",
                courses_page_subtitle="Освой новые навыки, раскрой себя и выступай увереннее каждый день!",
                profile_page_title="Профиль",
                profile_page_subtitle="Здесь твоя информация и настройки. Управляй своим участием в Точке!",
                my_registrations_page_title="Мои записи",
                my_registrations_page_subtitle="Здесь все, на что ты записан. Не пропусти свой момент!",
            )
        )

    event_exists = await session.scalar(select(Event.id).limit(1))
    teacher_exists = await session.scalar(select(Teacher.id).limit(1))
    teachers: list[Teacher] = []
    if not teacher_exists:
        teachers = [
            Teacher(
                first_name="Анастасия",
                last_name="Захарова",
                short_bio="Импровизатор и ведущая интенсивов по свободе на сцене.",
                full_bio=(
                    "Анастасия работает на стыке импровизации, сценической уверенности и голосовых практик. "
                    "Помогает участникам раскрываться, быстрее реагировать и смелее взаимодействовать со сценой."
                ),
                photo_url="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
            ),
            Teacher(
                first_name="Илья",
                last_name="Романов",
                short_bio="Ведущий курсов по импровизации и публичному выступлению.",
                full_bio=(
                    "Илья помогает развивать сценическое внимание, ясную речь и навык держать контакт с аудиторией. "
                    "Ведет практические занятия, где теория сразу проверяется в действии."
                ),
                photo_url="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
            ),
            Teacher(
                first_name="Мария",
                last_name="Ковалева",
                short_bio="Преподаватель стендапа и авторских программ по самовыражению.",
                full_bio=(
                    "Мария работает с текстом, подачей и уверенностью в сценическом образе. "
                    "Помогает превращать личные наблюдения в материал и звучать убедительно."
                ),
                photo_url="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=600&q=80",
            ),
        ]
        session.add_all(teachers)
        await session.flush()
    else:
        teachers = list(
            (
                await session.execute(select(Teacher).order_by(Teacher.id.asc()))
            ).scalars().all()
        )

    if not event_exists:
        session.add_all(
            [
                Event(
                    title="Вечер импровизации",
                    short_description="Свободный формат, живые сцены и общение после.",
                    full_description=(
                        "Свободный формат, живые сцены и общение после. Прокачай креативность, "
                        "скорость реакции и чувство партнера в атмосфере живой игры."
                    ),
                    event_datetime=datetime(2026, 4, 29, 19, 0, tzinfo=timezone.utc),
                    image_url="https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80",
                    teacher_id=teachers[1].id if len(teachers) > 1 else None,
                    is_published=True,
                ),
                Event(
                    title="Интенсив с Настей Захаровой",
                    short_description="Рэп-фристайл, уверенность и сценическое мышление.",
                    full_description=(
                        "Практика свободы на сцене, работы с голосом и импровизационным мышлением. "
                        "Для тех, кто хочет расширить диапазон и перестать бояться внимания."
                    ),
                    event_datetime=datetime(2026, 4, 30, 15, 0, tzinfo=timezone.utc),
                    image_url="https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=1200&q=80",
                    teacher_id=teachers[0].id if teachers else None,
                    is_published=True,
                ),
                Event(
                    title="Открытый микрофон",
                    short_description="Твои мысли, твой голос, твоя сцена.",
                    full_description=(
                        "Теплый формат для тех, кто хочет проверить материал, выступить впервые "
                        "или просто прочувствовать сцену и зал."
                    ),
                    event_datetime=datetime(2026, 5, 5, 18, 30, tzinfo=timezone.utc),
                    image_url="https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=1200&q=80",
                    teacher_id=teachers[2].id if len(teachers) > 2 else None,
                    is_published=True,
                ),
            ]
        )

    course_exists = await session.scalar(select(Course.id).limit(1))
    if not course_exists:
        session.add_all(
            [
                Course(
                    title="Импровизация",
                    short_description="Учись мыслить и действовать здесь и сейчас.",
                    full_description=(
                        "Курс для тех, кто хочет свободнее чувствовать себя в общении, на сцене и "
                        "в незнакомых ситуациях. Работаем над реакцией, вниманием и партнерством."
                    ),
                    start_date=date(2026, 5, 12),
                    image_url="https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80",
                    teacher_id=teachers[1].id if len(teachers) > 1 else None,
                    is_published=True,
                ),
                Course(
                    title="Стендап",
                    short_description="Пиши шутки, работай с залом и выходи на сцену.",
                    full_description=(
                        "Разберем структуру материала, подачу, поиск собственной интонации и "
                        "как превращать наблюдения в рабочие шутки."
                    ),
                    start_date=date(2026, 5, 19),
                    image_url="https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80",
                    teacher_id=teachers[2].id if len(teachers) > 2 else None,
                    is_published=True,
                ),
                Course(
                    title="Ораторское искусство",
                    short_description="Говори ясно, убеждай и вдохновляй.",
                    full_description=(
                        "Курс про уверенную речь, работу с голосом, аргументацией и подачей. "
                        "Подходит для выступлений, переговоров и повседневного общения."
                    ),
                    start_date=date(2026, 6, 2),
                    image_url="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80",
                    teacher_id=teachers[1].id if len(teachers) > 1 else None,
                    is_published=True,
                ),
            ]
        )
    elif teachers:
        events = list((await session.execute(select(Event).order_by(Event.id.asc()))).scalars().all())
        courses = list((await session.execute(select(Course).order_by(Course.id.asc()))).scalars().all())

        if len(events) > 0 and events[0].teacher_id is None and len(teachers) > 1:
            events[0].teacher_id = teachers[1].id
        if len(events) > 1 and events[1].teacher_id is None:
            events[1].teacher_id = teachers[0].id
        if len(events) > 2 and events[2].teacher_id is None and len(teachers) > 2:
            events[2].teacher_id = teachers[2].id

        if len(courses) > 0 and courses[0].teacher_id is None and len(teachers) > 1:
            courses[0].teacher_id = teachers[1].id
        if len(courses) > 1 and courses[1].teacher_id is None and len(teachers) > 2:
            courses[1].teacher_id = teachers[2].id
        if len(courses) > 2 and courses[2].teacher_id is None and len(teachers) > 1:
            courses[2].teacher_id = teachers[1].id

    await session.commit()
