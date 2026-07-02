'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FlaskConical } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { motion } from 'framer-motion';

export function SoilHealthCard() {
  const { dictionary } = useI18n();
  const s = dictionary.landing.soilFeature; // Reuse soil dictionary keys

  // Nutrients N, P, K, pH
  const nutrients = [
    { name: 'Nitrogen (N)', percent: 65, level: 'Optimal' },
    { name: 'Phosphorus (P)', percent: 45, level: 'Medium' },
    { name: 'Potassium (K)', percent: 80, level: 'High' },
    { name: 'pH Level', percent: 68, level: '6.8 (Ideal)' }
  ];

  return (
    <div className="border border-border/30 bg-card p-6 md:p-8 rounded-2xl transition-all duration-200 shadow-sm flex flex-col justify-between h-full select-none">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-body-sm font-semibold text-foreground">
            <FlaskConical className="h-4 w-4 text-muted-foreground" />
            Soil Health Profile
          </span>
          <span className="text-[10px] text-muted-foreground font-mono">Sensors Active</span>
        </div>

        {/* Status Text - natural */}
        <div className="space-y-1">
          <p className="text-body-sm font-semibold text-foreground">Optimal Composition</p>
          <p className="text-caption text-muted-foreground">
            Nutrient ratios and soil pH levels are within the target window for selected crops.
          </p>
        </div>

        {/* Nutrients List */}
        <div className="space-y-3.5 pt-2">
          {nutrients.map((n, idx) => (
            <div key={idx} className="space-y-1.5">
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
