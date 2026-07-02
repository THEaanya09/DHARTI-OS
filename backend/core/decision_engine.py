"""
Decision Engine for DHARTI OS.

Combines outputs from multiple ML models and converts them
into actionable, prioritized recommendations.

No ML inference happens here.
Only business rules.
"""

from typing import Any


def generate_decision(
    crop_yield: float,
    flood_prediction: int,
    recommended_crop: str,
    weather: dict | None = None,
) -> dict[str, Any]:
    """
    Combine ML predictions into a unified agricultural decision.
    """

    recommendations = []
    risk_score = 0

    # =====================================================
    # Flood Analysis
    # =====================================================

    if flood_prediction == 1:
        risk_score += 60

        recommendations.extend(
            [
                {
                    "priority": "HIGH",
                    "message": "High flood risk detected."
                },
                {
                    "priority": "HIGH",
                    "message": "Delay sowing until heavy rainfall subsides."
                },
                {
                    "priority": "MEDIUM",
                    "message": "Ensure drainage channels are clear."
                },
                {
                    "priority": "LOW",
                    "message": "Monitor official weather alerts."
                },
            ]
        )

    else:

        recommendations.append(
            {
                "priority": "LOW",
                "message": "No significant flood risk detected."
            }
        )

    # =====================================================
    # Crop Yield Analysis
    # =====================================================

    if crop_yield < 2:

        yield_status = "Low"

        risk_score += 25

        recommendations.extend(
            [
                {
                    "priority": "HIGH",
                    "message": "Expected crop yield is low."
                },
                {
                    "priority": "MEDIUM",
                    "message": "Improve soil fertility."
                },
                {
                    "priority": "MEDIUM",
                    "message": "Review irrigation practices."
                },
            ]
        )

    elif crop_yield < 4:

        yield_status = "Moderate"

        risk_score += 10

        recommendations.append(
            {
                "priority": "LOW",
                "message": "Expected crop yield is moderate."
            }
        )

    else:

        yield_status = "High"

        recommendations.append(
            {
                "priority": "LOW",
                "message": "Expected crop yield is good."
            }
        )

    # =====================================================
    # Crop Recommendation
    # =====================================================

    recommendations.append(
        {
            "priority": "LOW",
            "message": f"Recommended crop: {recommended_crop.title()}."
        }
    )

    # =====================================================
# Weather Analysis
# =====================================================

    if weather:

        temperature = weather.get("temperature", 0)
        humidity = weather.get("humidity", 0)
        condition = weather.get("weather", "")

        if temperature > 35:
            risk_score += 10

            recommendations.append(
                {
                    "priority": "MEDIUM",
                    "message": "High temperature detected. Ensure adequate irrigation."
                }
            )

        if humidity > 85:
            risk_score += 5

            recommendations.append(
                {
                    "priority": "LOW",
                    "message": "High humidity may increase disease risk. Monitor crops regularly."
                }
            )

        if condition.lower() in {"rain", "thunderstorm"}:
            risk_score += 15

            recommendations.append(
                {
                    "priority": "HIGH",
                    "message": "Rain is expected. Avoid unnecessary irrigation and monitor waterlogging."
                }
            )

    # =====================================================
    # Risk Level
    # =====================================================

    if risk_score <= 30:
        risk_level = "Low"

    elif risk_score <= 60:
        risk_level = "Moderate"

    elif risk_score <= 80:
        risk_level = "High"

    else:
        risk_level = "Critical"

    # =====================================================
    # Overall Priority
    # =====================================================

    if risk_level == "Critical":
        priority = "Immediate"

    elif risk_level == "High":
        priority = "High"

    elif risk_level == "Moderate":
        priority = "Medium"

    else:
        priority = "Low"

    # =====================================================
    # Summary
    # =====================================================

    summary = (
        f"Overall agricultural risk is {risk_level.lower()} "
        f"with an expected {yield_status.lower()} crop yield. "
        f"The recommended crop is {recommended_crop.title()}."
    )

    return {
        "risk_score": risk_score,
        "risk_level": risk_level,
        "priority": priority,
        "yield_status": yield_status,
        "recommended_crop": recommended_crop,
        "summary": summary,
        "recommendations": recommendations,
    }