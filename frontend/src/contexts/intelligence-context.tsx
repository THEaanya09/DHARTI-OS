'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth-context';
import { buildPredictionRequest } from '@/lib/api/build-request';
import { fetchPrediction } from '@/lib/api/client';
import {
  getLocationLabel,
  mapChartOptions,
  mapFlood,
  mapInsights,
  mapPrediction,
  mapSoilHealth,
  mapSustainability,
  mapTimeline,
  mapWater,
  mapWeather,
  mapYield,
  syncRequestWithWeather,
  type ChartOption,
  type SoilNutrient,
} from '@/lib/api/mappers';
import type { PredictionRequest, PredictionResponse } from '@/lib/api/types';
import type {
  AIInsight,
  FloodIntelligence,
  Prediction,
  SustainabilityScore,
  TimelineEvent,
  WaterIntelligence,
  WeatherData,
  YieldIntelligence,
} from '@/types';

interface IntelligenceContextValue {
  insights: AIInsight[];
  weather: WeatherData | null;
  flood: FloodIntelligence | null;
  yieldData: YieldIntelligence | null;
  water: WaterIntelligence | null;
  sustainability: SustainabilityScore | null;
  soilHealth: SoilNutrient[];
  timeline: TimelineEvent[];
  chartOptions: ChartOption[];
  predictions: Prediction[];
  aiAdvisory: string | null;
  decisionSummary: string | null;
  locationLabel: string;
  loading: boolean;
  error: string | null;
  hasLiveData: boolean;
  lastUpdated: string | null;
  rawResponse: PredictionResponse | null;
  runAnalysis: () => Promise<void>;
}

const IntelligenceContext = createContext<IntelligenceContextValue | null>(null);

export function IntelligenceProvider({ children }: { children: ReactNode }) {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rawResponse, setRawResponse] = useState<PredictionResponse | null>(null);
  const [lastRequest, setLastRequest] = useState<PredictionRequest | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const locationLabel = profile ? getLocationLabel(profile) : 'Your farm';

  const runAnalysis = useCallback(async () => {
    if (!profile) {
      throw new Error('Sign in to run analysis.');
    }

    setLoading(true);
    setError(null);

    try {
      const baseRequest = buildPredictionRequest(profile);
      let response = await fetchPrediction(baseRequest);
      let request = baseRequest;

      if (response.weather) {
        request = syncRequestWithWeather(baseRequest, response.weather);
        response = await fetchPrediction(request);
      }

      setLastRequest(request);
      setRawResponse(response);
      setLastUpdated(new Date().toISOString());
      setPredictions((prev) => [mapPrediction(response, profile.id), ...prev]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Analysis failed';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [profile]);

  useEffect(() => {
    if (!profile?.latitude || !profile?.longitude || loading) {
      return;
    }

    void runAnalysis();
  // Re-run when location or model-relevant farm inputs change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    profile?.latitude,
    profile?.longitude,
    profile?.crop,
    profile?.farm_area,
    profile?.season,
    profile?.state_name,
    profile?.annual_rainfall,
    profile?.fertilizer_kg,
    profile?.pesticide_kg,
    profile?.land_cover,
    profile?.soil_type,
    profile?.elevation_m,
    profile?.near_river,
    profile?.historical_floods,
    profile?.soil_n,
    profile?.soil_p,
    profile?.soil_k,
    profile?.soil_ph,
    profile?.expected_rainfall_mm,
  ]);

  const value = useMemo<IntelligenceContextValue>(() => {
    const hasLiveData = rawResponse !== null && lastRequest !== null;

    return {
      insights: hasLiveData ? mapInsights(rawResponse) : [],
      weather: hasLiveData ? mapWeather(rawResponse) : null,
      flood: hasLiveData ? mapFlood(rawResponse, lastRequest) : null,
      yieldData: hasLiveData ? mapYield(rawResponse) : null,
      water: hasLiveData ? mapWater(rawResponse, lastRequest) : null,
      sustainability: hasLiveData ? mapSustainability(rawResponse) : null,
      soilHealth: hasLiveData ? mapSoilHealth(lastRequest.crop_recommendation) : [],
      timeline: hasLiveData ? mapTimeline(rawResponse) : [],
      chartOptions: hasLiveData ? mapChartOptions(rawResponse, lastRequest) : [],
      predictions,
      aiAdvisory: rawResponse?.ai_advisory ?? null,
      decisionSummary: rawResponse?.decision.summary ?? null,
      locationLabel,
      loading,
      error,
      hasLiveData,
      lastUpdated,
      rawResponse,
      runAnalysis,
    };
  }, [
    rawResponse,
    lastRequest,
    predictions,
    locationLabel,
    loading,
    error,
    lastUpdated,
    runAnalysis,
  ]);

  return (
    <IntelligenceContext.Provider value={value}>
      {children}
    </IntelligenceContext.Provider>
  );
}

export function useIntelligence() {
  const context = useContext(IntelligenceContext);
  if (!context) {
    throw new Error('useIntelligence must be used within an IntelligenceProvider');
  }
  return context;
}
