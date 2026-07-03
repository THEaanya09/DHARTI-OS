"""
Prediction endpoint for DHARTI OS.

Runs all three pre-trained models (crop yield, flood, crop recommendation),
passes their outputs to the Decision Engine, generates an AI advisory,
and returns the complete response.
"""

import logging


from fastapi import APIRouter, HTTPException, Request
from services.weather_service import get_current_weather
from core.decision_engine import generate_decision
from core.model_loader import ModelLoadError
from schemas import PredictionRequest, PredictionResponse
from services.crop_recommendation_service import predict_crop_recommendation
from services.crop_yield_service import predict_crop_yield
from services.flood_service import predict_flood
from services.gemini_services import generate_ai_advisory

logger = logging.getLogger(__name__)

router = APIRouter(tags=["Prediction"])


@router.post("/predict", response_model=PredictionResponse)
async def predict(payload: PredictionRequest, request: Request) -> PredictionResponse:
    """
    Validate the incoming request, execute all ML models,
    pass predictions through the Decision Engine,
    generate an AI advisory, and return the final response.
    """

    registry = request.app.state.model_registry

    try:
        crop_yield_model = registry.get("crop_yield")
        flood_model = registry.get("flood")
        crop_recommendation_model = registry.get("crop_recommendation")

    except ModelLoadError as exc:
        logger.error(
            "Prediction aborted, a required model is unavailable: %s",
            exc,
        )
        raise HTTPException(
            status_code=503,
            detail=str(exc),
        ) from exc

    try:
        # -------------------------
        # Run ML models
        # -------------------------

        crop_yield_result = predict_crop_yield(
            crop_yield_model,
            payload.crop_yield,
        )

        flood_result = predict_flood(
            flood_model,
            payload.flood,
        )

        crop_recommendation_result = predict_crop_recommendation(
            crop_recommendation_model,
            payload.crop_recommendation,
        )
        
        weather = get_current_weather(
        latitude=payload.latitude,
        longitude=payload.longitude,
        )

        # -------------------------
        # Decision Engine
        # -------------------------

        decision = generate_decision(
        crop_yield=crop_yield_result,
        flood_prediction=flood_result,
        recommended_crop=crop_recommendation_result,
        weather=weather,
        )

        

        # -------------------------
        # Gemini AI Advisory
        # -------------------------

        ai_advisory = generate_ai_advisory(
        decision=decision,
        weather=weather,
        language=payload.language,  
    )

    except Exception as exc:  # noqa: BLE001
        logger.exception("Inference failed")
        raise HTTPException(
            status_code=422,
            detail=f"Inference failed: {exc}",
        ) from exc

    return PredictionResponse(
    crop_yield_prediction=crop_yield_result,
    flood_prediction=flood_result,
    crop_recommendation_prediction=crop_recommendation_result,
    weather=weather,
    decision=decision,
    ai_advisory=ai_advisory,
)