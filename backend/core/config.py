"""
Application configuration for DHARTI OS backend.

Centralizes paths, model filenames, app metadata, and logging
configuration using pathlib for cross-platform compatibility.
"""

import logging
import os
from pathlib import Path

from dotenv import load_dotenv

# ---------------------------------------------------------------------------
# Base paths
# ---------------------------------------------------------------------------
BASE_DIR: Path = Path(__file__).resolve().parent.parent
MODELS_DIR: Path = BASE_DIR / "models"

# ---------------------------------------------------------------------------
# Environment Variables
# ---------------------------------------------------------------------------

load_dotenv(BASE_DIR / ".env")

# ---------------------------------------------------------------------------
# Model file paths
# ---------------------------------------------------------------------------
CROP_YIELD_MODEL_PATH: Path = MODELS_DIR / "crop_yield_model.pkl"
FLOOD_MODEL_PATH: Path = MODELS_DIR / "flood_model.pkl"
CROP_RECOMMENDATION_MODEL_PATH: Path = MODELS_DIR / "crop_recommendation_model.pkl"

# Registry used by the model loader to load / validate all models generically.
# Keys here are the canonical model names used throughout the app
# (services, routes, /status response, etc).
MODEL_REGISTRY: dict[str, Path] = {
    "crop_yield": CROP_YIELD_MODEL_PATH,
    "flood": FLOOD_MODEL_PATH,
    "crop_recommendation": CROP_RECOMMENDATION_MODEL_PATH,
}

# ---------------------------------------------------------------------------
# Gemini Configuration
# ---------------------------------------------------------------------------

GEMINI_API_KEY: str | None = os.getenv("GEMINI_API_KEY")

GEMINI_MODEL: str = "gemini-2.5-flash"

# ---------------------------------------------------------------------------
# OpenWeather Configuration
# ---------------------------------------------------------------------------

OPENWEATHER_API_KEY: str | None = os.getenv("OPENWEATHER_API_KEY")

OPENWEATHER_BASE_URL: str = "https://api.openweathermap.org/data/2.5"

# ---------------------------------------------------------------------------
# App metadata
# ---------------------------------------------------------------------------
APP_NAME: str = "DHARTI OS"
APP_TAGLINE: str = "One AI Platform for Climate-Resilient Villages"
APP_VERSION: str = "1.0.0"

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
LOG_LEVEL: int = logging.INFO
LOG_FORMAT: str = "%(asctime)s | %(levelname)-8s | %(name)s | %(message)s"


def configure_logging() -> None:
    """Configure root logging for the application. Safe to call multiple times."""
    logging.basicConfig(level=LOG_LEVEL, format=LOG_FORMAT)