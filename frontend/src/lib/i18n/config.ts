import type { Locale } from '@/types';

/** All supported locales — 22 Indian scheduled languages + English */
export const ALL_LOCALES: Locale[] = [
  'en', 'hi', 'bn', 'te', 'mr', 'ta', 'gu', 'ur', 'kn', 'or',
  'ml', 'pa', 'as', 'mai', 'sa', 'ne', 'sd', 'ks', 'doi', 'kok',
  'mni', 'sat', 'bo',
];

/** RTL locales — Urdu, Sindhi, Kashmiri use right-to-left scripts */
export const RTL_LOCALES: Locale[] = ['ur', 'sd', 'ks'];

/** Human-readable labels in each language's native script */
export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  hi: 'हिन्दी',
  bn: 'বাংলা',
  te: 'తెలుగు',
  mr: 'मराठी',
  ta: 'தமிழ்',
  gu: 'ગુજરાતી',
  ur: 'اردو',
  kn: 'ಕನ್ನಡ',
  or: 'ଓଡ଼ିଆ',
  ml: 'മലയാളം',
  pa: 'ਪੰਜਾਬੀ',
  as: 'অসমীয়া',
  mai: 'मैथिली',
  sa: 'संस्कृतम्',
  ne: 'नेपाली',
  sd: 'سنڌي',
  ks: 'كٲشُر',
  doi: 'डोगरी',
  kok: 'कोंकणी',
  mni: 'মণিপুরী',
  sat: 'ᱥᱟᱱᱛᱟᱲᱤ',
  bo: 'बड़ो',
};

export const i18nConfig = {
  defaultLocale: 'en' as Locale,
  locales: ALL_LOCALES,
} as const;

/**
 * Dynamic dictionary loader — each language JSON is lazily imported
 * so only the active locale's bundle is downloaded.
 */
const dictionaries: Record<Locale, () => Promise<Record<string, unknown>>> = {
  en:  () => import('./dictionaries/en.json').then((m) => m.default),
  hi:  () => import('./dictionaries/hi.json').then((m) => m.default),
  bn:  () => import('./dictionaries/bn.json').then((m) => m.default),
  te:  () => import('./dictionaries/te.json').then((m) => m.default),
  mr:  () => import('./dictionaries/mr.json').then((m) => m.default),
  ta:  () => import('./dictionaries/ta.json').then((m) => m.default),
  gu:  () => import('./dictionaries/gu.json').then((m) => m.default),
  ur:  () => import('./dictionaries/ur.json').then((m) => m.default),
  kn:  () => import('./dictionaries/kn.json').then((m) => m.default),
  or:  () => import('./dictionaries/or.json').then((m) => m.default),
  ml:  () => import('./dictionaries/ml.json').then((m) => m.default),
  pa:  () => import('./dictionaries/pa.json').then((m) => m.default),
  as:  () => import('./dictionaries/as.json').then((m) => m.default),
  mai: () => import('./dictionaries/mai.json').then((m) => m.default),
  sa:  () => import('./dictionaries/sa.json').then((m) => m.default),
  ne:  () => import('./dictionaries/ne.json').then((m) => m.default),
  sd:  () => import('./dictionaries/sd.json').then((m) => m.default),
  ks:  () => import('./dictionaries/ks.json').then((m) => m.default),
  doi: () => import('./dictionaries/doi.json').then((m) => m.default),
  kok: () => import('./dictionaries/kok.json').then((m) => m.default),
  mni: () => import('./dictionaries/mni.json').then((m) => m.default),
  sat: () => import('./dictionaries/sat.json').then((m) => m.default),
  bo:  () => import('./dictionaries/bo.json').then((m) => m.default),
};

export const getDictionary = async (locale: Locale) => {
  return dictionaries[locale]();
};
