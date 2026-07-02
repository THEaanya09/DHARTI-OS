/** Mirrors the FastAPI backend schemas in backend/schemas.py */

export interface CropYieldInput {
  Crop: string;
  Season: string;
  State: string;
  Crop_Year: number;
  Area: number;
  Annual_Rainfall: number;
  Fertilizer: number;
  Pesticide: number;
}

export interface FloodInput {
  Land_Cover: string;
  Soil_Type: string;
  Rainfall: number;
  Temperature: number;
  Humidity: number;
  River_Discharge: number;
  Water_Level: number;
  Elevation: number;
  Population_Density: number;
  Infrastructure: number;
  Historical_Floods: number;
}

export interface CropRecommendationInput {
  N: number;
  P: number;
  K: number;
  temperature: number;
  humidity: number;
  ph: number;
  rainfall: number;
}

export interface PredictionRequest {
  latitude: number;
  longitude: number;
  crop_yield: CropYieldInput;
  flood: FloodInput;
  crop_recommendation: CropRecommendationInput;
}

export interface BackendWeather {
  temperature: number;
  humidity: number;
  pressure: number;
  weather: string;
  description: string;
  wind_speed: number;
}

export interface BackendRecommendation {
  priority: string;
  message: string;
}

export interface BackendDecision {
  risk_score: number;
  risk_level: string;
  priority: string;
  yield_status: string;
  recommended_crop: string;
  summary: string;
  recommendations: BackendRecommendation[];
}

export interface PredictionResponse {
  crop_yield_prediction: number;
  flood_prediction: number;
  crop_recommendation_prediction: string;
  weather: BackendWeather | null;
  decision: BackendDecision;
  ai_advisory: string | null;
}

export interface HealthResponse {
  status: string;
  models_loaded: boolean;
}
