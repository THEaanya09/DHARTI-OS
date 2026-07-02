'use client';

import { Leaf, TrendingUp, Minus, TrendingDown } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { useIntelligence } from '@/contexts/intelligence-context';
import { CardEmpty, CardLoading } from '@/components/dashboard/card-state';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function SustainabilityCard() {
  const { dictionary } = useI18n();
  const s = dictionary.dashboard.sustainability;
  const { sustainability, decisionSummary, loading, hasLiveData } = useIntelligence();
  const [ringVal, setRingVal] = useState(0);

  useEffect(() => {
    if (sustainability) {
      const timer = setTimeout(() => setRingVal(sustainability.overall), 200);
      return () => clearTimeout(timer);
    }
  }, [sustainability]);

  if (loading && !hasLiveData) {
    return <CardLoading message="Computing sustainability index…" />;
  }

  if (!sustainability) {
    return <CardEmpty message="Sustainability data unavailable. Run analysis to load live scores." />;
  }

  const trendIcon = {
    improving: <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />,
    stable: <Minus className="h-3.5 w-3.5 text-muted-foreground" />,
    declining: <TrendingDown className="h-3.5 w-3.5 text-muted-foreground" />,
  };

  const metrics = [
    { label: s.waterEfficiency, value: sustainability.water_efficiency },
    { label: s.soilHealth, value: sustainability.soil_health },
    { label: s.carbon, value: sustainability.carbon_footprint },
    { label: s.biodiversity, value: sustainability.biodiversity },
  ];

  return (
    <div className="border border-border/30 bg-card p-6 md:p-8 rounded-2xl transition-all duration-200 shadow-sm flex flex-col justify-between h-full select-none">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-body-sm font-semibold text-foreground">
            <Leaf className="h-4 w-4 text-muted-foreground" />
            Sustainability Index
          </span>
          <span className="text-[10px] text-muted-foreground font-mono">{sustainability.trend}</span>
        </div>

        <div className="flex items-center gap-6 border-b border-border/30 pb-6">
          <div className="relative h-20 w-20 flex-shrink-0">
            <svg className="h-20 w-20 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="7" className="text-surface" />
              <motion.circle
                cx="50" cy="50" r="42"
                fill="none"
                stroke="currentColor"
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray="264"
                initial={{ strokeDashoffset: 264 }}
                animate={{ strokeDashoffset: 264 - (ringVal * 2.64) }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="text-primary"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-heading-3 font-mono font-bold text-foreground">{sustainability.overall}</span>
              <span className="text-[8px] text-muted-foreground -mt-0.5 uppercase font-bold">score</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-body-sm font-semibold text-foreground capitalize flex items-center gap-1.5">
              {trendIcon[sustainability.trend]}
              {sustainability.trend} trend
            </p>
            <p className="text-caption text-muted-foreground leading-relaxed">
              {decisionSummary || 'Score derived from live risk analysis and yield outlook.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {metrics.map((metric, idx) => (
            <div key={idx} className="space-y-1">
              <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">{metric.label}</p>
              <p className="text-body-md font-mono font-bold text-foreground">{metric.value}%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
