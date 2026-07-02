'use client';

import { motion } from 'framer-motion';
import { MapPin, Cpu, Zap } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { fadeInUp, staggerContainer } from '@/lib/constants';
import type { ReactNode } from 'react';

const stepIcons: ReactNode[] = [
  // Step 1: Futuristic Radar Location
  <svg key="map" viewBox="0 0 100 100" fill="none" className="h-10 w-10 text-primary">
    <circle cx="50" cy="50" r="38" stroke="var(--primary)" strokeWidth="1.5" strokeOpacity="0.2" />
    <circle cx="50" cy="50" r="26" stroke="var(--primary)" strokeWidth="1.5" strokeDasharray="3 5" />
    <circle cx="50" cy="50" r="14" stroke="var(--primary)" strokeWidth="2" />
    <circle cx="50" cy="50" r="5" fill="var(--primary)" />
    <line x1="50" y1="5" x2="50" y2="95" stroke="var(--primary)" strokeWidth="1" strokeOpacity="0.2" />
    <line x1="5" y1="50" x2="95" y2="50" stroke="var(--primary)" strokeWidth="1" strokeOpacity="0.2" />
    <path d="M50 14 A36 36 0 0 1 86 50" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" />
  </svg>,

  // Step 2: Advanced Microchip Processor
  <svg key="cpu" viewBox="0 0 100 100" fill="none" className="h-10 w-10 text-primary">
    <rect x="25" y="25" width="50" height="50" rx="12" stroke="var(--primary)" strokeWidth="3" fill="var(--primary)" fillOpacity="0.05" />
    <rect x="37" y="37" width="26" height="26" rx="6" stroke="var(--primary)" strokeWidth="2" />
    <circle cx="50" cy="50" r="4" fill="var(--primary)" />
    <path d="M12 40 H25 M12 50 H25 M12 60 H25" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M75 40 H88 M75 50 H88 M75 60 H88" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M40 12 V25 M50 12 V25 M60 12 V25" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M40 75 V88 M50 75 V88 M60 75 V88" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" />
  </svg>,

  // Step 3: Overlapping Dual Lightning Bolt
  <svg key="zap" viewBox="0 0 100 100" fill="none" className="h-10 w-10 text-primary">
    <path
      d="M55 12 L28 50 H50 L45 88 L72 50 H50 L55 12Z"
      stroke="var(--primary)"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="var(--primary)"
      fillOpacity="0.08"
    />
    <path
      d="M62 25 L45 50 H60 L55 75"
      stroke="var(--primary)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeOpacity="0.6"
    />
  </svg>
];

export function HowItWorksSection() {
  const { dictionary } = useI18n();
  const hiw = dictionary.landing.howItWorks;
  const steps = Object.values(hiw.steps);

  return (
    <section id="how-it-works" className="relative py-24 md:py-32 overflow-hidden bg-background">
      {/* Background glow highlights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.p variants={fadeInUp} className="text-overline text-primary mb-4 font-semibold tracking-wider">
            {hiw.overline}
          </motion.p>
          <motion.h2 variants={fadeInUp} className="text-display font-display text-foreground">
            {hiw.title}
          </motion.h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mt-20 grid gap-12 md:grid-cols-3 md:gap-8 relative"
        >
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              variants={fadeInUp}
              className="relative group flex flex-col items-center text-center p-6 rounded-2xl border border-border bg-surface-elevated transition-all duration-300 hover:border-primary/20 hover:shadow-lg card-hover-lift"
            >
              {/* Connector line for desktop */}
              {i < steps.length - 1 && (
                <div className="absolute top-12 left-[calc(50%+48px)] hidden h-[1px] w-[calc(100%-48px)] bg-gradient-to-r from-primary/30 to-transparent md:block pointer-events-none" />
              )}

              {/* Step number circle */}
              <div className="relative mb-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-background border border-border shadow-sm group-hover:border-primary/30 transition-colors">
                  <div className="text-primary transition-transform duration-300 group-hover:scale-110">
                    {stepIcons[i]}
                  </div>
                </div>
                <div className="absolute -top-2.5 -right-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-caption font-bold font-mono">
                  {step.number}
                </div>
              </div>

              <h3 className="text-heading-3 font-semibold text-foreground">{step.title}</h3>
              <p className="mt-3 max-w-sm text-body-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
