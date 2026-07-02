"""
Inference service for the crop yield model.

Strictly: receive validated input -> call pipeline.predict() -> return
prediction. The saved .pkl is a full sklearn Pipeline that already
includes preprocessing (e.g. OneHotEncoder for Crop/Season/State), so
this service does NOT perform any manual encoding — it only builds a
single-row DataFrame using the exact training column names and lets
the pipeline handle the rest.
"""

import logging
from typing import Any

import pandas as pd

from schemas import CropYieldInput

logger = logging.getLogger(__name__)


def predict_crop_yield(model: Any, payload: CropYieldInput) -> Any:
    """
    Run inference using the pre-trained crop yield pipeline.

    Args:
        model: the loaded crop_yield_model.pkl pipeline (includes preprocessing).
        payload: validated CropYieldInput.

    Returns:
        The raw prediction value (a native Python scalar).
    """
    frame = pd.DataFrame(
        [
            {
                "Crop": payload.Crop,
                "Season": payload.Season,
                "State": payload.State,
                "Crop_Year": payload.Crop_Year,
                "Area": payload.Area,
                "Annual_Rainfall": payload.Annual_Rainfall,
                "Fertilizer": payload.Fertilizer,
                "Pesticide": payload.Pesticide,
            }
        ]
    )
    prediction = model.predict(frame)
    result = prediction[0]
    logger.debug("Crop yield prediction: %s", result)
    return result.item() if hasattr(result, "item") else result