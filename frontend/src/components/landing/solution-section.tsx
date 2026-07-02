'use client';

import { motion } from 'framer-motion';
import { Satellite, Brain, Target } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { fadeInUp, staggerContainer } from '@/lib/constants';
import type { ReactNode } from 'react';

const icons: Record<string, ReactNode> = {
  satellite: <Satellite className="h-6 w-6" />,
  predictions: <Brain className="h-6 w-6" />,
  decisions: <Target className="h-6 w-6" />,
};

export function SolutionSection() {
  const { dictionary } = useI18n();
  const solution = dictionary.landing.solution;

  return (
    <section className="relative py-24 md:py-32 bg-surface overflow-hidden">
      {/* Subtle glow highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.p variants={fadeInUp} className="text-overline text-primary mb-4 font-semibold tracking-wider">
            {solution.overline}
          </motion.p>
          <motion.h2 variants={fadeInUp} className="text-display font-display text-foreground">
            {solution.title}
          </motion.h2>
          <motion.p variants={fadeInUp} className="mt-6 text-lg text-muted-foreground leading-relaxed">
            {solution.description}
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mt-16 grid gap-8 md:grid-cols-3 relative"
        >
          {Object.entries(solution.features).map(([key, feature], idx) => (
            <motion.div
              key={key}
              variants={fadeInUp}
              className="group relative rounded-2xl border border-border bg-surface-elevated p-8 transition-all duration-300 hover:border-primary/30 hover:shadow-lg card-hover-lift"
            >
              {/* Subtle top indicator glow line */}
              <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                {icons[key]}
              </div>
              
              <h3 className="mt-6 text-heading-3 font-semibold text-foreground">
                {feature.title}
              </h3>
              
              <p className="mt-3 text-body text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
