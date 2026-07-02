import type {
  WeatherData,
  ForecastDay,
  FloodIntelligence,
  YieldIntelligence,
  WaterIntelligence,
  SustainabilityScore,
  AIInsight,
  Prediction,
  TimelineEvent,
  ChartDataPoint,
  Farm,
  User,
} from '@/types';

// ─── User ───────────────────────────────────────────────────
export const mockUser: User = {
  id: 'usr_01',
  name: 'Rajesh Kumar',
  email: 'rajesh@example.com',
  locale: 'en',
  onboarded: true,
  created_at: '2025-06-01T00:00:00Z',
};

// ─── Farm ───────────────────────────────────────────────────
export const mockFarm: Farm = {
  id: 'farm_01',
  user_id: 'usr_01',
  crop: 'wheat',
  area: 12,
  area_unit: 'acres',
  location: { lat: 23.2599, lng: 77.4126, label: 'Near Bhopal, MP' },
  created_at: '2025-06-01T00:00:00Z',
};

// ─── Weather ────────────────────────────────────────────────
export const mockWeather: WeatherData = {
  temperature: 32,
  feels_like: 35,
  humidity: 72,
  wind_speed: 14,
  wind_direction: 'SW',
  condition: 'partly_cloudy',
  uv_index: 7,
  visibility: 10,
  pressure: 1008,
  updated_at: new Date().toISOString(),
};

export const mockForecast: ForecastDay[] = [
  { date: '2026-07-03', high: 34, low: 26, condition: 'partly_cloudy', precipitation_chance: 30, humidity: 68 },
  { date: '2026-07-04', high: 33, low: 25, condition: 'cloudy', precipitation_chance: 55, humidity: 74 },
  { date: '2026-07-05', high: 30, low: 24, condition: 'rain', precipitation_chance: 85, humidity: 88 },
  { date: '2026-07-06', high: 28, low: 23, condition: 'heavy_rain', precipitation_chance: 92, humidity: 92 },
  { date: '2026-07-07', high: 29, low: 24, condition: 'light_rain', precipitation_chance: 60, humidity: 80 },
  { date: '2026-07-08', high: 31, low: 25, condition: 'partly_cloudy', precipitation_chance: 25, humidity: 70 },
  { date: '2026-07-09', high: 33, low: 26, condition: 'clear', precipitation_chance: 10, humidity: 62 },
];

// ─── Flood ──────────────────────────────────────────────────
export const mockFlood: FloodIntelligence = {
  risk_level: 'moderate',
  river_level: 4.2,
  river_name: 'Narmada',
  distance_km: 8.5,
  last_updated: new Date().toISOString(),
  trend: 'rising',
};

// ─── Yield ──────────────────────────────────────────────────
export const mockYield: YieldIntelligence = {
  predicted_yield: 4.2,
  historical_avg: 3.8,
  unit: 'tonnes/acre',
  confidence: 87,
  factors: [
    { name: 'Soil Quality', impact: 'positive', value: 'Rich alluvial' },
    { name: 'Rainfall', impact: 'positive', value: '+12% above avg' },
    { name: 'Temperature', impact: 'negative', value: '+2°C above optimal' },
    { name: 'Pest Risk', impact: 'neutral', value: 'Low probability' },
  ],
};

// ─── Water ──────────────────────────────────────────────────
export const mockWater: WaterIntelligence = {
  soil_moisture: 68,
  irrigation_needed: false,
  next_irrigation: '2026-07-05T06:00:00Z',
  water_stress_index: 0.3,
  groundwater_level: 12.5,
};

// ─── Sustainability ─────────────────────────────────────────
export const mockSustainability: SustainabilityScore = {
  overall: 78,
  water_efficiency: 82,
  soil_health: 75,
  carbon_footprint: 71,
  biodiversity: 84,
  trend: 'improving',
};

// ─── AI Insights ────────────────────────────────────────────
export const mockInsights: AIInsight[] = [
  {
    id: 'ins_01',
    title: 'Heavy rainfall expected — delay irrigation',
    description:
      'Our models predict 85% chance of heavy rainfall in the next 48 hours. Delaying scheduled irrigation will save water and prevent root waterlogging.',
    priority: 'high',
    category: 'irrigation',
    action: 'Skip irrigation on July 4-5. Resume normal schedule after July 6.',
    confidence: 92,
    created_at: new Date().toISOString(),
    expires_at: '2026-07-06T00:00:00Z',
  },
  {
    id: 'ins_02',
    title: 'Optimal harvest window approaching',
    description:
      'Based on crop maturity indicators and the incoming weather window, July 9-11 presents the best harvest conditions with low moisture and stable temperatures.',
    priority: 'medium',
    category: 'harvest',
    action: 'Prepare harvesting equipment. Target July 9 morning for optimal conditions.',
    confidence: 85,
    created_at: new Date().toISOString(),
  },
  {
    id: 'ins_03',
    title: 'Soil nitrogen levels declining',
    description:
      'Satellite-derived vegetation indices suggest declining nitrogen availability. A targeted urea application of 40kg/acre can restore optimal levels.',
    priority: 'medium',
    category: 'soil',
    action: 'Apply urea at 40kg/acre after the rain event subsides (post July 6).',
    confidence: 78,
    created_at: new Date().toISOString(),
  },
];

