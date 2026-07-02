"""
Inference service for the crop recommendation model.
"""

import logging
from typing import Any

import pandas as pd

from schemas import CropRecommendationInput

logger = logging.getLogger(__name__)


def predict_crop_recommendation(model: Any, payload: CropRecommendationInput) -> str:
    """
    Run inference using the crop recommendation model bundle.
    """

    frame = pd.DataFrame([
        {
            "N": payload.N,
            "P": payload.P,
            "K": payload.K,
            "temperature": payload.temperature,
            "humidity": payload.humidity,
            "ph": payload.ph,
            "rainfall": payload.rainfall,
        }
    ])

    # model is a bundle (dict), not a sklearn estimator
    estimator = model["model"]
    label_encoder = model["label_encoder"]

    prediction = estimator.predict(frame)

    crop_name = label_encoder.inverse_transform(prediction)[0]

    logger.debug("Crop recommendation prediction: %s", crop_name)

    return crop_name