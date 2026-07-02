"""
Gemini service for DHARTI OS.

Generates a farmer-friendly advisory based on
the outputs of the Decision Engine and current weather.

This module never performs ML inference or business logic.
It only converts structured decisions into natural language.
"""

import logging

from google import genai

from core.config import GEMINI_API_KEY, GEMINI_MODEL

logger = logging.getLogger(__name__)


def generate_ai_advisory(
    decision: dict,
    weather: dict | None = None,
) -> str | None:
    """
    Generate a farmer-friendly advisory using Gemini.

    Returns
    -------
    str
        Advisory text.

    None
        If Gemini is unavailable or request fails.
    """

    if not GEMINI_API_KEY:
        logger.error("GEMINI_API_KEY is not configured.")
        return None

    client = genai.Client(api_key=GEMINI_API_KEY)

    weather_section = ""

    if weather:
        weather_section = f"""
Current Weather

Temperature: {weather.get("temperature")} °C
Humidity: {weather.get("humidity")} %
Condition: {weather.get("weather")}
Description: {weather.get("description")}
Wind Speed: {weather.get("wind_speed")} m/s
"""

    prompt = f"""
You are an experienced agricultural advisor helping Indian farmers.

IMPORTANT RULES

- Use ONLY the information provided.
- Do NOT change predictions.
- Do NOT invent weather conditions.
- Do NOT invent diseases.
- Do NOT recommend pesticides by brand.
- Consider the current weather while generating advice.
- Mention weather only if it is relevant.
- Do NOT contradict the Decision Engine.
- Keep the response under 120 words.
- Write in simple English.

Decision Engine Output

Risk Score: {decision["risk_score"]}

Risk Level: {decision["risk_level"]}

Priority: {decision["priority"]}

Yield Status: {decision["yield_status"]}

Recommended Crop: {decision["recommended_crop"]}

Summary:

{decision["summary"]}

{weather_section}

Recommendations:

{chr(10).join("- " + r["message"] for r in decision["recommendations"])}

Generate a short, practical advisory for the farmer.
Generate a short advisory.

If current weather conditions are relevant to farming decisions, mention them naturally.

Always explain why the recommendation is being made.
"""

    try:
        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt,
        )

        return response.text

    except Exception:
        logger.exception("Gemini request failed")
        return None