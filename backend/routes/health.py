"""Health and status endpoints for DHARTI OS."""

from fastapi import APIRouter, Request

from schemas import HealthResponse, ModelStatusDetail, StatusResponse

router = APIRouter(tags=["Health"])


@router.get("/health", response_model=HealthResponse)
async def health(request: Request) -> HealthResponse:
    """Basic liveness check. Reports whether all ML models loaded successfully."""
    registry = request.app.state.model_registry
    return HealthResponse(status="healthy", models_loaded=registry.all_loaded)


@router.get("/status", response_model=StatusResponse)
async def status(request: Request) -> StatusResponse:
    """Detailed per-model loading status, useful for debugging startup issues."""
    registry = request.app.state.model_registry
    raw_status = registry.status()
    return StatusResponse(
        models={name: ModelStatusDetail(**detail) for name, detail in raw_status.items()},
        all_loaded=registry.all_loaded,
    )