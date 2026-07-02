"""
Inference service for the flood prediction model.

Strictly: receive validated input -> call pipeline.predict() -> return
prediction. The saved .pkl is a full sklearn Pipeline that already
includes preprocessing (e.g. OneHotEncoder for Land_Cover/Soil_Type),
so this service does NOT perform any manual encoding — it only builds
a single-row DataFrame using the exact training column names and lets
the pipeline handle the rest.
"""

import logging
from typing import Any

import pandas as pd

from schemas import FloodInput

logger = logging.getLogger(__name__)


def predict_flood(model: Any, payload: FloodInput) -> Any:
    """
    Run inference using the pre-trained flood pipeline.

    Args:
        model: the loaded flood_model.pkl pipeline (includes preprocessing).
        payload: validated FloodInput.

    Returns:
        The raw prediction value (a native Python scalar).
    """
    frame = pd.DataFrame(
        [
            {
                "Land_Cover": payload.Land_Cover,
                "Soil_Type": payload.Soil_Type,
                "Rainfall": payload.Rainfall,
                "Temperature": payload.Temperature,
                "Humidity": payload.Humidity,
                "River_Discharge": payload.River_Discharge,
                "Water_Level": payload.Water_Level,
                "Elevation": payload.Elevation,
                "Population_Density": payload.Population_Density,
                "Infrastructure": payload.Infrastructure,
                "Historical_Floods": payload.Historical_Floods,
            }
        ]
    )
    prediction = model.predict(frame)
    result = prediction[0]
    logger.debug("Flood prediction: %s", result)
    return result.item() if hasattr(result, "item") else result