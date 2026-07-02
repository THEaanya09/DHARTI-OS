'use client';

import { Globe } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import type { Locale } from '@/types';

const languageLabels: Record<Locale, string> = {
  en: 'EN',
  hi: 'हि',
};

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale } = useI18n();

  const toggle = () => {
    setLocale(locale === 'en' ? 'hi' : 'en');
  };

  return (
    <button
      onClick={toggle}
      className={cn(
        'flex items-center gap-1.5 rounded-full px-3 py-1.5',
        'bg-muted text-sm font-medium text-muted-foreground',
        'transition-colors duration-150 hover:bg-muted/80 hover:text-foreground',
        className
      )}
      aria-label="Switch language"
    >
      <Globe className="h-3.5 w-3.5" />
      <span>{languageLabels[locale]}</span>
    </button>
  );
}
