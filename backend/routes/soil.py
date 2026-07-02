"""Soil property endpoint backed by ISRIC SoilGrids."""

import logging

from fastapi import APIRouter, HTTPException, Query

from schemas import SoilResponse
from services.soil_service import get_soil_properties

logger = logging.getLogger(__name__)

router = APIRouter(tags=["Soil"])


@router.get("/soil", response_model=SoilResponse)
async def soil(
    latitude: float = Query(..., ge=-90, le=90, description="Farm latitude"),
    longitude: float = Query(..., ge=-180, le=180, description="Farm longitude"),
) -> SoilResponse:
    """
    Return topsoil properties for a location from ISRIC SoilGrids.

    Includes converted physical/chemical properties plus derived crop-model
    inputs (N, P, K estimates and soil texture class).
    """
    try:
        data = get_soil_properties(latitude=latitude, longitude=longitude)
    except Exception as exc:  # noqa: BLE001
        logger.exception("Soil lookup failed")
        raise HTTPException(
            status_code=502,
            detail=f"Soil lookup failed: {exc}",
        ) from exc

    if not data["available"]:
        raise HTTPException(
            status_code=404,
            detail=(
                "No SoilGrids data for this location. "
                "Try a nearby field coordinate or enter soil values manually."
            ),
        )

    return SoilResponse(**data)
