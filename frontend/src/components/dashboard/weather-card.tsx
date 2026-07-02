'use client';

import { Cloud, Sun, CloudRain, CloudLightning, CloudFog, Snowflake, CloudDrizzle, CloudSun } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useI18n } from '@/lib/i18n';
import { mockWeather, mockForecast } from '@/data/mock';
import type { WeatherCondition } from '@/types';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

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
  const weather = mockWeather;
  const forecast = mockForecast;

  return (
    <div className="border border-border/30 bg-card p-6 md:p-8 rounded-2xl transition-all duration-200 shadow-sm flex flex-col justify-between h-full select-none">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-body-sm font-semibold text-foreground">
            {conditionIcons[weather.condition]}
            Weather Intelligence
          </span>
          <span className="text-[10px] text-muted-foreground font-mono">Bhopal, MP</span>
        </div>

        {/* Current */}
        <div className="flex items-end gap-2">
          <span className="text-[3.25rem] font-display font-extrabold leading-none tracking-tight text-foreground">
            {weather.temperature}°
          </span>
          <span className="text-body-sm text-muted-foreground pb-1.5">
            {w.feelsLike} {weather.feels_like}°C
          </span>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-6 border-y border-border/30 py-4">
          {[
            { label: w.humidity, value: `${weather.humidity}%` },
            { label: w.wind, value: `${weather.wind_speed} km/h` },
            { label: w.uvIndex, value: weather.uv_index.toString() },
          ].map((m, idx) => (
            <div key={idx} className="space-y-1">
              <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">{m.label}</p>
              <p className="text-body-sm font-semibold font-mono text-foreground">{m.value}</p>
            </div>
          ))}
        </div>

        {/* 7-day Forecast */}
        <div className="space-y-3">
          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{w.forecast}</p>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {forecast.map((day) => {
              const dayName = new Date(day.date).toLocaleDateString('en', { weekday: 'short' });
              return (
                <div
                  key={day.date}
                  className="flex flex-col items-center gap-2 rounded-xl border border-border/20 bg-surface/30 px-3.5 py-3 min-w-[62px] transition-all hover:bg-surface/50 hover:border-border/60"
                >
                  <span className="text-[10px] text-muted-foreground font-medium">{dayName}</span>
                  <span className="text-muted-foreground">{conditionIcons[day.condition]}</span>
                  <span className="text-caption font-mono font-bold text-foreground">{day.high}°</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
