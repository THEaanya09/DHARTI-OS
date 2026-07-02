'use client';

import { Droplets } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useI18n } from '@/lib/i18n';
import { mockWater } from '@/data/mock';

export function WaterCard() {
  const { dictionary } = useI18n();
  const w = dictionary.dashboard.water;
  const water = mockWater;

  return (
    <div className="border border-border/30 bg-card p-6 md:p-8 rounded-2xl transition-all duration-200 shadow-sm flex flex-col justify-between h-full select-none">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-body-sm font-semibold text-foreground">
            <Droplets className="h-4 w-4 text-muted-foreground" />
            Water Stress
          </span>
          <span className="text-[10px] text-muted-foreground font-mono">Telemetry Active</span>
        </div>

        {/* Status Text - natural instead of badges */}
        <div className="space-y-1">
          <p className="text-body-sm font-semibold text-foreground capitalize">
            {water.water_stress_index} Stress
          </p>
          <p className="text-caption text-muted-foreground">
            {water.irrigation_needed 
              ? 'Soil moisture is depleted. Irrigation recommended.' 
              : 'No irrigation needed. Soil moisture optimal.'}
          </p>
        </div>

        {/* Soil Moisture Progress bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">{w.soilMoisture}</p>
            <p className="text-caption font-mono font-bold text-foreground">{water.soil_moisture}%</p>
          </div>
          <div className="h-1.5 w-full bg-surface rounded-full overflow-hidden">
            <div className="h-full bg-primary" style={{ width: `${water.soil_moisture}%` }} />
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-6 border-t border-border/30 pt-4">
          <div className="space-y-1">
            <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">{w.groundwater}</p>
            <p className="text-body-md font-mono font-bold text-foreground">{water.groundwater_level}m</p>
          </div>
          <div className="space-y-1">
            <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">Stress Index</p>
            <p className="text-body-md font-mono font-bold text-foreground capitalize">{water.water_stress_index}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
