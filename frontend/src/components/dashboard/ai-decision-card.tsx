'use client';

import { ArrowRight, AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n';
import { mockInsights } from '@/data/mock';
import { cn } from '@/lib/utils';
import type { InsightPriority } from '@/types';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

const priorityConfig: Record<InsightPriority, { icon: ReactNode; color: string }> = {
  critical: {
    icon: <AlertTriangle className="h-4 w-4" />,
    color: 'text-destructive',
  },
  high: {
    icon: <AlertCircle className="h-4 w-4" />,
    color: 'text-warning',
  },
  medium: {
    icon: <Info className="h-4 w-4" />,
    color: 'text-muted-foreground',
  },
  low: {
    icon: <CheckCircle className="h-4 w-4" />,
    color: 'text-muted-foreground',
  },
};

export function AIDecisionCard() {
  const { dictionary } = useI18n();
  const ai = dictionary.dashboard.ai;
  const insights = mockInsights;

  return (
    <div className="border border-border/30 bg-card p-6 md:p-8 rounded-2xl transition-all duration-200 shadow-sm flex flex-col justify-between h-full select-none">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-2">
          <div className="space-y-1">
            <span className="flex items-center gap-2 text-body-sm font-semibold text-foreground">
              <div className="h-2 w-2 rounded-full bg-primary" />
              AI Advisor
            </span>
            <p className="text-caption text-muted-foreground">{ai.subtitle}</p>
          </div>
          <Button variant="ghost" size="sm" className="text-caption gap-1 text-muted-foreground hover:text-foreground cursor-pointer rounded-full px-3.5 h-8">
            {ai.viewAll}
            <ArrowRight className="h-3 w-3" />
          </Button>
        </div>

        {/* Insights list */}
        <div className="space-y-4">
          {insights.map((insight) => {
            const config = priorityConfig[insight.priority];
            return (
              <div
                key={insight.id}
                className="border-b border-border/20 last:border-0 pb-4 last:pb-0 transition-all duration-200"
              >
                <div className="flex items-start gap-3">
                  <div className={cn('mt-0.5 flex-shrink-0', config.color)}>{config.icon}</div>
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-body-sm font-semibold text-foreground truncate">{insight.title}</h4>
                      <span className="text-[10px] font-mono font-bold text-primary">
                        {insight.confidence}% Match
                      </span>
                    </div>
                    
                    <p className="text-body-sm text-muted-foreground leading-relaxed">
                      {insight.description}
                    </p>
                    
                    {/* Action text */}
                    <div className="text-caption text-foreground leading-relaxed flex items-start gap-1">
                      <span className="font-bold uppercase tracking-wider text-[9px] text-muted-foreground mt-0.5">{ai.action}:</span>
                      <span className="text-muted-foreground">{insight.action}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
