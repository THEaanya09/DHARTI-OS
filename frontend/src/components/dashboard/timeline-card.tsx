'use client';

import { Clock, Cloud, Cpu, AlertTriangle, Zap, Flag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { mockTimeline } from '@/data/mock';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

const typeIcons: Record<string, ReactNode> = {
  weather: <Cloud className="h-3.5 w-3.5" />,
  prediction: <Cpu className="h-3.5 w-3.5" />,
  alert: <AlertTriangle className="h-3.5 w-3.5" />,
  action: <Zap className="h-3.5 w-3.5" />,
  milestone: <Flag className="h-3.5 w-3.5" />,
};

const typeColors: Record<string, string> = {
  weather: 'bg-info/10 text-info border-info/20',
  prediction: 'bg-primary/10 text-primary border-primary/20',
  alert: 'bg-warning/10 text-warning border-warning/20',
  action: 'bg-chart-4/10 text-chart-4 border-chart-4/20',
  milestone: 'bg-success/10 text-success border-success/20',
};

export function TimelineCard() {
  const { dictionary } = useI18n();
  const t = dictionary.dashboard.timeline;
  const events = mockTimeline;

  return (
    <div className="border border-border/30 bg-card p-6 md:p-8 rounded-2xl transition-all duration-200 shadow-sm flex flex-col justify-between h-full select-none">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-2">
          <div className="space-y-1">
            <span className="flex items-center gap-2 text-body-sm font-semibold text-foreground">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Timeline Activity
            </span>
            <p className="text-caption text-muted-foreground">Historical actions & events logs</p>
          </div>
          <Button variant="ghost" size="sm" className="text-caption gap-1 text-muted-foreground hover:text-foreground cursor-pointer rounded-full px-3.5 h-8">
            {t.viewAll}
            <ArrowRight className="h-3 w-3" />
          </Button>
        </div>

        {/* Timeline events */}
        <div className="relative space-y-5 pl-5">
          {/* Vertical line */}
          <div className="absolute left-[5.5px] top-1.5 bottom-1.5 w-px bg-border/40" />

          {events.map((event) => {
            const date = new Date(event.date);
            const relTime = formatRelativeTime(date);
            const isAlert = event.type === 'alert';
            return (
              <div key={event.id} className="relative">
                {/* Dot */}
                <div className={cn(
                  'absolute -left-[19.5px] top-1.5 h-2 w-2 rounded-full border border-background',
                  isAlert ? 'bg-warning' : 'bg-muted-foreground/60'
                )} />

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-body-sm font-semibold text-foreground">{event.title}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">{relTime}</span>
                  </div>
                  <p className="text-caption text-muted-foreground leading-relaxed">{event.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHrs < 1) return 'Just now';
  if (diffHrs < 24) return `${diffHrs}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en', { month: 'short', day: 'numeric' });
}
