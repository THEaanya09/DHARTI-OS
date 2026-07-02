'use client';

import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { staggerContainer, fadeInUp } from '@/lib/constants';
import { WeatherCard } from '@/components/dashboard/weather-card';
import { FloodCard } from '@/components/dashboard/flood-card';
import { YieldCard } from '@/components/dashboard/yield-card';
import { WaterCard } from '@/components/dashboard/water-card';
import { SustainabilityCard } from '@/components/dashboard/sustainability-card';
import { AIDecisionCard } from '@/components/dashboard/ai-decision-card';
import { TimelineCard } from '@/components/dashboard/timeline-card';
import { ChartCard } from '@/components/dashboard/chart-card';
import { PredictionsCard } from '@/components/dashboard/predictions-card';
import { SoilHealthCard } from '@/components/dashboard/soil-health-card';
import { SchemeCard } from '@/components/dashboard/scheme-card';

import { useAuth } from '@/contexts/auth-context';
import { useIntelligence } from '@/contexts/intelligence-context';

function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

export default function DashboardPage() {
  const { dictionary } = useI18n();
  const { profile } = useAuth();
  const { decisionSummary, insights } = useIntelligence();
  const d = dictionary.dashboard;
  const timeKey = getTimeOfDay();
  const greeting = d.greeting
    .replace('{timeOfDay}', d.timeOfDay[timeKey])
    .replace('{name}', profile?.name || 'User');

  const cropsDict = dictionary.crops;
  const activeCropsList = profile?.crop
    ? profile.crop.split(',').map((c) => cropsDict[c.trim() as keyof typeof cropsDict] || c.trim())
    : ['Wheat'];

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-10">
      <motion.div variants={fadeInUp} className="rounded-[2rem] border border-border/40 bg-card/70 p-6 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.35)] backdrop-blur-xl md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">Mission control · {d.timeOfDay[timeKey]}</p>
            <h1 className="mt-4 text-[2rem] font-semibold tracking-[-0.03em] text-foreground sm:text-[2.6rem]">
              {greeting}
            </h1>
            <p className="mt-3 max-w-xl text-base leading-8 text-muted-foreground">{d.subtitle}</p>
          </div>

          <div className="rounded-2xl border border-border/35 bg-background/70 px-4 py-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">Active crops</p>
            <p className="mt-2 text-sm font-semibold text-foreground">{activeCropsList.join(' · ')}</p>
          </div>
        </div>
      </motion.div>

      <div className="space-y-4">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.24em] text-muted-foreground">Field signal</h2>
        <motion.div variants={fadeInUp} className="grid gap-6 md:grid-cols-12">
          <div className="md:col-span-8">
            <AIDecisionCard />
          </div>

          <div className="md:col-span-4 space-y-6">
            <WeatherCard />
            <div className="rounded-[1.5rem] border border-border/35 bg-card/70 p-5 shadow-sm">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">Recommended next step</p>
              <p className="mt-2 text-base font-semibold text-foreground">
                {decisionSummary || insights[0]?.action || 'Run analysis to get field recommendations.'}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="space-y-4">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.24em] text-muted-foreground">Telemetry</h2>
        <motion.div variants={fadeInUp} className="grid gap-6 md:grid-cols-3">
          <FloodCard />
          <WaterCard />
          <SoilHealthCard />
        </motion.div>
      </div>

      <div className="space-y-4">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.24em] text-muted-foreground">Advisory</h2>
        <motion.div variants={fadeInUp} className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <AIDecisionCard />
          <SustainabilityCard />
        </motion.div>
      </div>

      <div className="space-y-4">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.24em] text-muted-foreground">Projection</h2>
        <motion.div variants={fadeInUp} className="grid gap-6">
          <ChartCard />
          <YieldCard />
          <SchemeCard />
        </motion.div>
      </div>

      <div className="space-y-4">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.24em] text-muted-foreground">Planning</h2>
        <motion.div variants={fadeInUp} className="grid gap-6 md:grid-cols-2">
          <TimelineCard />
          <PredictionsCard />
        </motion.div>
      </div>
    </motion.div>
  );
}
