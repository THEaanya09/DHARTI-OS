'use client';

import { Clock, Cloud, Cpu, AlertTriangle, Zap, Flag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n';
import { useIntelligence } from '@/contexts/intelligence-context';
import { CardEmpty, CardLoading } from '@/components/dashboard/card-state';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

const typeIcons: Record<string, ReactNode> = {
  weather: <Cloud className="h-3.5 w-3.5" />,
  prediction: <Cpu className="h-3.5 w-3.5" />,
  alert: <AlertTriangle className="h-3.5 w-3.5" />,
  action: <Zap className="h-3.5 w-3.5" />,
  milestone: <Flag className="h-3.5 w-3.5" />,
};

export function TimelineCard() {
  const { dictionary } = useI18n();
  const t = dictionary.dashboard.timeline;
  const { timeline, loading, hasLiveData } = useIntelligence();

  if (loading && !hasLiveData) {
    return <CardLoading message="Building activity timeline…" />;
  }

  if (timeline.length === 0) {
    return <CardEmpty message="No timeline events yet. Run analysis to generate live activity." />;
  }

  return (
    <div className="border border-border/30 bg-card p-6 md:p-8 rounded-2xl transition-all duration-200 shadow-sm flex flex-col justify-between h-full select-none">
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-2">
          <div className="space-y-1">
            <span className="flex items-center gap-2 text-body-sm font-semibold text-foreground">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Timeline Activity
            </span>
            <p className="text-caption text-muted-foreground">Live analysis events</p>
          </div>
          <Button variant="ghost" size="sm" className="text-caption gap-1 text-muted-foreground hover:text-foreground cursor-pointer rounded-full px-3.5 h-8">
            {t.viewAll}
            <ArrowRight className="h-3 w-3" />
          </Button>
        </div>

        <div className="relative space-y-5 pl-5">
          <div className="absolute left-[5.5px] top-1.5 bottom-1.5 w-px bg-border/40" />

          {timeline.map((event) => {
            const date = new Date(event.date);
            const relTime = formatRelativeTime(date);
            const isAlert = event.type === 'alert';
            return (
              <div key={event.id} className="relative">
                <div className={cn(
                  'absolute -left-[19.5px] top-1.5 h-2 w-2 rounded-full border border-background',
                  isAlert ? 'bg-warning' : 'bg-muted-foreground/60'
                )} />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{typeIcons[event.type]}</span>
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
