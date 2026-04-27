"""FastAPI application entrypoint."""
from __future__ import annotations

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, engine
from app.routers import admin, agent, auth, lots, reservations


logger = logging.getLogger("ifrane-parking")
logging.basicConfig(level=logging.INFO)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables on startup if they don't already exist.
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables ensured.")
    except Exception as exc:  # pragma: no cover
        logger.exception("Failed to create tables: %s", exc)
    yield


app = FastAPI(
    title="Ifrane Smart Parking API",
    version="1.0.0",
    description=(
        "Backend for the Ifrane Smart Parking system. "
        "Handles users, agents, admins, parking lots, and reservations."
    ),
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["health"])
def root() -> dict[str, str]:
    return {"status": "ok", "service": "ifrane-smart-parking"}


@app.get("/health", tags=["health"])
def health() -> dict[str, str]:
    return {"status": "healthy"}


app.include_router(auth.router)
app.include_router(lots.router)
app.include_router(reservations.router)
app.include_router(agent.router)
app.include_router(admin.router)
