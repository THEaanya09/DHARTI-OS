import { withSoilPresets, type FarmModelFields } from '@/lib/farm-fields';

export interface SoilPropertiesResponse {
  latitude: number;
  longitude: number;
  requested_latitude: number;
  requested_longitude: number;
  source: string;
  available: boolean;
  wrb_class: string | null;
  phh2o: number | null;
  nitrogen: number | null;
  sand: number | null;
  clay: number | null;
  silt: number | null;
  organic_carbon: number | null;
  cec: number | null;
  bulk_density: number | null;
  soil_organic_matter: number | null;
  soil_type: string | null;
  model_n: number | null;
  model_p: number | null;
  model_k: number | null;
}

export function mapSoilToFarmFields(
  soil: SoilPropertiesResponse,
): Partial<FarmModelFields> {
  return withSoilPresets({
    soil_ph: soil.phh2o ?? null,
    soil_n: soil.model_n ?? null,
    soil_p: soil.model_p ?? null,
    soil_k: soil.model_k ?? null,
    soil_type: soil.soil_type ?? null,
  });
}

export function presetSoilFields(): Partial<FarmModelFields> {
  return withSoilPresets({});
}
