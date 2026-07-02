"""
DHARTI OS — FastAPI application entrypoint.

One AI Platform for Climate-Resilient Villages.

Wires together model loading (via lifespan), health/status routes, and
the unified /predict route. All models are loaded exactly once at
startup and stored on `app.state.model_registry`.
"""

import logging
from contextlib import asynccontextmanager
from typing import AsyncIterator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.config import APP_NAME, APP_TAGLINE, APP_VERSION, configure_logging
from core.model_loader import model_registry
from routes import health, prediction, soil

configure_logging()
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """Load all ML models once at startup; nothing to clean up at shutdown."""
    logger.info("Starting %s — loading models...", APP_NAME)
    model_registry.load_all()
    app.state.model_registry = model_registry

    if model_registry.all_loaded:
        logger.info("All models loaded successfully.")
    else:
        logger.warning("Some models failed to load: %s", model_registry.status())

    yield

    logger.info("Shutting down %s.", APP_NAME)


app = FastAPI(
    title=APP_NAME,
    description=APP_TAGLINE,
    version=APP_VERSION,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(prediction.router)
app.include_router(soil.router)