// ─── Predictions ────────────────────────────────────────────
export const mockPredictions: Prediction[] = [
  {
    id: 'pred_01',
    farm_id: 'farm_01',
    type: 'weather',
    title: 'Monsoon Intensity Forecast',
    summary: 'Above-average monsoon intensity predicted for next 2 weeks. Moderate flood risk.',
    confidence: 89,
    risk_level: 'moderate',
    insights: [mockInsights[0]],
    created_at: '2026-07-01T10:00:00Z',
    accuracy: 94,
  },
  {
    id: 'pred_02',
    farm_id: 'farm_01',
    type: 'yield',
    title: 'Wheat Yield Projection Q3',
    summary: 'Yield projected at 4.2 tonnes/acre, 10.5% above 3-year historical average.',
    confidence: 87,
    risk_level: 'low',
    insights: [mockInsights[1]],
    created_at: '2026-06-28T14:00:00Z',
    accuracy: 91,
  },
  {
    id: 'pred_03',
    farm_id: 'farm_01',
    type: 'flood',
    title: 'Narmada River Level Forecast',
    summary: 'River level expected to peak at 5.8m by July 6. Warning threshold is 6.2m.',
    confidence: 82,
    risk_level: 'moderate',
    insights: [],
    created_at: '2026-06-25T08:00:00Z',
    accuracy: 88,
  },
  {
    id: 'pred_04',
    farm_id: 'farm_01',
    type: 'pest',
    title: 'Pest Risk Assessment',
    summary: 'Low pest risk for current crop cycle. Humid conditions post-rain may elevate aphid probability.',
    confidence: 76,
    risk_level: 'low',
    insights: [],
    created_at: '2026-06-22T16:00:00Z',
    accuracy: 85,
  },
  {
    id: 'pred_05',
    farm_id: 'farm_01',
    type: 'drought',
    title: 'Post-Monsoon Drought Risk',
    summary: 'Moderate drought risk for October-November window. Early water conservation recommended.',
    confidence: 71,
    risk_level: 'moderate',
    insights: [],
    created_at: '2026-06-18T12:00:00Z',
  },
];

// ─── Timeline ───────────────────────────────────────────────
export const mockTimeline: TimelineEvent[] = [
  {
    id: 'tl_01',
    date: '2026-07-02T08:00:00Z',
    title: 'High UV Alert',
    description: 'UV index exceeding 7. Consider shade nets for sensitive crops.',
    type: 'alert',
    severity: 'moderate',
  },
  {
    id: 'tl_02',
    date: '2026-07-01T14:00:00Z',
    title: 'AI Analysis Complete',
    description: 'Monsoon intensity forecast generated with 89% confidence.',
    type: 'prediction',
  },
  {
    id: 'tl_03',
    date: '2026-06-30T10:00:00Z',
    title: 'Irrigation Completed',
    description: 'Scheduled irrigation completed. 2,400L of water used.',
    type: 'action',
  },
  {
    id: 'tl_04',
    date: '2026-06-28T06:00:00Z',
    title: 'Crop Health Milestone',
    description: 'Wheat crop has entered the grain-filling stage. Estimated 3 weeks to harvest.',
    type: 'milestone',
  },
  {
    id: 'tl_05',
    date: '2026-06-25T18:00:00Z',
    title: 'Heavy Rainfall',
    description: '45mm rainfall recorded. Soil moisture levels restored to optimal range.',
    type: 'weather',
  },
];

// ─── Chart Data ─────────────────────────────────────────────
export const mockTemperatureChart: ChartDataPoint[] = [
  { date: '2026-06-26', value: 34 },
  { date: '2026-06-27', value: 33 },
  { date: '2026-06-28', value: 31 },
  { date: '2026-06-29', value: 30 },
  { date: '2026-06-30', value: 32 },
  { date: '2026-07-01', value: 33 },
  { date: '2026-07-02', value: 32 },
];

export const mockRainfallChart: ChartDataPoint[] = [
  { date: '2026-06-26', value: 0 },
  { date: '2026-06-27', value: 5 },
  { date: '2026-06-28', value: 45 },
  { date: '2026-06-29', value: 12 },
  { date: '2026-06-30', value: 0 },
  { date: '2026-07-01', value: 3 },
  { date: '2026-07-02', value: 8 },
];

export const mockSoilMoistureChart: ChartDataPoint[] = [
  { date: '2026-06-26', value: 52 },
  { date: '2026-06-27', value: 55 },
  { date: '2026-06-28', value: 78 },
  { date: '2026-06-29', value: 74 },
  { date: '2026-06-30', value: 71 },
  { date: '2026-07-01', value: 69 },
  { date: '2026-07-02', value: 68 },
];
