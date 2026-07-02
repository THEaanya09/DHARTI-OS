/** Options and defaults aligned with backend ML model training features. */

import type { UserProfile } from '@/contexts/auth-context';

export const SEASON_OPTIONS = [
  { value: 'Kharif', label: 'Kharif (Monsoon)' },
  { value: 'Rabi', label: 'Rabi (Winter)' },
  { value: 'Summer', label: 'Summer' },
  { value: 'Winter', label: 'Winter' },
  { value: 'Whole Year', label: 'Whole Year' },
  { value: 'Autumn', label: 'Autumn' },
] as const;

export const LAND_COVER_OPTIONS = [
  { value: 'Agricultural', label: 'Agricultural / Cropland' },
  { value: 'Forest', label: 'Forest' },
  { value: 'Urban', label: 'Urban / Built-up' },
  { value: 'Desert', label: 'Desert / Arid' },
  { value: 'Water Body', label: 'Near water body' },
] as const;

export const SOIL_TYPE_OPTIONS = [
  { value: 'Loam', label: 'Loam' },
  { value: 'Clay', label: 'Clay' },
  { value: 'Sandy', label: 'Sandy' },
  { value: 'Silt', label: 'Silt' },
  { value: 'Peat', label: 'Peat' },
] as const;

export const HISTORICAL_FLOODS_OPTIONS = [
  { value: 0, label: 'None in last 10 years' },
  { value: 1, label: 'Once' },
  { value: 2, label: '2–3 times' },
  { value: 4, label: '4–5 times' },
  { value: 6, label: 'More than 5 times' },
] as const;

/** Maps frontend crop keys to exact crop_yield model labels. */
export const MODEL_CROP_LABELS: Record<string, string> = {
  rice: 'Rice',
  wheat: 'Wheat',
  maize: 'Maize',
  cotton: 'Cotton(lint)',
  sugarcane: 'Sugarcane',
  soybean: 'Soyabean',
  groundnut: 'Groundnut',
  mustard: 'Rapeseed &Mustard',
  potato: 'Potato',
  onion: 'Onion',
  tomato: 'Other Cereals',
  millet: 'Small millets',
  pulses: 'Peas & beans (Pulses)',
  other: 'Other Cereals',
};

export interface FarmModelFields {
  state_name: string | null;
  season: string | null;
  annual_rainfall: number | null;
  fertilizer_kg: number | null;
  pesticide_kg: number | null;
  land_cover: string | null;
  soil_type: string | null;
  elevation_m: number | null;
  near_river: boolean | null;
  historical_floods: number | null;
  soil_n: number | null;
  soil_p: number | null;
  soil_k: number | null;
  soil_ph: number | null;
  expected_rainfall_mm: number | null;
  area_unit: 'acres' | 'hectares' | null;
}

/** Typical Indian cropland values when SoilGrids is unavailable. */
export const PRESET_SOIL_VALUES = {
  soil_n: 90,
  soil_p: 42,
  soil_k: 43,
  soil_ph: 6.5,
  soil_type: 'Loam',
} as const;

export const DEFAULT_FARM_MODEL_FIELDS: FarmModelFields = {
  state_name: null,
  season: null,
  annual_rainfall: null,
  fertilizer_kg: null,
  pesticide_kg: null,
  land_cover: 'Agricultural',
  soil_type: PRESET_SOIL_VALUES.soil_type,
  elevation_m: null,
  near_river: false,
  historical_floods: 0,
  soil_n: PRESET_SOIL_VALUES.soil_n,
  soil_p: PRESET_SOIL_VALUES.soil_p,
  soil_k: PRESET_SOIL_VALUES.soil_k,
  soil_ph: PRESET_SOIL_VALUES.soil_ph,
  expected_rainfall_mm: null,
  area_unit: 'acres',
};

/** Fill missing soil fields with typical cropland presets. */
export function withSoilPresets(
  fields: Partial<FarmModelFields>,
): Partial<FarmModelFields> {
  return {
    soil_n: fields.soil_n ?? PRESET_SOIL_VALUES.soil_n,
    soil_p: fields.soil_p ?? PRESET_SOIL_VALUES.soil_p,
    soil_k: fields.soil_k ?? PRESET_SOIL_VALUES.soil_k,
    soil_ph: fields.soil_ph ?? PRESET_SOIL_VALUES.soil_ph,
    soil_type: fields.soil_type ?? PRESET_SOIL_VALUES.soil_type,
  };
}

export function getCurrentSeason(): string {
  const month = new Date().getMonth() + 1;
  if (month >= 6 && month <= 9) return 'Kharif';
  if (month >= 10 || month <= 2) return 'Rabi';
  if (month >= 3 && month <= 5) return 'Summer';
  return 'Whole Year';
}

export function farmFieldsFromProfile(profile: Partial<UserProfile>): FarmModelFields {
  return {
    state_name: profile.state_name ?? null,
    season: profile.season ?? null,
    annual_rainfall: profile.annual_rainfall ?? null,
    fertilizer_kg: profile.fertilizer_kg ?? null,
    pesticide_kg: profile.pesticide_kg ?? null,
    land_cover: profile.land_cover ?? 'Agricultural',
    elevation_m: profile.elevation_m ?? null,
    near_river: profile.near_river ?? false,
    historical_floods: profile.historical_floods ?? 0,
    ...withSoilPresets({
      soil_n: profile.soil_n,
      soil_p: profile.soil_p,
      soil_k: profile.soil_k,
      soil_ph: profile.soil_ph,
      soil_type: profile.soil_type,
    }),
    expected_rainfall_mm: profile.expected_rainfall_mm ?? null,
    area_unit: profile.area_unit ?? 'acres',
  };
}
