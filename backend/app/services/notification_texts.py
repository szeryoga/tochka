from datetime import date, datetime

from app.models.course import Course
from app.models.event import Event
from app.models.settings import AppSettings


def _format_event_datetime(value: datetime) -> str:
    return value.strftime("%d.%m.%Y, %H:%M")


def _format_course_date(value: date) -> str:
    return value.strftime("%d.%m.%Y")


def _build_contacts_line(settings: AppSettings | None) -> str:
    if not settings:
        return "📍 Контакты школы уточняйте в миниаппе"

    parts = [settings.contact_subtitle.strip(), settings.contact_phone.strip()]
    return f"📍 {' | '.join(part for part in parts if part)}"


def build_event_registration_text(event: Event, settings: AppSettings | None = None) -> str:
    return (
        f"✅ Вы записаны на мероприятие «{event.title}»\n\n"
        f"📅 {_format_event_datetime(event.event_datetime)}\n"
        f"{_build_contacts_line(settings)}"
    )


def build_course_registration_text(course: Course, settings: AppSettings | None = None) -> str:
    return (
        f"✅ Вы записаны на курс «{course.title}»\n\n"
        f"📅 Старт: {_format_course_date(course.start_date)}\n"
        f"{_build_contacts_line(settings)}"
    )
