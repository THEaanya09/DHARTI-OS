import type { UserProfile } from '@/contexts/auth-context';
import type { PredictionRequest } from '@/lib/api/types';
import {
  getCurrentSeason,
  MODEL_CROP_LABELS,
} from '@/lib/farm-fields';

const STATE_CENTROIDS: { name: string; lat: number; lng: number }[] = [
  { name: 'Andhra Pradesh', lat: 15.9129, lng: 79.74 },
  { name: 'Bihar', lat: 25.0961, lng: 85.3131 },
  { name: 'Delhi', lat: 28.7041, lng: 77.1025 },
  { name: 'Gujarat', lat: 22.2587, lng: 71.1924 },
  { name: 'Haryana', lat: 29.0588, lng: 76.0856 },
  { name: 'Karnataka', lat: 15.3173, lng: 75.7139 },
  { name: 'Madhya Pradesh', lat: 22.9734, lng: 78.6569 },
  { name: 'Maharashtra', lat: 19.7515, lng: 75.7139 },
  { name: 'Punjab', lat: 31.1471, lng: 75.3412 },
  { name: 'Rajasthan', lat: 27.0238, lng: 74.2179 },
  { name: 'Tamil Nadu', lat: 11.1271, lng: 78.6569 },
  { name: 'Telangana', lat: 18.1124, lng: 79.0193 },
  { name: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462 },
  { name: 'West Bengal', lat: 22.9868, lng: 87.855 },
];

function toModelCropLabel(crop: string | null | undefined): string {
  const key = (crop?.split(',')[0]?.trim() || 'wheat').toLowerCase();
  return MODEL_CROP_LABELS[key] || 'Wheat';
}

function inferState(lat: number, lng: number): string {
  let closest = STATE_CENTROIDS[0];
  let minDistance = Number.POSITIVE_INFINITY;

  for (const state of STATE_CENTROIDS) {
    const distance = (state.lat - lat) ** 2 + (state.lng - lng) ** 2;
    if (distance < minDistance) {
      minDistance = distance;
      closest = state;
    }
  }

  return closest.name;
}

function toHectares(area: number, unit: 'acres' | 'hectares' | null | undefined): number {
  if (unit === 'hectares') return Number(area.toFixed(2));
  return Number((area * 0.404686).toFixed(2));
}

function deriveFloodMetrics(profile: UserProfile) {
  const nearRiver = profile.near_river ?? false;
  const landCover = profile.land_cover || 'Agricultural';

  return {
    river_discharge: nearRiver ? 750 : 250,
    water_level: nearRiver ? 4.2 : 2.5,
    population_density: landCover === 'Urban' ? 1200 : landCover === 'Agricultural' ? 350 : 150,
    infrastructure: landCover === 'Urban' ? 0.85 : landCover === 'Agricultural' ? 0.55 : 0.35,
  };
}

export function buildPredictionRequest(profile: UserProfile): PredictionRequest {
  if (profile.latitude == null || profile.longitude == null) {
    throw new Error('Farm location is required. Complete onboarding to set coordinates.');
  }

  const area = profile.farm_area ?? 2.5;
  const floodMetrics = deriveFloodMetrics(profile);
  const annualRainfall = profile.annual_rainfall ?? 650;
  const expectedRainfall = profile.expected_rainfall_mm ?? annualRainfall;

  return {
    latitude: profile.latitude,
    longitude: profile.longitude,
    crop_yield: {
      Crop: toModelCropLabel(profile.crop),
      Season: profile.season || getCurrentSeason(),
      State: profile.state_name || inferState(profile.latitude, profile.longitude),
      Crop_Year: new Date().getFullYear(),
      Area: toHectares(area, profile.area_unit),
      Annual_Rainfall: annualRainfall,
      Fertilizer: profile.fertilizer_kg ?? 120,
      Pesticide: profile.pesticide_kg ?? 15,
    },
    flood: {
      Land_Cover: profile.land_cover || 'Agricultural',
      Soil_Type: profile.soil_type || 'Loam',
      Rainfall: expectedRainfall,
      Temperature: 28,
      Humidity: 75,
      River_Discharge: floodMetrics.river_discharge,
      Water_Level: floodMetrics.water_level,
      Elevation: profile.elevation_m ?? 250,
      Population_Density: floodMetrics.population_density,
      Infrastructure: floodMetrics.infrastructure,
      Historical_Floods: profile.historical_floods ?? 0,
    },
    crop_recommendation: {
      N: profile.soil_n ?? 90,
      P: profile.soil_p ?? 42,
      K: profile.soil_k ?? 43,
      temperature: 25,
      humidity: 80,
      ph: profile.soil_ph ?? 6.5,
      rainfall: expectedRainfall,
    },
  };
}
