'use client';

import Link from 'next/link';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n';
import { mockPredictions } from '@/data/mock';
import { cn } from '@/lib/utils';

const typeLabels: Record<string, string> = {
  yield: 'Yield',
  weather: 'Weather',
  flood: 'Flood',
  drought: 'Drought',
  pest: 'Pest',
  harvest_timing: 'Harvest',
  market: 'Market',
};

const riskBadge: Record<string, string> = {
  low: 'bg-success/10 text-success border-success/20',
  moderate: 'bg-warning/10 text-warning border-warning/20',
  high: 'bg-destructive/10 text-destructive border-destructive/20',
  critical: 'bg-destructive/15 text-destructive border-destructive/30',
};

export function PredictionsCard() {
  const { dictionary } = useI18n();
  const p = dictionary.dashboard.predictions;
  const predictions = mockPredictions.slice(0, 4);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-heading-4 flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-chart-4" />
            {p.title}
          </CardTitle>
          <Link href="/predictions">
            <Button variant="ghost" size="sm" className="text-caption gap-1 text-primary">
              {p.viewAll}
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {predictions.map((pred) => (
          <div
            key={pred.id}
            className="flex items-start gap-3 rounded-lg border border-border/50 p-3 transition-colors hover:bg-surface/50"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-body-sm font-medium truncate">{pred.title}</span>
                <Badge variant="outline" className={cn('text-[10px] flex-shrink-0', riskBadge[pred.risk_level])}>
                  {typeLabels[pred.type]}
                </Badge>
              </div>
              <p className="mt-1 text-caption text-muted-foreground line-clamp-1">{pred.summary}</p>
              <div className="mt-2 flex items-center gap-4">
                <span className="text-caption text-muted-foreground font-mono">
                  {pred.confidence}% conf.
                </span>
                {pred.accuracy && (
                  <span className="flex items-center gap-1 text-caption text-success font-mono">
                    <TrendingUp className="h-3 w-3" />
                    {pred.accuracy}% {p.accuracy?.toLowerCase?.() ?? 'accuracy'}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
