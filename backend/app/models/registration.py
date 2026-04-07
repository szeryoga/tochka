import enum
from datetime import datetime

from sqlalchemy import DateTime, Enum, ForeignKey, Integer, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class RegistrationEntityType(str, enum.Enum):
    event = "event"
    course = "course"


class Registration(Base):
    __tablename__ = "registrations"
    __table_args__ = (
        UniqueConstraint("user_id", "entity_type", "entity_id", name="uq_registration_unique"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    entity_type: Mapped[RegistrationEntityType] = mapped_column(
        Enum(RegistrationEntityType, name="registration_entity_type"), nullable=False
    )
    entity_id: Mapped[int] = mapped_column(Integer, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
