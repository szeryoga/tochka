from datetime import datetime

from pydantic import BaseModel, ConfigDict


class EventBase(BaseModel):
    title: str
    short_description: str
    full_description: str
    event_datetime: datetime
    image_url: str
    is_published: bool = True


class EventCreate(EventBase):
    pass


class EventUpdate(EventBase):
    pass


class EventRead(EventBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime
