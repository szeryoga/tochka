from typing import TypeVar

from sqlalchemy import Select, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.course import Course
from app.models.event import Event


ModelT = TypeVar("ModelT", Event, Course)


async def list_items(
    session: AsyncSession,
    model: type[ModelT],
    published_only: bool = False,
) -> list[ModelT]:
    stmt: Select[tuple[ModelT]] = select(model).options(selectinload(model.teacher))
    if published_only:
        stmt = stmt.where(model.is_published.is_(True))

    order_column = getattr(model, "event_datetime", None) or getattr(model, "start_date")
    stmt = stmt.order_by(order_column.asc())
    result = await session.execute(stmt)
    return list(result.scalars().all())


async def get_item_by_id(session: AsyncSession, model: type[ModelT], item_id: int) -> ModelT | None:
    result = await session.execute(select(model).options(selectinload(model.teacher)).where(model.id == item_id))
    return result.scalar_one_or_none()
