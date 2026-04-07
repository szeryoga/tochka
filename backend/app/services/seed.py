from datetime import date, datetime, timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.course import Course
from app.models.event import Event
from app.models.settings import AppSettings


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
                    is_published=True,
                ),
            ]
        )

    await session.commit()
