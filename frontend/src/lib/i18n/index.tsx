'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Locale } from '@/types';
import { i18nConfig, RTL_LOCALES } from './config';
import enDict from './dictionaries/en.json';

type Dictionary = typeof enDict;

interface I18nContextType {
  locale: Locale;
  dictionary: Dictionary;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  isRtl: boolean;
}

const I18nContext = createContext<I18nContextType | null>(null);

const LOCALE_KEY = 'dharti-locale';

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(i18nConfig.defaultLocale);
  const [dictionary, setDictionary] = useState<Dictionary>(enDict);

  useEffect(() => {
    const saved = localStorage.getItem(LOCALE_KEY) as Locale | null;
    if (saved && i18nConfig.locales.includes(saved)) {
      setLocaleState(saved);
      loadDictionary(saved);
      applyDirAttribute(saved);
    }
  }, []);

  const loadDictionary = async (loc: Locale) => {
    if (loc === 'en') {
      setDictionary(enDict);
      return;
    }
    try {
      const mod = await import(`./dictionaries/${loc}.json`);
      setDictionary(mod.default as Dictionary);
    } catch {
      // Fallback to English if dictionary not found
      console.warn(`Dictionary for locale "${loc}" not found, falling back to English`);
      setDictionary(enDict);
    }
  };

  const applyDirAttribute = (loc: Locale) => {
    const isRtl = RTL_LOCALES.includes(loc);
    document.documentElement.lang = loc;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
  };

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(LOCALE_KEY, newLocale);
    applyDirAttribute(newLocale);
    loadDictionary(newLocale);
  }, []);

  const isRtl = RTL_LOCALES.includes(locale);

  // Deep access helper: t('landing.hero.title') → dictionary.landing.hero.title
  const t = useCallback(
    (key: string): string => {
      const keys = key.split('.');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let value: any = dictionary;
      for (const k of keys) {
        value = value?.[k];
      }
      return typeof value === 'string' ? value : key;
    },
    [dictionary]
  );

  return (
    <I18nContext.Provider value={{ locale, dictionary, setLocale, t, isRtl }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}

export function useDictionary() {
  const { dictionary } = useI18n();
  return dictionary;
}
