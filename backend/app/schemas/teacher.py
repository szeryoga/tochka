from datetime import datetime

from pydantic import BaseModel, ConfigDict, computed_field


class TeacherBase(BaseModel):
    first_name: str
    last_name: str
    short_bio: str
    full_bio: str
    photo_url: str


class TeacherCreate(TeacherBase):
    pass


class TeacherUpdate(TeacherBase):
    pass


class TeacherRead(TeacherBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime

    @computed_field
    @property
    def full_name(self) -> str:
        return f"{self.first_name} {self.last_name}"
