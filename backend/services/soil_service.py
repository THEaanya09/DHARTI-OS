"""
Soil property service for DHARTI OS.

Fetches topsoil data from ISRIC SoilGrids (free, global) using latitude and
longitude, converts units, and derives crop-model inputs (N, P, K, soil type).
"""

from __future__ import annotations

import logging
from typing import Any

import requests

logger = logging.getLogger(__name__)

SOILGRIDS_BASE = "https://rest.isric.org/soilgrids/v2.0"
PROPERTIES = ("phh2o", "nitrogen", "clay", "sand", "silt", "soc", "cec", "bdod")
DEPTHS = ("0-5cm", "5-15cm", "15-30cm")
CHEMISTRY_DEPTHS = frozenset({"0-5cm", "5-15cm"})
TEXTURE_PROPERTIES = frozenset({"clay", "sand", "silt"})

# Small offsets (~5–20 km) to avoid urban/no-data pixels near city centroids.
COORD_OFFSETS: tuple[tuple[float, float], ...] = (
    (0.0, 0.0),
    (0.05, 0.0),
    (-0.05, 0.0),
    (0.0, 0.05),
    (0.0, -0.05),
)


def _build_query_params(latitude: float, longitude: float) -> list[tuple[str, str]]:
    params: list[tuple[str, str]] = [
        ("lat", str(latitude)),
        ("lon", str(longitude)),
        ("value", "mean"),
    ]
    for prop in PROPERTIES:
        params.append(("property", prop))
    for depth in DEPTHS:
        params.append(("depth", depth))
    return params


def _average_converted_values(layers: list[dict[str, Any]]) -> dict[str, float]:
    """Average non-null depth means per property, divided by d_factor."""
    result: dict[str, float] = {}

    for layer in layers:
        name = layer.get("name")
        if not name:
            continue

        d_factor = layer.get("unit_measure", {}).get("d_factor", 1) or 1
        raw_values = []
        for depth in layer.get("depths", []):
            label = depth.get("label")
            mean = depth.get("values", {}).get("mean")
            if mean is None:
                continue
            if name not in TEXTURE_PROPERTIES and label not in CHEMISTRY_DEPTHS:
                continue
            raw_values.append(mean)

        if raw_values:
            result[name] = sum(raw_values) / len(raw_values) / d_factor

    return result


def _fetch_properties(latitude: float, longitude: float) -> dict[str, float] | None:
    url = f"{SOILGRIDS_BASE}/properties/query"
    params = _build_query_params(latitude, longitude)

    try:
        response = requests.get(url, params=params, timeout=45)
        response.raise_for_status()
        data = response.json()
    except requests.RequestException:
        logger.exception(
            "SoilGrids properties request failed for lat=%s lon=%s",
            latitude,
            longitude,
        )
        return None

    layers = data.get("properties", {}).get("layers", [])
    converted = _average_converted_values(layers)
    return converted or None


def _fetch_wrb_class(latitude: float, longitude: float) -> str | None:
    url = f"{SOILGRIDS_BASE}/classification/query"
    params = {"lat": latitude, "lon": longitude}

    try:
        response = requests.get(url, params=params, timeout=30)
        response.raise_for_status()
        data = response.json()
        return data.get("wrb_class_name")
    except requests.RequestException:
        logger.warning(
            "SoilGrids classification request failed for lat=%s lon=%s",
            latitude,
            longitude,
        )
        return None


def _texture_to_soil_type(clay: float | None, sand: float | None, silt: float | None) -> str:
    clay_pct = clay or 0.0
    sand_pct = sand or 0.0
    silt_pct = silt or 0.0

    if clay_pct >= 40:
        return "Clay"
    if sand_pct >= 70:
        return "Sandy"
    if silt_pct >= 50:
        return "Silt"
    if clay_pct >= 25 and sand_pct <= 52:
        return "Clay"
    return "Loam"


def _estimate_model_n(nitrogen_gkg: float | None) -> int | None:
    if nitrogen_gkg is None:
        return None
    return int(max(5, min(140, round(nitrogen_gkg * 500))))


def _estimate_model_p(soc_gkg: float | None) -> int | None:
    if soc_gkg is None:
        return None
    return int(max(5, min(145, round(soc_gkg * 14 + 15))))


def _estimate_model_k(cec: float | None, clay_pct: float | None) -> int | None:
    if cec is None and clay_pct is None:
        return None
    cec_val = cec or 0.0
    clay_val = clay_pct or 0.0
    return int(max(5, min(205, round(cec_val * 5.5 + clay_val * 0.7))))


def get_soil_properties(latitude: float, longitude: float) -> dict[str, Any]:
    """
    Fetch and normalize soil properties for a farm location.

    Tries the exact coordinate first, then nearby offsets when SoilGrids returns
    null (common for dense urban centroids).
    """
    resolved_lat = latitude
    resolved_lon = longitude
    raw: dict[str, float] | None = None

    for d_lat, d_lon in COORD_OFFSETS:
        candidate = _fetch_properties(latitude + d_lat, longitude + d_lon)
        if candidate:
            raw = candidate
            resolved_lat = latitude + d_lat
            resolved_lon = longitude + d_lon
            break

    wrb_class = _fetch_wrb_class(resolved_lat, resolved_lon)

    phh2o = raw.get("phh2o") if raw else None
    nitrogen = raw.get("nitrogen") if raw else None
    clay = raw.get("clay") if raw else None
    sand = raw.get("sand") if raw else None
    silt = raw.get("silt") if raw else None
    organic_carbon = raw.get("soc") if raw else None
    cec = raw.get("cec") if raw else None
    bulk_density = raw.get("bdod") if raw else None

    soil_organic_matter = (
        round(organic_carbon * 1.724, 3) if organic_carbon is not None else None
    )

    soil_type = _texture_to_soil_type(clay, sand, silt) if raw else None
    model_n = _estimate_model_n(nitrogen)
    model_p = _estimate_model_p(organic_carbon)
    model_k = _estimate_model_k(cec, clay)

    def _round(value: float | None, digits: int = 2) -> float | None:
        return round(value, digits) if value is not None else None

    available = raw is not None

    return {
        "latitude": resolved_lat,
        "longitude": resolved_lon,
        "requested_latitude": latitude,
        "requested_longitude": longitude,
        "source": "ISRIC SoilGrids",
        "available": available,
        "wrb_class": wrb_class,
        "phh2o": _round(phh2o, 1),
        "nitrogen": _round(nitrogen, 3),
        "sand": _round(sand, 1),
        "clay": _round(clay, 1),
        "silt": _round(silt, 1),
        "organic_carbon": _round(organic_carbon, 2),
        "cec": _round(cec, 2),
        "bulk_density": _round(bulk_density, 2),
        "soil_organic_matter": _round(soil_organic_matter, 2),
        "soil_type": soil_type,
        "model_n": model_n,
        "model_p": model_p,
        "model_k": model_k,
    }
