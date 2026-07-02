import type { Locale } from '@/types';

export const i18nConfig = {
  defaultLocale: 'en' as Locale,
  locales: ['en', 'hi'] as Locale[],
} as const;

const dictionaries = {
  en: () => import('./dictionaries/en.json').then((m) => m.default),
  hi: () => import('./dictionaries/hi.json').then((m) => m.default),
};

export const getDictionary = async (locale: Locale) => {
  return dictionaries[locale]();
};
