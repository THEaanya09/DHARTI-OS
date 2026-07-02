'use client';

import { motion } from 'framer-motion';
import { Clock, AlertTriangle, Database, ShieldAlert } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { fadeInUp, staggerContainer } from '@/lib/constants';
import type { ReactNode } from 'react';

const icons: Record<string, ReactNode> = {
  clock: <Clock className="h-6 w-6" />,
  alert: <AlertTriangle className="h-6 w-6" />,
  database: <Database className="h-6 w-6" />,
  shield: <ShieldAlert className="h-6 w-6" />,
};

export function WhyFarmingFailsSection() {
  const { dictionary } = useI18n();
  const data = dictionary.landing.whyFarmingFails;

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-background">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-destructive/5 blur-[120px] pointer-events-none" />
      
      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.p variants={fadeInUp} className="text-overline text-destructive mb-4 font-semibold tracking-wider">
            {data.overline}
          </motion.p>
          <motion.h2 variants={fadeInUp} className="text-display font-display text-foreground">
            {data.title}
          </motion.h2>
          <motion.p variants={fadeInUp} className="mt-6 text-lg text-muted-foreground leading-relaxed">
            {data.description}
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {data.items.map((item, idx) => (
            <motion.div
              key={idx}
              variants={fadeInUp}
              className="group relative overflow-hidden rounded-2xl border border-border bg-surface-elevated p-6 transition-all duration-300 hover:border-destructive/30 hover:shadow-lg card-hover-lift"
            >
              {/* Top accent glow line */}
              <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-destructive/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive transition-colors duration-300 group-hover:bg-destructive group-hover:text-destructive-foreground">
                {icons[item.icon] || <AlertTriangle className="h-6 w-6" />}
              </div>
              
              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-display-xl font-bold tracking-tight text-destructive font-mono">
                  {item.stat}
                </span>
              </div>
              
              <h3 className="mt-2 text-heading-3 font-semibold text-foreground">
                {item.title}
              </h3>
              
              <p className="mt-3 text-body-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
