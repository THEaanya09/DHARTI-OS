'use client';

import { useCallback, useState } from 'react';
import { fetchSoilProperties } from '@/lib/api/soil';
import { mapSoilToFarmFields, type SoilPropertiesResponse } from '@/lib/soil-mapper';
import type { FarmModelFields } from '@/lib/farm-fields';

export function useSoilGrids() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [soilData, setSoilData] = useState<SoilPropertiesResponse | null>(null);

  const fetchSoil = useCallback(async (latitude: number, longitude: number) => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchSoilProperties(latitude, longitude);
      setSoilData(data);
      return mapSoilToFarmFields(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch soil data';
      setError(message);
      setSoilData(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const applySoilToFields = useCallback(
    (fields: FarmModelFields, updates: Partial<FarmModelFields>): FarmModelFields => ({
      ...fields,
      ...updates,
    }),
    [],
  );

  return {
    fetchSoil,
    applySoilToFields,
    loading,
    error,
    soilData,
    clearError: () => setError(null),
  };
}
