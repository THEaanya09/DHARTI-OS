'use client';

import { motion } from 'framer-motion';
import { Leaf, CheckCircle2, FlaskConical } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { fadeInUp, staggerContainer } from '@/lib/constants';

export function SoilFeatureSection() {
  const { dictionary } = useI18n();
  const data = dictionary.landing.soilFeature;

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-background">
      {/* Glow effect */}
      <div className="absolute top-1/3 left-10 h-[400px] w-[400px] rounded-full bg-success/5 blur-[100px] pointer-events-none" />
      
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          
          {/* Left Panel: Soil Stats & Chart Mockup */}
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
                  <FlaskConical className="h-5 w-5 text-success" />
                  <span className="text-heading-4 font-semibold text-foreground">Soil Profile</span>
                </div>
                <div className="flex items-center gap-1 bg-success/15 px-2.5 py-1 rounded-full text-[10px] text-success font-semibold">
                  <span>Nitrogen: Optimal</span>
                </div>
              </div>

              {/* Grid Metrics */}
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
                    <span className="text-[10px] text-success font-medium mt-1 block">
                      {metric.detail}
                    </span>
                  </div>
                ))}
              </div>

              {/* Composition Graph representation */}
              <div className="mt-6 space-y-3">
                <span className="text-caption font-semibold text-muted-foreground">NPK Composition Ratio</span>
                <div className="space-y-2">
                  {[
                    { name: 'Nitrogen (N)', percent: 65, color: 'bg-primary' },
                    { name: 'Phosphorus (P)', percent: 45, color: 'bg-success' },
                    { name: 'Potassium (K)', percent: 80, color: 'bg-info' }
                  ].map((nutrient, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-[11px] font-mono">
                        <span className="text-foreground">{nutrient.name}</span>
                        <span className="text-muted-foreground">{nutrient.percent}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-surface rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${nutrient.percent}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: i * 0.1 }}
                          className={`h-full rounded-full ${nutrient.color}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Ambient decorative glow */}
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-success/5 blur-2xl pointer-events-none" />
          </motion.div>
          
          {/* Right Panel: Content */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="order-1 md:order-2 space-y-6"
          >
            <motion.p variants={fadeInUp} className="text-overline text-success mb-2 font-semibold tracking-wider">
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
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success/10 text-success">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <span className="text-body font-medium text-foreground">Macro-nutrient (N, P, K) satellite calculation</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success/10 text-success">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <span className="text-body font-medium text-foreground">Organic carbon index and pH monitoring</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success/10 text-success">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <span className="text-body font-medium text-foreground">Fertilizer recommendation engine calibrated to crop type</span>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
