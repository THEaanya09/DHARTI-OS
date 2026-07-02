'use client';

import { Waves, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { useIntelligence } from '@/contexts/intelligence-context';
import { CardEmpty, CardLoading } from '@/components/dashboard/card-state';
import { motion } from 'framer-motion';

export function FloodCard() {
  const { dictionary } = useI18n();
  const f = dictionary.dashboard.flood;
  const { flood, locationLabel, loading, hasLiveData } = useIntelligence();

  if (loading && !hasLiveData) {
    return <CardLoading message="Running flood risk model…" />;
  }

  if (!flood) {
    return <CardEmpty message="Flood data unavailable. Run analysis to load live risk assessment." />;
  }

  const trendIcon = {
    rising: <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />,
    stable: <Minus className="h-3.5 w-3.5 text-muted-foreground" />,
    falling: <TrendingDown className="h-3.5 w-3.5 text-muted-foreground" />,
  };

  return (
    <div className="border border-border/30 bg-card p-6 md:p-8 rounded-2xl transition-all duration-200 shadow-sm flex flex-col justify-between h-full select-none">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-body-sm font-semibold text-foreground">
            <Waves className="h-4 w-4 text-muted-foreground" />
            Flood Watch
          </span>
          <span className="text-[10px] text-muted-foreground font-mono">{locationLabel}</span>
        </div>

        <div className="space-y-1">
          <p className="text-body-sm font-semibold text-foreground capitalize">{flood.risk_level} Risk</p>
          <p className="text-caption text-muted-foreground">
            {flood.risk_level === 'low'
              ? 'River flow stable. No alert active.'
              : flood.risk_level === 'moderate'
                ? 'Flow level rising. Stay alert in low-lying areas.'
                : 'Critical river levels detected. Deploy flood barriers immediately.'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 border-y border-border/30 py-4">
          <div className="space-y-1">
            <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">{f.riverLevel}</p>
            <p className="text-body-md font-mono font-bold text-foreground">{flood.river_level}m</p>
            <p className="text-[10px] text-muted-foreground font-medium">{flood.river_name} River</p>
          </div>
          <div className="space-y-1">
            <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">{f.distance}</p>
            <p className="text-body-md font-mono font-bold text-foreground">{flood.distance_km} km</p>
            <div className="flex items-center gap-1.5 text-[10px] font-semibold mt-0.5">
              {trendIcon[flood.trend]}
              <span className="text-muted-foreground">{f[flood.trend as keyof typeof f]}</span>
            </div>
          </div>
        </div>

        <div className="relative h-10 w-full overflow-hidden rounded-xl border border-border/20 bg-surface/30">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(flood.river_level / 6.2) * 100}%` }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="absolute inset-y-0 left-0 bg-primary/10 border-r border-primary/40"
          />
          <div className="absolute inset-0 flex items-center justify-between px-3 text-[10px] font-mono text-muted-foreground font-semibold">
            <span>Capacity</span>
            <span className="text-foreground">{((flood.river_level / 6.2) * 100).toFixed(0)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
