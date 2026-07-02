'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, Waves, BarChart3, Leaf, Check } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { fadeInUp, staggerContainer } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

const tabIcons: Record<string, ReactNode> = {
  weather: <Cloud className="h-4 w-4" />,
  flood: <Waves className="h-4 w-4" />,
  yield: <BarChart3 className="h-4 w-4" />,
  sustainability: <Leaf className="h-4 w-4" />,
};

export function FeaturesSection() {
  const { dictionary } = useI18n();
  const features = dictionary.landing.features;
  const tabs = features.tabs;
  const tabKeys = Object.keys(tabs) as (keyof typeof tabs)[];
  const [activeTab, setActiveTab] = useState<keyof typeof tabs>('weather');

  const activeData = tabs[activeTab];

  return (
    <section id="features" className="relative overflow-hidden border-y border-border/20 bg-surface py-28 md:py-36">
      <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.p variants={fadeInUp} className="text-[10px] font-semibold uppercase tracking-[0.3em] text-primary">
            {features.overline}
          </motion.p>
          <motion.h2 variants={fadeInUp} className="mt-4 text-[2rem] font-semibold tracking-[-0.03em] text-foreground sm:text-[2.6rem]">
            {features.title}
          </motion.h2>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-12 flex justify-center"
        >
          <div className="inline-flex flex-wrap justify-center gap-1.5 rounded-2xl border border-border/20 bg-card/80 p-1.5 shadow-sm">
            {tabKeys.map((key) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={cn(
                  'flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-semibold transition-all duration-200 select-none',
                  activeTab === key
                    ? 'bg-primary/10 text-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-surface/60 hover:text-foreground'
                )}
              >
                {tabIcons[key]}
                <span>{tabs[key].label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        <div className="mt-14">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="grid items-start gap-10 lg:grid-cols-[0.95fr_1.05fr]"
            >
              <div className="space-y-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">Decision layer</p>
                <h3 className="text-[1.9rem] font-semibold tracking-[-0.03em] text-foreground sm:text-[2.3rem]">
                  {activeData.title}
                </h3>
                <p className="max-w-xl text-lg leading-8 text-muted-foreground">{activeData.description}</p>

                <div className="space-y-3 pt-2">
                  {activeData.metrics.map((metric) => (
                    <div key={metric} className="flex items-center gap-3 rounded-2xl border border-border/35 bg-background/60 px-4 py-3">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full border border-border/30 bg-surface text-muted-foreground">
                        <Check className="h-3 w-3" />
                      </div>
                      <span className="text-sm font-semibold text-foreground">{metric}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="overflow-hidden rounded-[2rem] border border-border/35 bg-card/80 p-6 shadow-[0_25px_70px_-35px_rgba(0,0,0,0.35)] md:p-8">
                  <div className="flex items-center justify-between border-b border-border/35 pb-4">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">Live field view</p>
                      <p className="mt-1 text-sm font-semibold text-foreground">{activeData.label}</p>
                    </div>
                    <div className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">
                      Live
                    </div>
                  </div>
                  <div className="mt-6">
                    <FeaturePreview tab={activeTab} />
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function FeaturePreview({ tab }: { tab: string }) {
  const previewData: Record<string, { label: string; value: string; sub: string }[]> = {
    weather: [
      { label: 'Temperature', value: '32°C', sub: 'Feels like 35°C' },
      { label: 'Humidity', value: '72%', sub: 'Optimal Range' },
      { label: 'Wind Speed', value: '14 km/h', sub: 'From Southwest' },
      { label: 'Rain Probability', value: '85%', sub: 'Next 48 hours' },
    ],
    flood: [
      { label: 'Risk Level', value: 'Moderate', sub: 'Active Alert' },
      { label: 'River Level', value: '4.2m', sub: 'Narmada River' },
      { label: 'Flow Rate', value: '1,240 m³/s', sub: 'Rising steadily' },
      { label: 'Advance Notification', value: '72 hrs', sub: 'District alert sent' },
    ],
    yield: [
      { label: 'Predicted Yield', value: '4.2 t/ac', sub: '+10.5% vs average' },
      { label: 'Confidence Score', value: '87%', sub: 'High accuracy' },
      { label: 'Soil Composition', value: 'Rich', sub: 'Alluvial soil' },
      { label: 'Optimal Window', value: 'Jul 9-11', sub: 'Harvest timeline' },
    ],
    sustainability: [
      { label: 'Sustainability Score', value: '78/100', sub: 'Improving (+5)' },
      { label: 'Water Efficiency', value: '82%', sub: 'Low resource wastage' },
      { label: 'Carbon Offset', value: '71', sub: 'Tons CO2 equivalent' },
      { label: 'Biodiversity Score', value: '84', sub: 'Healthy ecosystem' },
    ],
  };

  const data = previewData[tab] || previewData.weather;

  return (
    <div className="grid grid-cols-2 gap-3 select-none">
      {data.map((item, idx) => (
        <div key={idx} className="rounded-2xl border border-border/25 bg-background/70 p-4 transition-all duration-200 hover:bg-background">
          <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">{item.label}</p>
          <p className="mt-2 text-[1.25rem] font-semibold tracking-[-0.02em] text-foreground">{item.value}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">{item.sub}</p>
        </div>
      ))}
    </div>
  );
}
