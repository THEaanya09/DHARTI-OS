import type {
  AIInsight,
  ChartDataPoint,
  FloodIntelligence,
  InsightPriority,
  Prediction,
  RiskLevel,
  SustainabilityScore,
  TimelineEvent,
  WaterIntelligence,
  WeatherCondition,
  WeatherData,
  YieldIntelligence,
} from '@/types';
import type { BackendWeather, CropRecommendationInput, PredictionRequest, PredictionResponse } from '@/lib/api/types';

export interface SoilNutrient {
  name: string;
  percent: number;
  level: string;
}

export interface ChartOption {
  key: string;
  label: string;
  data: ChartDataPoint[];
  unit: string;
  color: string;
}

function normalizePriority(priority: string): InsightPriority {
  const key = priority.toLowerCase();
  if (key === 'critical' || key === 'high' || key === 'medium' || key === 'low') {
    return key;
  }
  return 'medium';
}

function normalizeRiskLevel(riskLevel: string): RiskLevel {
  const key = riskLevel.toLowerCase();
  if (key === 'low' || key === 'moderate' || key === 'high' || key === 'critical') {
    return key;
  }
  return 'moderate';
}

function mapWeatherCondition(weather: string): WeatherCondition {
  const value = weather.toLowerCase();
  if (value.includes('thunder')) return 'thunderstorm';
  if (value.includes('drizzle')) return 'light_rain';
  if (value.includes('rain')) return 'rain';
  if (value.includes('cloud')) return 'cloudy';
  if (value.includes('mist') || value.includes('fog') || value.includes('haze')) return 'fog';
  if (value.includes('snow')) return 'snow';
  if (value.includes('clear')) return 'clear';
  return 'partly_cloudy';
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function nutrientLevel(value: number, optimalMin: number, optimalMax: number): string {
  if (value < optimalMin) return 'Low';
  if (value > optimalMax) return 'High';
  return 'Optimal';
}

function nutrientPercent(value: number, max: number): number {
  return Math.min(100, Math.round((value / max) * 100));
}

export function mapInsights(response: PredictionResponse): AIInsight[] {
  const now = new Date().toISOString();
  const insights: AIInsight[] = [];

  if (response.ai_advisory) {
    insights.push({
      id: 'ai_advisory',
      title: 'AI Farmer Advisory',
      description: response.ai_advisory,
      priority: normalizePriority(response.decision.priority),
      category: 'general',
      action: response.decision.summary,
      confidence: Math.max(0, 100 - response.decision.risk_score),
      created_at: now,
    });
  }

  response.decision.recommendations.forEach((rec, index) => {
    insights.push({
      id: `rec_${index}`,
      title: `${capitalize(rec.priority.toLowerCase())} priority`,
      description: rec.message,
      priority: normalizePriority(rec.priority),
      category: index === 0 ? 'weather' : 'general',
      action: rec.message,
      confidence: Math.max(0, 100 - response.decision.risk_score),
      created_at: now,
    });
  });

  return insights;
}

export function mapWeather(response: PredictionResponse): WeatherData | null {
  if (!response.weather) return null;

  return {
    temperature: Math.round(response.weather.temperature),
    feels_like: Math.round(response.weather.temperature + 2),
    humidity: response.weather.humidity,
    wind_speed: Math.round(response.weather.wind_speed * 3.6),
    wind_direction: 'N',
    condition: mapWeatherCondition(response.weather.weather),
    uv_index: 5,
    visibility: 10,
    pressure: response.weather.pressure,
    updated_at: new Date().toISOString(),
  };
}

export function mapFlood(response: PredictionResponse, request: PredictionRequest): FloodIntelligence {
  const isFlood = response.flood_prediction === 1;

  return {
    risk_level: isFlood ? 'high' : normalizeRiskLevel(response.decision.risk_level),
    river_level: request.flood.Water_Level,
    river_name: 'Regional',
    distance_km: Number((request.flood.Elevation / 30).toFixed(1)),
    last_updated: new Date().toISOString(),
    trend: isFlood ? 'rising' : request.flood.Rainfall > 150 ? 'rising' : 'stable',
  };
}

export function mapYield(response: PredictionResponse): YieldIntelligence {
  const predicted = Number(response.crop_yield_prediction);
  const historical = predicted > 0 ? predicted * 0.9 : 0;

  return {
    predicted_yield: Number(predicted.toFixed(2)),
    historical_avg: Number(historical.toFixed(2)),
    unit: 'tonnes/ha',
    confidence: Math.max(0, 100 - response.decision.risk_score),
    factors: [
      {
        name: 'Yield status',
        impact: response.decision.yield_status === 'Low' ? 'negative' : 'positive',
        value: response.decision.yield_status,
      },
      {
        name: 'Recommended crop',
        impact: 'neutral',
        value: capitalize(response.crop_recommendation_prediction),
      },
      {
        name: 'Risk score',
        impact: response.decision.risk_score > 50 ? 'negative' : 'positive',
        value: `${response.decision.risk_score}/100`,
      },
    ],
  };
}

export function mapWater(response: PredictionResponse, request: PredictionRequest): WaterIntelligence {
  const humidity = response.weather?.humidity ?? request.crop_recommendation.humidity;
  const rainfall = request.crop_recommendation.rainfall;
  const soilMoisture = Math.min(100, Math.round((humidity * 0.6) + (rainfall / 10)));
  const stressIndex = soilMoisture < 40 ? 0.8 : soilMoisture < 60 ? 0.5 : 0.25;

  return {
    soil_moisture: soilMoisture,
    irrigation_needed: soilMoisture < 55,
    next_irrigation: new Date(Date.now() + (soilMoisture < 55 ? 86400000 : 259200000)).toISOString(),
    water_stress_index: stressIndex,
    groundwater_level: Number((12 + (100 - soilMoisture) / 10).toFixed(1)),
  };
}

export function mapSustainability(response: PredictionResponse): SustainabilityScore {
  const riskScore = response.decision.risk_score;
  const overall = Math.max(0, 100 - riskScore);
  const yieldHealthy = response.decision.yield_status !== 'Low';

  return {
    overall,
    water_efficiency: response.weather ? Math.min(100, response.weather.humidity + 10) : overall,
    soil_health: yieldHealthy ? Math.min(100, overall + 10) : Math.max(0, overall - 15),
    carbon_footprint: Math.max(0, overall - 5),
    biodiversity: Math.min(100, overall + 5),
    trend: riskScore > 60 ? 'declining' : riskScore > 30 ? 'stable' : 'improving',
  };
}

export function mapSoilHealth(soil: CropRecommendationInput): SoilNutrient[] {
  return [
    {
      name: 'Nitrogen (N)',
      percent: nutrientPercent(soil.N, 140),
      level: nutrientLevel(soil.N, 60, 120),
    },
    {
      name: 'Phosphorus (P)',
      percent: nutrientPercent(soil.P, 80),
      level: nutrientLevel(soil.P, 30, 60),
    },
    {
      name: 'Potassium (K)',
      percent: nutrientPercent(soil.K, 80),
      level: nutrientLevel(soil.K, 30, 60),
    },
    {
      name: 'pH Level',
      percent: nutrientPercent(soil.ph, 14),
      level: `${soil.ph} (${soil.ph >= 6 && soil.ph <= 7.5 ? 'Ideal' : 'Review'})`,
    },
  ];
}

export function mapTimeline(response: PredictionResponse): TimelineEvent[] {
  const now = new Date().toISOString();
  const events: TimelineEvent[] = [
    {
      id: 'decision_summary',
      date: now,
      title: 'Decision engine analysis',
      description: response.decision.summary,
      type: 'prediction',
      severity: normalizeRiskLevel(response.decision.risk_level),
    },
  ];

  if (response.weather) {
    events.push({
      id: 'weather_snapshot',
      date: now,
      title: `Weather: ${response.weather.weather}`,
      description: `${response.weather.description} · ${response.weather.temperature}°C · ${response.weather.humidity}% humidity`,
      type: 'weather',
    });
  }

  response.decision.recommendations.forEach((rec, index) => {
    events.push({
      id: `timeline_rec_${index}`,
      date: now,
      title: rec.message,
      description: `${rec.priority} priority recommendation from live analysis`,
      type: rec.priority === 'HIGH' ? 'alert' : 'action',
      severity: rec.priority === 'HIGH' ? 'high' : rec.priority === 'MEDIUM' ? 'moderate' : 'low',
    });
  });

  return events;
}

export function mapChartOptions(response: PredictionResponse, request: PredictionRequest): ChartOption[] {
  const today = new Date().toISOString().slice(0, 10);
  const temperature = response.weather?.temperature ?? request.crop_recommendation.temperature;
  const humidity = response.weather?.humidity ?? request.crop_recommendation.humidity;
  const rainfall = request.crop_recommendation.rainfall;

  return [
    {
      key: 'temperature',
      label: 'Temperature',
      data: [{ date: today, value: Number(temperature.toFixed(1)) }],
      unit: '°C',
      color: 'oklch(0.7 0.14 162)',
    },
    {
      key: 'rainfall',
      label: 'Rainfall',
      data: [{ date: today, value: rainfall }],
      unit: 'mm',
      color: 'oklch(0.65 0.14 240)',
    },
    {
      key: 'soilMoisture',
      label: 'Soil Moisture',
      data: [{ date: today, value: Math.min(100, Math.round(humidity * 0.85)) }],
      unit: '%',
      color: 'oklch(0.8 0.14 70)',
    },
  ];
}

export function mapPrediction(
  response: PredictionResponse,
  farmId: string,
): Prediction {
  const insights = mapInsights(response);

  return {
    id: `pred_${Date.now()}`,
    farm_id: farmId,
    type: response.flood_prediction === 1 ? 'flood' : 'yield',
    title: response.decision.summary,
    summary: response.ai_advisory || response.decision.summary,
    confidence: Math.max(0, 100 - response.decision.risk_score),
    risk_level: normalizeRiskLevel(response.decision.risk_level),
    insights,
    created_at: new Date().toISOString(),
    accuracy: Math.max(0, 100 - response.decision.risk_score),
  };
}

export function getLocationLabel(profile: {
  farm_name?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}): string {
  if (profile.farm_name) return profile.farm_name;
  if (profile.latitude != null && profile.longitude != null) {
    return `${profile.latitude.toFixed(2)}°, ${profile.longitude.toFixed(2)}°`;
  }
  return 'Your farm';
}

export function syncRequestWithWeather(
  request: PredictionRequest,
  weather: BackendWeather,
): PredictionRequest {
  return {
    ...request,
    flood: {
      ...request.flood,
      Temperature: weather.temperature,
      Humidity: weather.humidity,
      Rainfall: weather.weather.toLowerCase().includes('rain') ? 200 : 80,
    },
    crop_recommendation: {
      ...request.crop_recommendation,
      temperature: weather.temperature,
      humidity: weather.humidity,
    },
  };
}
