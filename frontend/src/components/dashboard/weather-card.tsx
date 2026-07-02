'use client';

import { Cloud, Sun, CloudRain, CloudLightning, CloudFog, Snowflake, CloudDrizzle, CloudSun } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { useIntelligence } from '@/contexts/intelligence-context';
import { CardEmpty, CardLoading } from '@/components/dashboard/card-state';
import type { WeatherCondition } from '@/types';
import type { ReactNode } from 'react';

const conditionIcons: Record<WeatherCondition, ReactNode> = {
  clear: <Sun className="h-4 w-4 text-muted-foreground" />,
  partly_cloudy: <CloudSun className="h-4 w-4 text-muted-foreground" />,
  cloudy: <Cloud className="h-4 w-4 text-muted-foreground" />,
  overcast: <Cloud className="h-4 w-4 text-muted-foreground" />,
  light_rain: <CloudDrizzle className="h-4 w-4 text-muted-foreground" />,
  rain: <CloudRain className="h-4 w-4 text-muted-foreground" />,
  heavy_rain: <CloudRain className="h-4 w-4 text-muted-foreground" />,
  thunderstorm: <CloudLightning className="h-4 w-4 text-muted-foreground" />,
  fog: <CloudFog className="h-4 w-4 text-muted-foreground" />,
  haze: <CloudFog className="h-4 w-4 text-muted-foreground" />,
  snow: <Snowflake className="h-4 w-4 text-muted-foreground" />,
};

export function WeatherCard() {
  const { dictionary } = useI18n();
  const w = dictionary.dashboard.weather;
  const { weather, locationLabel, loading, hasLiveData, rawResponse } = useIntelligence();

  if (loading && !hasLiveData) {
    return <CardLoading message="Fetching live weather…" />;
  }

  if (!weather) {
    return <CardEmpty message="Weather data unavailable. Run analysis to fetch live conditions." />;
  }

  const liveDescription = rawResponse?.weather?.description;

  return (
    <div className="border border-border/30 bg-card p-6 md:p-8 rounded-2xl transition-all duration-200 shadow-sm flex flex-col justify-between h-full select-none">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-body-sm font-semibold text-foreground">
            {conditionIcons[weather.condition]}
            Weather Intelligence
          </span>
          <span className="text-[10px] text-muted-foreground font-mono">{locationLabel}</span>
        </div>

        <div className="flex items-end gap-2">
          <span className="text-[3.25rem] font-display font-extrabold leading-none tracking-tight text-foreground">
            {weather.temperature}°
          </span>
          <span className="text-body-sm text-muted-foreground pb-1.5">
            {w.feelsLike} {weather.feels_like}°C
          </span>
        </div>

        {liveDescription && (
          <p className="text-caption capitalize text-muted-foreground">{liveDescription}</p>
        )}

        <div className="grid grid-cols-3 gap-6 border-y border-border/30 py-4">
          {[
            { label: w.humidity, value: `${weather.humidity}%` },
            { label: w.wind, value: `${weather.wind_speed} km/h` },
            { label: 'Pressure', value: `${weather.pressure} hPa` },
          ].map((m, idx) => (
            <div key={idx} className="space-y-1">
              <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">{m.label}</p>
              <p className="text-body-sm font-semibold font-mono text-foreground">{m.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
