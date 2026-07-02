'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n';
import { fadeInUp, staggerContainer } from '@/lib/constants';

export function HeroSection() {
  const { dictionary } = useI18n();
  const hero = dictionary.landing.hero;

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background bg-noise px-4 pb-16 pt-24 md:px-6 md:pt-32">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/farmer_bg.png"
          alt="Field background banner"
          className="h-full w-full object-cover object-center opacity-35 mix-blend-multiply dark:opacity-30 dark:mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/5 via-background/20 to-background dark:from-background dark:via-background/70 dark:to-background" />
      </div>

      <div className="absolute inset-0 z-10 bg-grid opacity-20 pointer-events-none" />
      <div className="absolute left-1/2 top-0 h-[360px] w-[760px] -translate-x-1/2 bg-gradient-to-b from-primary/15 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute left-1/2 top-1/4 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="relative z-20 mx-auto w-full max-w-6xl">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="rounded-[2rem] border border-border/40 bg-background/70 px-6 py-8 shadow-[0_30px_90px_-42px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:px-10 md:py-10"
        >
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <motion.p variants={fadeInUp} className="text-sm font-semibold tracking-wider text-muted-foreground">
              Climate intelligence for modern farms
            </motion.p>

            <motion.h1 variants={fadeInUp} className="mt-6 max-w-3xl text-[2.4rem] font-semibold tracking-[-0.03em] text-foreground sm:text-[3.1rem] md:text-[3.9rem] md:leading-[1.02] lg:text-[4.6rem]">
              <span>{hero.title}</span>
              <br />
              <span className="text-primary">{hero.titleHighlight}</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
              {hero.description}
            </motion.p>

            <motion.div variants={fadeInUp} className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/signup">
                <Button size="lg" className="group h-12 px-8 text-[15px] font-medium shadow-lg shadow-primary/15 transition-all duration-200 hover:shadow-xl hover:shadow-primary/25">
                  {hero.cta}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button variant="outline" size="lg" className="h-12 px-8 text-[15px] font-medium border-border/70 bg-background/60 hover:bg-muted/30">
                  {hero.ctaSecondary}
                </Button>
              </a>
            </motion.div>
          </div>

          <motion.div variants={fadeInUp} className="mt-10 grid gap-3 md:grid-cols-3">
            {[
              { key: 'accuracy', val: '96%', label: 'Prediction accuracy' },
              { key: 'farmers', val: '12K+', label: 'Active farms' },
              { key: 'decisions', val: '2M+', label: 'Decisions assisted' },
            ].map((stat) => (
              <div key={stat.key} className="rounded-2xl border border-border/35 bg-card/60 px-4 py-4 text-left">
                <p className="text-[1.35rem] font-semibold tracking-[-0.02em] text-foreground">{stat.val}</p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
