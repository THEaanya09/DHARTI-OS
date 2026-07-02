'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Landmark, CheckCircle, ArrowRight } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui/button';

export function SchemeCard() {
  const { dictionary } = useI18n();
  const schemes = dictionary.landing.schemes;

  return (
    <div className="border border-border/30 bg-card p-6 md:p-8 rounded-2xl transition-all duration-200 shadow-sm flex flex-col justify-between h-auto select-none">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3">
          <div className="space-y-1">
            <span className="flex items-center gap-2 text-sm md:text-base font-semibold text-foreground">
              <Landmark className="h-4 w-4 text-muted-foreground" />
              Government Schemes
            </span>
            <p className="text-[10px] text-muted-foreground">Matched eligibility profile</p>
          </div>
          <span className="text-[10px] text-muted-foreground font-mono">3 Matches</span>
        </div>

        {/* Schemes List */}
        <div className="space-y-3">
          {schemes.items.slice(0, 3).map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-xl border border-border/20 bg-surface/30 hover:bg-surface/50 transition-colors"
            >
              <div className="min-w-0 flex-1">
                <span className="text-caption font-semibold text-foreground truncate block" title={item.name}>
                  {item.name}
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">
                  {item.benefit}
                </span>
              </div>
              <div className="flex flex-col items-end gap-0.5 flex-shrink-0 pl-3">
                <span className="text-[10px] text-muted-foreground font-medium">
                  {item.status}
                </span>
                <span className="text-[9px] text-muted-foreground font-mono">
                  {item.deadline}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
