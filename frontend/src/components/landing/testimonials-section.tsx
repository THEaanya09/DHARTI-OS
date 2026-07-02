'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { fadeInUp, staggerContainer } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function TestimonialsSection() {
  const { dictionary } = useI18n();
  const testimonials = dictionary.landing.testimonials;
  const [active, setActive] = useState(0);
  const items = testimonials.items;

  const next = () => setActive((prev) => (prev + 1) % items.length);
  const prev = () => setActive((prev) => (prev - 1 + items.length) % items.length);

  // Auto-play testimonial carousel
  useEffect(() => {
    const timer = setInterval(next, 8000);
    return () => clearInterval(timer);
  }, []);

  const avatarGradients = [
    'bg-gradient-to-tr from-primary/30 to-info/20 text-primary',
    'bg-gradient-to-tr from-info/30 to-success/20 text-info',
    'bg-gradient-to-tr from-success/30 to-primary/20 text-success',
  ];

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-background">
      {/* Background glow highlights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.p variants={fadeInUp} className="text-overline text-primary mb-4 font-semibold tracking-wider">
            {testimonials.overline}
          </motion.p>
          <motion.h2 variants={fadeInUp} className="text-display font-display text-foreground">
            {testimonials.title}
          </motion.h2>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mx-auto mt-16 max-w-3xl"
        >
          <div className="relative rounded-2xl border border-border bg-surface-elevated p-8 md:p-12 shadow-xl glass-premium shine-border">
            <Quote className="absolute top-6 left-6 h-8 w-8 text-primary/10 md:h-12 md:w-12 pointer-events-none" />

            <div className="relative min-h-[160px] md:min-h-[120px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.3 }}
                >
                  <blockquote className="text-lg md:text-xl text-foreground leading-relaxed font-medium">
                    &ldquo;{items[active].quote}&rdquo;
                  </blockquote>

                  <div className="mt-8 flex items-center gap-4">
                    <div className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-full font-display font-bold text-lg border border-border/50 shadow-inner",
                      avatarGradients[active % avatarGradients.length]
                    )}>
                      {items[active].name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-heading-4 font-semibold text-foreground">{items[active].name}</p>
                      <p className="text-caption text-muted-foreground">{items[active].role}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Dots and Arrows */}
            <div className="mt-8 flex items-center justify-between border-t border-border/50 pt-6">
              <div className="flex gap-2">
                {items.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className={cn(
                      'h-1.5 rounded-full transition-all duration-300 cursor-pointer',
                      active === i ? 'w-8 bg-primary' : 'w-1.5 bg-border hover:bg-muted-foreground'
                    )}
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                ))}
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={prev}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={next}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
