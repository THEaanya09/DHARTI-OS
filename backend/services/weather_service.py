"""
Weather service for DHARTI OS.

Fetches current weather information from OpenWeatherMap
using latitude and longitude.
"""

import logging

import requests

from core.config import OPENWEATHER_API_KEY, OPENWEATHER_BASE_URL

logger = logging.getLogger(__name__)


def get_current_weather(latitude: float, longitude: float) -> dict | None:
    """
    Fetch current weather for the given coordinates.

    Returns
    -------
    dict
        Weather information.

    None
        If the API request fails.
    """

    if not OPENWEATHER_API_KEY:
        logger.error("OPENWEATHER_API_KEY is not configured.")
        return None

    url = f"{OPENWEATHER_BASE_URL}/weather"

    params = {
        "lat": latitude,
        "lon": longitude,
        "appid": OPENWEATHER_API_KEY,
        "units": "metric",
    }

    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()

        data = response.json()

        return {
            "temperature": data["main"]["temp"],
            "humidity": data["main"]["humidity"],
            "pressure": data["main"]["pressure"],
            "weather": data["weather"][0]["main"],
            "description": data["weather"][0]["description"],
            "wind_speed": data["wind"]["speed"],
        }

    except requests.RequestException:
        logger.exception("Failed to fetch weather data.")
        return None