'use client';

import { Droplets } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { useIntelligence } from '@/contexts/intelligence-context';
import { CardEmpty, CardLoading } from '@/components/dashboard/card-state';

export function WaterCard() {
  const { dictionary } = useI18n();
  const w = dictionary.dashboard.water;
  const { water, loading, hasLiveData } = useIntelligence();

  if (loading && !hasLiveData) {
    return <CardLoading message="Analyzing water stress…" />;
  }

  if (!water) {
    return <CardEmpty message="Water data unavailable. Run analysis to load live soil moisture." />;
  }

  const stressLabel = water.water_stress_index >= 0.7 ? 'High' : water.water_stress_index >= 0.4 ? 'Moderate' : 'Low';

  return (
    <div className="border border-border/30 bg-card p-6 md:p-8 rounded-2xl transition-all duration-200 shadow-sm flex flex-col justify-between h-full select-none">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-body-sm font-semibold text-foreground">
            <Droplets className="h-4 w-4 text-muted-foreground" />
            Water Stress
          </span>
          <span className="text-[10px] text-muted-foreground font-mono">Live sync</span>
        </div>

        <div className="space-y-1">
          <p className="text-body-sm font-semibold text-foreground capitalize">{stressLabel} Stress</p>
          <p className="text-caption text-muted-foreground">
            {water.irrigation_needed
              ? 'Soil moisture is depleted. Irrigation recommended.'
              : 'No irrigation needed. Soil moisture optimal.'}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">{w.soilMoisture}</p>
            <p className="text-caption font-mono font-bold text-foreground">{water.soil_moisture}%</p>
          </div>
          <div className="h-1.5 w-full bg-surface rounded-full overflow-hidden">
            <div className="h-full bg-primary" style={{ width: `${water.soil_moisture}%` }} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 border-t border-border/30 pt-4">
          <div className="space-y-1">
            <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">{w.groundwater}</p>
            <p className="text-body-md font-mono font-bold text-foreground">{water.groundwater_level}m</p>
          </div>
          <div className="space-y-1">
            <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">Stress Index</p>
            <p className="text-body-md font-mono font-bold text-foreground">{water.water_stress_index.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
