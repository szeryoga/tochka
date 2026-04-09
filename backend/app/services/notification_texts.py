from datetime import date, datetime

from app.models.course import Course
from app.models.event import Event
from app.models.settings import AppSettings


def _format_event_datetime(value: datetime) -> str:
    return value.strftime("%d.%m.%Y, %H:%M")


def _format_course_date(value: date) -> str:
    return value.strftime("%d.%m.%Y")


def _format_phone(phone: str) -> str:
    digits = "".join(char for char in phone if char.isdigit())
    if len(digits) == 11:
        return f"{digits[0]}-{digits[1:4]}-{digits[4:7]}-{digits[7:]}"
    return phone.strip()


def _build_contacts_line(settings: AppSettings | None) -> str:
    if not settings:
        return "📍 Контакты школы уточняйте в миниаппе"

    phone = _format_phone(settings.contact_phone)
    parts = [settings.contact_subtitle.strip(), f"тел. {phone}"]
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
