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
LANGUAGE_MAP = {
    "en": "English",
    "hi": "Hindi",
    "mr": "Marathi",
    "ta": "Tamil",
    "te": "Telugu",
    "bn": "Bengali",
    "gu": "Gujarati",
    "kn": "Kannada",
    "ml": "Malayalam",
    "pa": "Punjabi",
    "or": "Odia",
    "as": "Assamese",
}


def generate_ai_advisory(
    decision: dict,
    weather: dict | None = None,
    language: str = "en",
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
    
    language_name = LANGUAGE_MAP.get(language, "English")

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

IMPORTANT LANGUAGE RULES

- The farmer's preferred language is {language_name}.
- Write the ENTIRE response only in {language_name}.
- Do NOT translate into English.
- Do NOT mix multiple languages.
- Keep agricultural terms simple and easy for farmers.
-If the preferred language is Hindi, Marathi, Tamil, etc., use native script (Devanagari, Marathi, Tamil, etc.) instead of English transliteration.
-and generate all the outcomes in the local language itself. like risk->'in the local language' and all.


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