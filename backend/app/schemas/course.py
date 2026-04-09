from datetime import date, datetime

from pydantic import BaseModel, ConfigDict

from app.schemas.teacher import TeacherRead


class CourseBase(BaseModel):
    title: str
    short_description: str
    full_description: str
    start_date: date
    location: str
    available_slots: int
    image_url: str
    teacher_id: int | None = None
    is_published: bool = True


class CourseCreate(CourseBase):
    pass


class CourseUpdate(CourseBase):
    pass


class CourseRead(CourseBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    teacher: TeacherRead | None = None
    created_at: datetime
    updated_at: datetime
