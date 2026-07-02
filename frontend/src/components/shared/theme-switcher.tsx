'use client';

import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export function ThemeSwitcher({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className={cn('h-9 w-24 rounded-full bg-muted animate-pulse', className)} />;

  const options = [
    { value: 'light', icon: Sun },
    { value: 'dark', icon: Moon },
    { value: 'system', icon: Monitor },
  ] as const;

  return (
    <div className={cn('flex items-center gap-0.5 rounded-full bg-muted p-0.5', className)}>
      {options.map(({ value, icon: Icon }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={cn(
            'relative rounded-full p-1.5 transition-colors duration-150',
            theme === value
              ? 'bg-surface-elevated text-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          )}
          aria-label={`Switch to ${value} theme`}
        >
          <Icon className="h-3.5 w-3.5" />
        </button>
      ))}
    </div>
  );
}
