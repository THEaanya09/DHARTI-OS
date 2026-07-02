'use client';

import { motion } from 'framer-motion';
import { Waves, AlertTriangle, CheckCircle2, Volume2 } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { fadeInUp, staggerContainer } from '@/lib/constants';

export function FloodFeatureSection() {
  const { dictionary } = useI18n();
  const data = dictionary.landing.floodFeature;

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-background">
      {/* Glow effect */}
      <div className="absolute top-1/3 left-10 h-[400px] w-[400px] rounded-full bg-info/5 blur-[100px] pointer-events-none" />
      
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          
          {/* Left Panel: Gauge / Visualizer Mockup */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="order-2 md:order-1 relative"
          >
            <div className="relative rounded-2xl border border-border bg-surface-elevated p-6 shadow-xl overflow-hidden shine-border">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <Waves className="h-5 w-5 text-info" />
                  <span className="text-heading-4 font-semibold text-foreground">Hydrological Monitor</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-warning/10 px-2.5 py-1 text-[10px] font-semibold text-warning">
                  <AlertTriangle className="h-3 w-3 animate-bounce" />
                  <span>Moderate Alert</span>
                </div>
              </div>

              {/* Stats Panel */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                {data.metrics.map((metric, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-border/50 bg-background/50 p-4 transition-colors duration-200 hover:bg-background"
                  >
                    <span className="text-caption text-muted-foreground">{metric.label}</span>
                    <p className="text-heading-3 font-mono font-bold text-foreground mt-1">
                      {metric.value}
                    </p>
                    <span className="text-[10px] text-info font-medium mt-1 block">
                      {metric.detail}
                    </span>
                  </div>
                ))}
              </div>

              {/* Gauge Graphic */}
              <div className="relative flex items-center justify-center mt-6 py-4 rounded-xl border border-border/40 bg-surface/30">
                <div className="relative h-24 w-full overflow-hidden rounded-lg bg-background/40">
                  {/* Wave pattern fill */}
                  <motion.div
                    initial={{ y: '100%' }}
                    whileInView={{ y: '40%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    className="absolute inset-0 bg-gradient-to-t from-info/40 to-info/20"
                  >
                    <div className="absolute top-0 inset-x-0 h-1 bg-info/60 animate-pulse" />
                  </motion.div>
                  
                  {/* Indicators */}
                  <div className="absolute inset-0 flex flex-col justify-between p-3 text-[10px] text-muted-foreground font-mono">
                    <div className="flex justify-between border-b border-destructive/20 pb-0.5 text-destructive">
                      <span>Critical (6.2m)</span>
                      <span>100%</span>
                    </div>
                    <div className="flex justify-between border-b border-warning/20 pb-0.5 text-warning">
                      <span>Watch (4.5m)</span>
                      <span>72%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Normal (2.0m)</span>
                      <span>32%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ambient decorative glow */}
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-info/5 blur-2xl pointer-events-none" />
          </motion.div>
          
          {/* Right Panel: Content */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="order-1 md:order-2 space-y-6"
          >
            <motion.p variants={fadeInUp} className="text-overline text-info mb-2 font-semibold tracking-wider">
              {data.overline}
            </motion.p>
            <motion.h2 variants={fadeInUp} className="text-display font-display text-foreground">
              {data.title}
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-muted-foreground leading-relaxed">
              {data.description}
            </motion.p>
            
            <motion.div variants={fadeInUp} className="space-y-4 pt-4">
              <div className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-info/10 text-info">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <span className="text-body font-medium text-foreground">Hydrological sensor telemetry matching</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-info/10 text-info">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <span className="text-body font-medium text-foreground">Micro-catchment rainfall monitoring</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-info/10 text-info">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <span className="text-body font-medium text-foreground">Automatic district disaster matching and SMS triggers</span>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
