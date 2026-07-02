'use client';

import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, HelpCircle, CheckCircle2 } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { fadeInUp, staggerContainer } from '@/lib/constants';

export function YieldFeatureSection() {
  const { dictionary } = useI18n();
  const data = dictionary.landing.yieldFeature;

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
                <span className="text-body font-medium text-foreground">Satellite and ground sensor calibration</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <span className="text-body font-medium text-foreground">Real-time market price integration</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <span className="text-body font-medium text-foreground">MSP tracking and crop value alerts</span>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Right Panel: Interactive Dashboard UI Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="relative rounded-2xl border border-border bg-surface-elevated p-6 shadow-xl overflow-hidden shine-border">
              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <span className="text-heading-4 font-semibold text-foreground">Yield Analytics</span>
                </div>
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              </div>
              
              {/* Card Grid Stats */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                {data.metrics.map((metric, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-border/50 bg-background/50 p-4 transition-colors duration-200 hover:bg-background"
                  >
                    <span className="text-caption text-muted-foreground">{metric.label}</span>
                    <p className="text-heading-2 font-mono font-bold text-foreground mt-1">
                      {metric.value}
                    </p>
                    <span className="text-[10px] text-primary font-medium mt-1 block">
                      {metric.detail}
                    </span>
                  </div>
                ))}
              </div>
              
              {/* Simulated Chart visual */}
              <div className="mt-6 h-28 w-full flex items-end gap-1">
                {[30, 45, 35, 60, 50, 75, 90, 85, 95].map((val, idx) => (
                  <div key={idx} className="flex-1 bg-surface rounded-t-md relative group h-full flex items-end">
                    <motion.div
                      initial={{ height: 0 }}
                      whileInView={{ height: `${val}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: idx * 0.05 }}
                      className="w-full bg-gradient-to-t from-primary/30 to-primary rounded-t-sm"
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground mt-2 px-1">
                <span>Week 1</span>
                <span>Week 4</span>
                <span>Week 8</span>
                <span>Week 12</span>
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
