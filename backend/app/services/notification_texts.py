from datetime import date, datetime

from app.models.course import Course
from app.models.event import Event


def _format_event_datetime(value: datetime) -> str:
    return value.strftime("%d.%m.%Y, %H:%M")


def _format_course_date(value: date) -> str:
    return value.strftime("%d.%m.%Y")


def build_event_registration_text(event: Event) -> str:
    return (
        f"✅ Вы записаны на мероприятие «{event.title}»\n\n"
        f"📅 {_format_event_datetime(event.event_datetime)}\n"
        "📍 Подробности смотрите в миниаппе"
    )


def build_course_registration_text(course: Course) -> str:
    return (
        f"✅ Вы записаны на курс «{course.title}»\n\n"
        f"📅 Старт: {_format_course_date(course.start_date)}\n"
        "📍 Подробности смотрите в миниаппе"
    )
