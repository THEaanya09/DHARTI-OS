'use client';

import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { fadeInUp, staggerContainer } from '@/lib/constants';

export function ImpactSection() {
  const { dictionary } = useI18n();
  const data = dictionary.landing.impact;

  return (
    <section id="impact" className="relative py-24 md:py-32 overflow-hidden bg-surface">
      {/* Background glow highlights */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-info/5 blur-[100px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mx-auto max-w-3xl text-center animate-fade-in-up"
        >
          <motion.p variants={fadeInUp} className="text-overline text-primary mb-4 font-semibold tracking-wider">
            {data.overline}
          </motion.p>
          <motion.h2 variants={fadeInUp} className="text-display font-display text-foreground">
            {data.title}
          </motion.h2>
          <motion.p variants={fadeInUp} className="mt-6 text-lg text-muted-foreground leading-relaxed">
            {data.description}
          </motion.p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {data.stats.map((stat, idx) => (
            <motion.div
              key={idx}
              variants={fadeInUp}
              className="group relative overflow-hidden rounded-2xl border border-border bg-surface-elevated p-8 text-center transition-all duration-300 hover:border-primary/30 hover:shadow-lg card-hover-lift"
            >
              {/* Decorative top shimmer line */}
              <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              
              <p className="font-display text-5xl font-extrabold tracking-tight text-primary font-mono select-none">
                {stat.value}
              </p>
              <p className="mt-3 text-body font-semibold text-foreground tracking-tight">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
