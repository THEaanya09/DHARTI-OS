'use client';

import { motion } from 'framer-motion';
import { CloudRain, CheckCircle2, Droplets } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { fadeInUp, staggerContainer } from '@/lib/constants';

export function WaterFeatureSection() {
  const { dictionary } = useI18n();
  const data = dictionary.landing.waterFeature;

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-surface">
      {/* Glow effect */}
      <div className="absolute top-1/3 right-10 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
      
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          
          {/* Left Panel: Content */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="space-y-6"
          >
            <motion.p variants={fadeInUp} className="text-overline text-primary mb-2 font-semibold tracking-wider">
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
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <span className="text-body font-medium text-foreground">Smart irrigation triggers based on soil sensors</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <span className="text-body font-medium text-foreground">Evapotranspiration rate modeling</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <span className="text-body font-medium text-foreground">Up to 32% groundwater preservation</span>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Right Panel: Irrigation Dashboard Panel */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="relative rounded-2xl border border-border bg-surface-elevated p-6 shadow-xl overflow-hidden shine-border">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <Droplets className="h-5 w-5 text-primary" />
                  <span className="text-heading-4 font-semibold text-foreground">Water Intelligence</span>
                </div>
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
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
                    <span className="text-[10px] text-primary font-medium mt-1 block">
                      {metric.detail}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Recommendation Box */}
              <div className="mt-6 flex gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
                <CloudRain className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-caption font-semibold text-primary">Smart Recommendation</span>
                  <p className="text-body-sm text-muted-foreground mt-0.5">
                    Postpone irrigation. Rain forecast (85% probability) on July 5 will restore optimal soil moisture.
                  </p>
                </div>
              </div>
            </div>

            {/* Ambient decorative glow */}
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-primary/5 blur-2xl pointer-events-none" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
