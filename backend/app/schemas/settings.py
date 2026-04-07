from datetime import datetime

from pydantic import BaseModel, ConfigDict


class SettingsBase(BaseModel):
    contact_phone: str
    contact_subtitle: str
    events_page_title: str
    events_page_subtitle: str
    courses_page_title: str
    courses_page_subtitle: str
    profile_page_title: str
    profile_page_subtitle: str
    my_registrations_page_title: str
    my_registrations_page_subtitle: str


class SettingsRead(SettingsBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    updated_at: datetime


class SettingsUpdate(SettingsBase):
    pass
