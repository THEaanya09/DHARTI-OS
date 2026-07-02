'use client';

import { Loader2 } from 'lucide-react';

export function CardLoading({ message = 'Loading live data…' }: { message?: string }) {
  return (
    <div className="flex min-h-[180px] flex-col items-center justify-center gap-3 rounded-2xl border border-border/30 bg-card p-8 text-center">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
      <p className="text-body-sm text-muted-foreground">{message}</p>
    </div>
  );
}

export function CardEmpty({ message }: { message: string }) {
  return (
    <div className="flex min-h-[180px] flex-col items-center justify-center rounded-2xl border border-dashed border-border/40 bg-card/50 p-8 text-center">
      <p className="text-body-sm text-muted-foreground">{message}</p>
    </div>
  );
}
