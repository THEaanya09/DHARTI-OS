import type { CropType } from '@/types';

/* ============================================================
   Application Constants
   ============================================================ */

export const APP_NAME = 'DHARTI AI';
export const APP_NAME_HINDI = 'धरती AI';

// ─── Animation Constants (Framer Motion) ────────────────────
export const MOTION = {
  duration: {
    micro: 0.12,
    fast: 0.2,
    normal: 0.3,
    slow: 0.5,
  },
  ease: {
    default: [0.25, 0.1, 0.25, 1] as const,
    spring: { stiffness: 400, damping: 30 },
    exit: [0.4, 0, 1, 1] as const,
  },
  stagger: {
    fast: 0.05,
    normal: 0.08,
    slow: 0.12,
  },
} as const;

// ─── Framer Motion Variants ─────────────────────────────────
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: MOTION.duration.normal } },
};

export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: MOTION.duration.normal, ease: MOTION.ease.default },
  },
};

export const fadeInDown = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: MOTION.duration.normal, ease: MOTION.ease.default },
  },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: MOTION.duration.fast, ease: MOTION.ease.default },
  },
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: MOTION.stagger.normal,
      delayChildren: 0.1,
    },
  },
};

export const slideInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: MOTION.duration.normal, ease: MOTION.ease.default },
  },
};

export const slideInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: MOTION.duration.normal, ease: MOTION.ease.default },
  },
};

// ─── Crop Options ───────────────────────────────────────────
export const CROP_OPTIONS: { value: CropType }[] = [
  { value: 'rice' },
  { value: 'wheat' },
  { value: 'maize' },
  { value: 'cotton' },
  { value: 'sugarcane' },
  { value: 'soybean' },
  { value: 'groundnut' },
  { value: 'mustard' },
  { value: 'potato' },
  { value: 'onion' },
  { value: 'tomato' },
  { value: 'millet' },
  { value: 'pulses' },
  { value: 'other' },
];

// ─── Map Constants ──────────────────────────────────────────
export const MAP_DEFAULTS = {
  center: { lat: 22.5, lng: 78.5 }, // Center of India
  zoom: 5,
  style: 'https://tiles.openfreemap.org/styles/liberty',
};

// ─── Dashboard Navigation ───────────────────────────────────
export const DASHBOARD_NAV = [
  { key: 'dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
  { key: 'analyze', href: '/analyze', icon: 'Scan' },
  { key: 'predictions', href: '/predictions', icon: 'Brain' },
  { key: 'settings', href: '/settings', icon: 'Settings' },
] as const;

// ─── Risk Level Colors ──────────────────────────────────────
export const RISK_COLORS = {
  low: 'text-success',
  moderate: 'text-warning',
  high: 'text-destructive',
  critical: 'text-destructive',
} as const;

export const RISK_BG = {
  low: 'bg-success/10',
  moderate: 'bg-warning/10',
  high: 'bg-destructive/10',
  critical: 'bg-destructive/15',
} as const;
