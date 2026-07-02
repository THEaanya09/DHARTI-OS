'use client';

import { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { mockTemperatureChart, mockRainfallChart, mockSoilMoistureChart } from '@/data/mock';

const chartOptions = [
  { key: 'temperature', label: 'Temperature', data: mockTemperatureChart, unit: '°C', color: 'oklch(0.7 0.14 162)' },
  { key: 'rainfall', label: 'Rainfall', data: mockRainfallChart, unit: 'mm', color: 'oklch(0.65 0.14 240)' },
  { key: 'soilMoisture', label: 'Soil Moisture', data: mockSoilMoistureChart, unit: '%', color: 'oklch(0.8 0.14 70)' },
] as const;

export function ChartCard() {
  const [activeChart, setActiveChart] = useState<string>('temperature');
  const chart = chartOptions.find((c) => c.key === activeChart) || chartOptions[0];

  return (
    <Card className="md:col-span-2 bg-card bg-noise card-hover-lift transition-all duration-200 h-full flex flex-col">
      <CardHeader className="pb-3 border-b border-border/40">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-heading-4">Climate Trends</CardTitle>
          <div className="flex gap-1 rounded-xl bg-muted p-1 border border-border/30">
            {chartOptions.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setActiveChart(opt.key)}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-caption font-semibold transition-all duration-150 cursor-pointer select-none',
                  activeChart === opt.key
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6 flex-1 flex flex-col justify-end">
        <div className="flex-1 w-full min-h-[300px] md:min-h-[380px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chart.data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id={`fill-${chart.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chart.color} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={chart.color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="4 4"
                stroke="var(--border)"
                strokeOpacity={0.4}
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: 'var(--muted-foreground)', fontWeight: '500' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: string) =>
                  new Date(v).toLocaleDateString('en', { month: 'short', day: 'numeric' })
                }
              />
              <YAxis
                tick={{ fontSize: 10, fill: 'var(--muted-foreground)', fontWeight: '500' }}
                tickLine={false}
                axisLine={false}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--popover)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  fontSize: '11px',
                  boxShadow: 'var(--shadow-lg)',
                }}
                labelFormatter={(v: any) =>
                  new Date(v).toLocaleDateString('en', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })
                }
                formatter={(value: any) => [`${value}${chart.unit}`, chart.label]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={chart.color}
                strokeWidth={2.5}
                fill={`url(#fill-${chart.key})`}
                dot={false}
                activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff', fill: chart.color }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
