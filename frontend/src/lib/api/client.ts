import type { HealthResponse, PredictionRequest, PredictionResponse } from '@/lib/api/types';

async function parseError(response: Response): Promise<string> {
  try {
    const data = await response.json();
    if (typeof data.detail === 'string') return data.detail;
    if (typeof data.error === 'string') return data.error;
    return JSON.stringify(data);
  } catch {
    return response.statusText || 'Request failed';
  }
}

export async function fetchPrediction(payload: PredictionRequest): Promise<PredictionResponse> {
  const response = await fetch('/api/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
}

export async function fetchHealth(): Promise<HealthResponse> {
  const response = await fetch('/api/health');

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
}
