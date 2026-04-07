from datetime import date, datetime

from pydantic import BaseModel, ConfigDict


class CourseBase(BaseModel):
    title: str
    short_description: str
    full_description: str
    start_date: date
    image_url: str
    is_published: bool = True


class CourseCreate(CourseBase):
    pass


class CourseUpdate(CourseBase):
    pass


class CourseRead(CourseBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime
