"""
Model loader for DHARTI OS.

Loads all trained ML models exactly once, at application startup, and
exposes a small in-memory registry for services/routes to use.

Models are NEVER loaded inside request-handling code paths — only at
startup via ModelRegistry.load_all(), called from app.py's lifespan.
"""

import logging
from typing import Any

import joblib

from core.config import MODEL_REGISTRY

logger = logging.getLogger(__name__)


class ModelLoadError(RuntimeError):
    """Raised when a required model is requested but was never loaded successfully."""


class ModelRegistry:
    """
    In-memory registry holding all loaded ML models.

    A single instance of this class is created at import time and
    populated once during the FastAPI lifespan startup phase, then
    attached to `app.state.model_registry` for use by routes/services.
    """

    def __init__(self) -> None:
        self._models: dict[str, Any] = {}
        self._load_errors: dict[str, str] = {}

    def load_all(self) -> None:
        """
        Load every model declared in core.config.MODEL_REGISTRY.

        A failure loading one model does not stop the others from loading
        (so /status can report partial health). Any route that actually
        needs a model must call `get()`, which raises a descriptive
        exception if that specific model isn't available.
        """
        for name, path in MODEL_REGISTRY.items():
            try:
                if not path.exists():
                    raise FileNotFoundError(
                        f"Model file not found for '{name}': {path}. "
                        f"Ensure the .pkl file has been placed in the models/ directory."
                    )
                logger.info("Loading model '%s' from %s", name, path)
                self._models[name] = joblib.load(path)
                logger.info("Successfully loaded model '%s'", name)
            except Exception as exc:  # noqa: BLE001 - intentionally broad; logged & tracked
                logger.error("Failed to load model '%s': %s", name, exc)
                self._load_errors[name] = str(exc)

    def get(self, name: str) -> Any:
        """
        Return a loaded model by its canonical name.

        Raises:
            ModelLoadError: if the model was never loaded successfully.
        """
        if name not in self._models:
            reason = self._load_errors.get(name, "model was not loaded")
            raise ModelLoadError(
                f"Model '{name}' is unavailable ({reason}). "
                f"Check that the corresponding .pkl file exists in models/."
            )
        return self._models[name]

    @property
    def all_loaded(self) -> bool:
        """True only if every model declared in MODEL_REGISTRY loaded successfully."""
        return len(self._models) == len(MODEL_REGISTRY) and not self._load_errors

    def status(self) -> dict[str, dict[str, Any]]:
        """Return a per-model loading status dict, used by GET /status."""
        return {
            name: {
                "loaded": name in self._models,
                "error": self._load_errors.get(name),
            }
            for name in MODEL_REGISTRY
        }


# Singleton instance shared across the application's lifespan.
model_registry = ModelRegistry()