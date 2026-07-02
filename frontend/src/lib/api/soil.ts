import type { SoilPropertiesResponse } from '@/lib/soil-mapper';

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

export async function fetchSoilProperties(
  latitude: number,
  longitude: number,
): Promise<SoilPropertiesResponse> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
  });

  const response = await fetch(`/api/soil?${params.toString()}`);

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
}
