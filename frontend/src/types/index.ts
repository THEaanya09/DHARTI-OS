/* ============================================================
   DHARTI AI — Type Definitions
   ============================================================ */

// ─── Localization ───────────────────────────────────────────
export type Locale =
  | 'en'   // English
  | 'hi'   // Hindi
  | 'bn'   // Bengali
  | 'te'   // Telugu
  | 'mr'   // Marathi
  | 'ta'   // Tamil
  | 'gu'   // Gujarati
  | 'ur'   // Urdu
  | 'kn'   // Kannada
  | 'or'   // Odia
  | 'ml'   // Malayalam
  | 'pa'   // Punjabi
  | 'as'   // Assamese
  | 'mai'  // Maithili
  | 'sa'   // Sanskrit
  | 'ne'   // Nepali
  | 'sd'   // Sindhi
  | 'ks'   // Kashmiri
  | 'doi'  // Dogri
  | 'kok'  // Konkani
  | 'mni'  // Manipuri
  | 'sat'  // Santali
  | 'bo';  // Bodo

export type Dictionary = typeof import('@/lib/i18n/dictionaries/en.json');

// ─── User & Farm ────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  locale: Locale;
  avatar_url?: string;
  onboarded: boolean;
  created_at: string;
}

export interface Farm {
  id: string;
  user_id: string;
  name?: string;
  crop: string;
  area: number;
  area_unit: 'acres' | 'hectares';
  location: GeoLocation;
  created_at: string;
}

export interface GeoLocation {
  lat: number;
  lng: number;
  label?: string;
}

export type CropType =
  | 'rice'
  | 'wheat'
  | 'maize'
  | 'cotton'
  | 'sugarcane'
  | 'soybean'
  | 'groundnut'
  | 'mustard'
  | 'potato'
  | 'onion'
  | 'tomato'
  | 'millet'
  | 'pulses'
  | 'other';

// ─── Weather ────────────────────────────────────────────────
export interface WeatherData {
  temperature: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  wind_direction: string;
  condition: WeatherCondition;
  uv_index: number;
  visibility: number;
  pressure: number;
  updated_at: string;
}

export type WeatherCondition =
  | 'clear'
  | 'partly_cloudy'
  | 'cloudy'
  | 'overcast'
  | 'light_rain'
  | 'rain'
  | 'heavy_rain'
  | 'thunderstorm'
  | 'fog'
  | 'haze'
  | 'snow';

export interface ForecastDay {
  date: string;
  high: number;
  low: number;
  condition: WeatherCondition;
  precipitation_chance: number;
  humidity: number;
}

// ─── Intelligence Cards ─────────────────────────────────────
export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';

export interface FloodIntelligence {
  risk_level: RiskLevel;
  river_level: number;
  river_name: string;
  distance_km: number;
  last_updated: string;
  trend: 'rising' | 'stable' | 'falling';
}

export interface YieldIntelligence {
  predicted_yield: number;
  historical_avg: number;
  unit: string;
  confidence: number;
  factors: YieldFactor[];
}

export interface YieldFactor {
  name: string;
  impact: 'positive' | 'negative' | 'neutral';
  value: string;
}

export interface WaterIntelligence {
  soil_moisture: number;
  irrigation_needed: boolean;
  next_irrigation: string;
  water_stress_index: number;
  groundwater_level: number;
}

export interface SustainabilityScore {
  overall: number;
  water_efficiency: number;
  soil_health: number;
  carbon_footprint: number;
  biodiversity: number;
  trend: 'improving' | 'stable' | 'declining';
}

// ─── AI & Predictions ───────────────────────────────────────
export type InsightPriority = 'critical' | 'high' | 'medium' | 'low';
export type InsightCategory =
  | 'irrigation'
  | 'pest'
  | 'weather'
  | 'harvest'
  | 'soil'
  | 'market'
  | 'general';

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  priority: InsightPriority;
  category: InsightCategory;
  action: string;
  confidence: number;
  created_at: string;
  expires_at?: string;
}

export interface Prediction {
  id: string;
  farm_id: string;
  type: PredictionType;
  title: string;
  summary: string;
  confidence: number;
  risk_level: RiskLevel;
  insights: AIInsight[];
  created_at: string;
  accuracy?: number;
}

export type PredictionType =
  | 'yield'
  | 'weather'
  | 'flood'
  | 'drought'
  | 'pest'
  | 'harvest_timing'
  | 'market';

// ─── Climate Timeline ───────────────────────────────────────
export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'weather' | 'prediction' | 'alert' | 'action' | 'milestone';
  severity?: RiskLevel;
}

// ─── Charts ─────────────────────────────────────────────────
export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface ChartSeries {
  name: string;
  data: ChartDataPoint[];
  color?: string;
}

// ─── Navigation ─────────────────────────────────────────────
export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  badge?: string;
  children?: NavItem[];
}

// ─── Onboarding ─────────────────────────────────────────────
export interface OnboardingData {
  name: string;
  locale: Locale;
  crop: string;
  area: number;
  area_unit: 'acres' | 'hectares';
  location: GeoLocation | null;
}

export type OnboardingStep = 1 | 2 | 3 | 4 | 5 | 6;
