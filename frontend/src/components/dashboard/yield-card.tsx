'use client';

import { BarChart3, TrendingUp, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useI18n } from '@/lib/i18n';
import { mockYield } from '@/data/mock';
import { cn } from '@/lib/utils';

export function YieldCard() {
  const { dictionary } = useI18n();
  const y = dictionary.dashboard.yield;
  const yieldData = mockYield;
  const diff = ((yieldData.predicted_yield - yieldData.historical_avg) / yieldData.historical_avg * 100).toFixed(1);
  const isPositive = Number(diff) > 0;

  return (
    <div className="border border-border/30 bg-card p-6 md:p-8 rounded-2xl transition-all duration-200 shadow-sm flex flex-col justify-between h-auto select-none">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm md:text-base font-semibold text-foreground">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              Yield Intelligence
            </span>
            <span className="text-[10px] md:text-sm text-muted-foreground font-mono">Bhopal Region</span>
        </div>

        {/* Prediction Display */}
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">{y.predicted}</p>
            <p className="text-[2.25rem] md:text-[2.75rem] font-display font-extrabold leading-none tracking-tight">
              {yieldData.predicted_yield}
              <span className="text-sm md:text-base text-muted-foreground ml-2 font-normal uppercase">{yieldData.unit}</span>
            </p>
          </div>
          <div className="text-base md:text-lg font-semibold text-foreground pb-1">
            <span className={isPositive ? 'text-primary' : 'text-destructive'}>
              {isPositive ? '+' : ''}{diff}%
            </span> <span className="text-sm text-muted-foreground">vs avg</span>
          </div>
        </div>

        {/* Confidence Progress Bar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs md:text-sm text-muted-foreground uppercase font-bold tracking-widest">{y.confidence}</p>
            <p className="text-sm md:text-base font-mono font-bold text-foreground">{yieldData.confidence}%</p>
          </div>
          <div className="h-1.5 w-full bg-surface rounded-full overflow-hidden">
            <div className="h-full bg-primary" style={{ width: `${yieldData.confidence}%` }} />
          </div>
        </div>

        {/* Factors List */}
        <div className="space-y-3">
          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{y.factors}</p>
          <div className="space-y-2.5">
            {yieldData.factors.map((factor) => (
              <div key={factor.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    'h-1.5 w-1.5 rounded-full',
                    factor.impact === 'positive' ? 'bg-primary' :
                    factor.impact === 'negative' ? 'bg-destructive' : 'bg-muted-foreground/50'
                  )} />
                  <span className="text-body-sm text-foreground">{factor.name}</span>
                </div>
                <span className="text-caption text-muted-foreground font-mono font-medium">{factor.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
