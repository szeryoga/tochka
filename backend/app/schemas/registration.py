from datetime import date, datetime

from pydantic import BaseModel, ConfigDict

from app.models.registration import RegistrationEntityType


class RegistrationCreate(BaseModel):
    telegram_id: int
    username: str | None = None
    first_name: str
    last_name: str | None = None
    photo_url: str | None = None
    entity_type: RegistrationEntityType
    entity_id: int


class RegistrationResponse(BaseModel):
    status: str
    registration_id: int


class RegistrationDelete(BaseModel):
    telegram_id: int
    entity_type: RegistrationEntityType
    entity_id: int


class RegistrationItem(BaseModel):
    model_config = ConfigDict(from_attributes=False)

    id: int
    entity_type: RegistrationEntityType
    entity_id: int
    title: str
    short_description: str
    date_label: str
    datetime_value: datetime | date
    created_at: datetime


class RegistrationsGrouped(BaseModel):
    events: list[RegistrationItem]
    courses: list[RegistrationItem]
