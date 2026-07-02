'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n';
import { fadeInUp, staggerContainer } from '@/lib/constants';

export function CTASection() {
  const { dictionary } = useI18n();
  const cta = dictionary.landing.cta;

  return (
    <section className="relative py-24 md:py-32 bg-background overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/4 h-64 w-64 rounded-full bg-primary/10 blur-[100px] pointer-events-none float-glow" />
      <div className="absolute bottom-0 right-1/4 h-48 w-48 rounded-full bg-info/10 blur-[80px] pointer-events-none float-glow" />

      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-info/5 p-12 md:p-20 text-center shine-border"
        >
          {/* Animated decorative leaves */}
          <div className="absolute top-6 left-6 text-primary/10 animate-pulse">
            <Leaf className="h-10 w-10" />
          </div>
          <div className="absolute bottom-6 right-6 text-info/10 animate-pulse">
            <Leaf className="h-8 w-8" />
          </div>

          <motion.h2 variants={fadeInUp} className="relative text-display md:text-[2.75rem] font-display text-foreground leading-tight tracking-tight">
            {cta.title}
          </motion.h2>
          
          <motion.p variants={fadeInUp} className="relative mx-auto mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed">
            {cta.description}
          </motion.p>
          
          <motion.div variants={fadeInUp} className="relative mt-10 space-y-4">
            <Link href="/signup">
              <Button size="lg" className="group h-12 px-8 text-[15px] font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all btn-glow">
                {cta.button}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Button>
            </Link>
            <p className="text-caption text-muted-foreground">{cta.note}</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
