'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { fadeInUp, staggerContainer } from '@/lib/constants';

export function FAQSection() {
  const { dictionary } = useI18n();
  const data = dictionary.landing.faq;
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-background">
      {/* Background patterns */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-4xl px-6">
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
        </motion.div>

        {/* FAQ List */}
        <div className="mt-16 space-y-4">
          {data.items.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="rounded-2xl border border-border bg-surface-elevated overflow-hidden transition-all duration-300 hover:border-primary/20"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-foreground select-none cursor-pointer"
                >
                  <span className="text-heading-4 font-semibold flex items-center gap-3">
                    <HelpCircle className="h-4.5 w-4.5 text-primary flex-shrink-0" />
                    {item.question}
                  </span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground flex-shrink-0">
                    {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </span>
                </button>
                
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      <div className="border-t border-border/50 px-6 pb-6 pt-4 text-body-sm text-muted-foreground leading-relaxed pl-13">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
