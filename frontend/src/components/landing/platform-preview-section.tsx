'use client';

import { motion } from 'framer-motion';
import { Brain, Check, LayoutDashboard, Scan } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { fadeInUp, staggerContainer } from '@/lib/constants';

export function PlatformPreviewSection() {
  const { dictionary } = useI18n();
  const data = dictionary.landing.platformPreview;

  return (
    <section className="relative overflow-hidden bg-background py-24 md:py-32">
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="absolute left-1/2 top-1/4 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.p variants={fadeInUp} className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-primary">
            {data.overline}
          </motion.p>
          <motion.h2 variants={fadeInUp} className="text-[2rem] font-semibold tracking-[-0.03em] text-foreground sm:text-[2.6rem]">
            {data.title}
          </motion.h2>
          <motion.p variants={fadeInUp} className="mt-6 text-lg leading-8 text-muted-foreground">
            {data.description}
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 mx-auto max-w-6xl"
        >
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="overflow-hidden rounded-[2rem] border border-border/35 bg-sidebar p-4 shadow-[0_35px_90px_-45px_rgba(0,0,0,0.45)] md:p-6">
              <div className="flex items-center gap-2 border-b border-border/50 pb-4">
                <div className="h-3 w-3 rounded-full bg-destructive/60" />
                <div className="h-3 w-3 rounded-full bg-warning/60" />
                <div className="h-3 w-3 rounded-full bg-success/60" />
                <span className="ml-2 text-[11px] font-mono text-muted-foreground">dharti.ai/dashboard</span>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-[0.8fr_1.2fr]">
                <div className="space-y-4">
                  <div className="rounded-2xl border border-border/35 bg-background/80 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">Field pulse</p>
                      <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                    </div>
                    <p className="mt-3 text-[1.45rem] font-semibold tracking-[-0.02em] text-foreground">32°C</p>
                    <p className="mt-1 text-sm text-muted-foreground">Partly cloudy · 72% humidity</p>
                  </div>
                  <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-destructive">Flood alert</p>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">Narmada river level is rising and the next 72 hours suggest moderate risk.</p>
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-border/35 bg-background/80 p-5">
                  <div className="flex items-center justify-between border-b border-border/35 pb-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <Brain className="h-4 w-4 text-primary" />
                      AI recommendation engine
                    </div>
                    <div className="text-[11px] font-mono text-muted-foreground">92% confidence</div>
                  </div>
                  <div className="mt-4 rounded-2xl border border-border/30 bg-surface/70 p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">Precipitation alert</p>
                    <p className="mt-2 text-base font-semibold text-foreground">Postpone scheduled wheat irrigation</p>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">Weather models indicate a strong chance of rainfall in the next 48 hours, making irrigation today counterproductive.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-[2rem] border border-border/35 bg-card/70 p-6 shadow-sm">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <LayoutDashboard className="h-4 w-4 text-primary" />
                  Mission control workflow
                </div>
                <div className="mt-5 space-y-3">
                  {data.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-2xl border border-border/30 bg-background/70 px-4 py-3">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Check className="h-3 w-3" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-[2rem] border border-border/35 bg-card/70 p-6 shadow-sm">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Scan className="h-4 w-4 text-primary" />
                  Decision cadence
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border/30 bg-background/70 p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">Refresh rate</p>
                    <p className="mt-2 text-[1.2rem] font-semibold text-foreground">Every 15 min</p>
                  </div>
                  <div className="rounded-2xl border border-border/30 bg-background/70 p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">Signal depth</p>
                    <p className="mt-2 text-[1.2rem] font-semibold text-foreground">7 layers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
