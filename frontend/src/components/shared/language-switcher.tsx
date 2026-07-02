'use client';

import { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { ALL_LOCALES, LOCALE_LABELS } from '@/lib/i18n/config';
import { cn } from '@/lib/utils';
import type { Locale } from '@/types';

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const handleSelect = (loc: Locale) => {
    setLocale(loc);
    setOpen(false);
  };

  // Short label for the button (2-3 char native script abbreviation)
  const SHORT_LABELS: Record<Locale, string> = {
    en: 'EN', hi: 'हि', bn: 'বা', te: 'తె', mr: 'म', ta: 'த',
    gu: 'ગુ', ur: 'ار', kn: 'ಕ', or: 'ଓ', ml: 'മ', pa: 'ਪ',
    as: 'অ', mai: 'मै', sa: 'सं', ne: 'ने', sd: 'سن', ks: 'كٲ',
    doi: 'डो', kok: 'कों', mni: 'ম', sat: 'ᱥᱟ', bo: 'ब',
  };

  return (
    <div ref={ref} className={cn('relative', className)}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'flex items-center gap-1.5 rounded-full px-3 py-1.5',
          'bg-muted text-sm font-medium text-muted-foreground',
          'transition-colors duration-150 hover:bg-muted/80 hover:text-foreground',
          'cursor-pointer select-none'
        )}
        aria-label="Switch language"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <Globe className="h-3.5 w-3.5" />
        <span>{SHORT_LABELS[locale]}</span>
        <ChevronDown className={cn('h-3 w-3 transition-transform duration-200', open && 'rotate-180')} />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          className={cn(
            'absolute right-0 top-full z-50 mt-2',
            'w-56 max-h-80 overflow-y-auto',
            'rounded-xl border border-border bg-background/95 backdrop-blur-xl',
            'shadow-lg shadow-black/10',
            'animate-in fade-in-0 zoom-in-95 duration-150'
          )}
          role="listbox"
          aria-label="Select language"
        >
          <div className="p-1.5">
            {ALL_LOCALES.map((loc) => (
              <button
                key={loc}
                onClick={() => handleSelect(loc)}
                role="option"
                aria-selected={locale === loc}
                className={cn(
                  'flex w-full items-center justify-between rounded-lg px-3 py-2',
                  'text-sm transition-colors duration-100 cursor-pointer',
                  locale === loc
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <span>{LOCALE_LABELS[loc]}</span>
                {locale === loc && <Check className="h-3.5 w-3.5 text-primary" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
