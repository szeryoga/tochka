from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.api.admin import router as admin_router
from app.api.public import router as public_router
from app.core.config import get_settings
from app.db.base import Base
from app.db.session import AsyncSessionLocal, engine
from app.models import course, event, registration, settings, teacher, user  # noqa: F401
from app.services.seed import seed_initial_data


settings_obj = get_settings()


@asynccontextmanager
async def lifespan(_: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        await conn.execute(
            text(
                "ALTER TABLE users ADD COLUMN IF NOT EXISTS notifications BOOLEAN NOT NULL DEFAULT TRUE"
            )
        )
        await conn.execute(text("ALTER TABLE events ADD COLUMN IF NOT EXISTS teacher_id INTEGER"))
        await conn.execute(text("ALTER TABLE courses ADD COLUMN IF NOT EXISTS teacher_id INTEGER"))

    async with AsyncSessionLocal() as session:
        await seed_initial_data(session)

    yield

    await engine.dispose()


app = FastAPI(title=settings_obj.app_name, debug=settings_obj.debug, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings_obj.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(public_router, prefix=settings_obj.api_prefix)
app.include_router(admin_router, prefix=settings_obj.api_prefix)


@app.get("/health")
async def healthcheck() -> dict[str, str]:
    async with AsyncSessionLocal() as session:
        await session.execute(text("SELECT 1"))
    return {"status": "ok"}
