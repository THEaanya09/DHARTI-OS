'use client';

import { useEffect, useState } from 'react';
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
import { useIntelligence } from '@/contexts/intelligence-context';
import { CardEmpty, CardLoading } from '@/components/dashboard/card-state';

export function ChartCard() {
  const { chartOptions, loading, hasLiveData } = useIntelligence();
  const [activeChart, setActiveChart] = useState('temperature');

  useEffect(() => {
    if (chartOptions.length > 0 && !chartOptions.find((c) => c.key === activeChart)) {
      setActiveChart(chartOptions[0].key);
    }
  }, [chartOptions, activeChart]);

  if (loading && !hasLiveData) {
    return <CardLoading message="Loading climate snapshot…" />;
  }

  if (chartOptions.length === 0) {
    return <CardEmpty message="Climate data unavailable. Run analysis to load live metrics." />;
  }

  const chart = chartOptions.find((c) => c.key === activeChart) || chartOptions[0];

  return (
    <Card className="md:col-span-2 bg-card bg-noise card-hover-lift transition-all duration-200 h-full flex flex-col">
      <CardHeader className="pb-3 border-b border-border/40">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-heading-4">Climate Snapshot</CardTitle>
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
              <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" strokeOpacity={0.4} vertical={false} />
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
                labelFormatter={(v: string) =>
                  new Date(v).toLocaleDateString('en', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })
                }
                formatter={(value: number) => [`${value}${chart.unit}`, chart.label]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={chart.color}
                strokeWidth={2.5}
                fill={`url(#fill-${chart.key})`}
                dot={{ r: 4, strokeWidth: 2, stroke: '#fff', fill: chart.color }}
                activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff', fill: chart.color }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
