'use client';

import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { fadeInUp, staggerContainer } from '@/lib/constants';

export function ProblemSection() {
  const { dictionary } = useI18n();
  const problem = dictionary.landing.problem;
  const stats = problem.stats;

  const statItems = [
    { value: stats.crop_loss, label: stats.crop_loss_label, tone: 'text-destructive' },
    { value: stats.affected, label: stats.affected_label, tone: 'text-warning' },
    { value: stats.delay, label: stats.delay_label, tone: 'text-primary' },
  ];

  return (
    <section className="relative overflow-hidden bg-background py-24 md:py-32">
      <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-destructive/5 blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid items-start gap-10 lg:grid-cols-[1.02fr_0.98fr]"
        >
          <div className="max-w-2xl">
            <motion.p variants={fadeInUp} className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-destructive">
              {problem.overline}
            </motion.p>
            <motion.h2 variants={fadeInUp} className="text-[2rem] font-semibold tracking-[-0.03em] text-foreground sm:text-[2.6rem]">
              {problem.title}
            </motion.h2>
            <motion.p variants={fadeInUp} className="mt-6 text-lg leading-8 text-muted-foreground">
              {problem.description}
            </motion.p>
          </div>

          <motion.div variants={fadeInUp} className="rounded-[2rem] border border-border/40 bg-card/70 p-6 shadow-[0_22px_70px_-35px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <div className="space-y-4">
              {statItems.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-border/35 bg-background/70 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">Signal</p>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">{stat.label}</p>
                    </div>
                    <p className={`text-2xl font-semibold tracking-[-0.02em] ${stat.tone}`}>{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
