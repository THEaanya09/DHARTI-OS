'use client';

import { motion } from 'framer-motion';
import { Landmark, ArrowRight, ShieldCheck } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { fadeInUp, staggerContainer } from '@/lib/constants';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function SchemesSection() {
  const { dictionary } = useI18n();
  const data = dictionary.landing.schemes;

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-surface">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      
      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.p variants={fadeInUp} className="text-overline text-primary mb-4 font-semibold tracking-wider">
            {data.overline}
          </motion.p>
          <motion.h2 variants={fadeInUp} className="text-display font-display text-foreground">
            {data.title}
          </motion.h2>
          <motion.p variants={fadeInUp} className="mt-6 text-lg text-muted-foreground leading-relaxed">
            {data.description}
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {data.items.map((scheme, idx) => (
            <motion.div
              key={idx}
              variants={fadeInUp}
              className="group relative overflow-hidden rounded-2xl border border-border bg-surface-elevated p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg card-hover-lift"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                <Landmark className="h-6 w-6" />
              </div>
              
              <h3 className="mt-6 text-heading-4 font-semibold text-foreground truncate" title={scheme.name}>
                {scheme.name}
              </h3>
              
              <div className="mt-4 space-y-2 border-t border-border/50 pt-4">
                <div className="flex justify-between text-caption">
                  <span className="text-muted-foreground">Benefit:</span>
                  <span className="font-mono font-bold text-foreground">{scheme.benefit}</span>
                </div>
                <div className="flex justify-between text-caption">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-semibold text-primary flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {scheme.status}
                  </span>
                </div>
                <div className="flex justify-between text-caption">
                  <span className="text-muted-foreground">Deadline:</span>
                  <span className="font-medium text-muted-foreground">{scheme.deadline}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 flex justify-center"
        >
          <Link href="/signup">
            <Button size="lg" className="group h-12 px-8 text-[15px] font-medium shadow-lg shadow-primary/20">
              Check Your Eligibility
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
