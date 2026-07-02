'use client';

import { FlaskConical } from 'lucide-react';
import { useIntelligence } from '@/contexts/intelligence-context';
import { CardEmpty, CardLoading } from '@/components/dashboard/card-state';
import { motion } from 'framer-motion';

export function SoilHealthCard() {
  const { soilHealth, loading, hasLiveData, rawResponse } = useIntelligence();

  if (loading && !hasLiveData) {
    return <CardLoading message="Loading soil profile…" />;
  }

  if (soilHealth.length === 0) {
    return <CardEmpty message="Soil data unavailable. Run analysis to load live nutrient profile." />;
  }

  const recommendedCrop = rawResponse?.crop_recommendation_prediction;

  return (
    <div className="border border-border/30 bg-card p-6 md:p-8 rounded-2xl transition-all duration-200 shadow-sm flex flex-col justify-between h-full select-none">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-body-sm font-semibold text-foreground">
            <FlaskConical className="h-4 w-4 text-muted-foreground" />
            Soil Health Profile
          </span>
          <span className="text-[10px] text-muted-foreground font-mono">Live sync</span>
        </div>

        <div className="space-y-1">
          <p className="text-body-sm font-semibold text-foreground">
            Recommended: {recommendedCrop ? recommendedCrop.charAt(0).toUpperCase() + recommendedCrop.slice(1) : '—'}
          </p>
          <p className="text-caption text-muted-foreground">
            Nutrient levels synced from your latest field analysis inputs.
          </p>
        </div>

        <div className="space-y-3.5 pt-2">
          {soilHealth.map((n, idx) => (
            <div key={n.name} className="space-y-1.5">
              <div className="flex justify-between text-caption font-medium">
                <span className="text-foreground">{n.name}</span>
                <span className="text-muted-foreground font-mono font-medium">{n.level}</span>
              </div>
              <div className="h-1.5 w-full bg-surface rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${n.percent}%` }}
                  transition={{ duration: 1, delay: idx * 0.1 }}
                  className="h-full bg-primary"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
