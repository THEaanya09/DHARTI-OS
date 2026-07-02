'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Leaf, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n';
import { fadeInUp, staggerContainer } from '@/lib/constants';

export default function NotFound() {
  const { dictionary } = useI18n();
  const err = dictionary.errors['404'];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center relative overflow-hidden">
      {/* Background grids and glowing lights */}
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-md space-y-8"
      >
        {/* Logo */}
        <motion.div variants={fadeInUp} className="flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Leaf className="h-6 w-6" />
          </div>
        </motion.div>

        {/* Heading */}
        <motion.div variants={fadeInUp} className="space-y-3">
          <h1 className="text-[5rem] font-display font-extrabold leading-none tracking-tight text-primary">
            404
          </h1>
          <h2 className="text-heading-2 font-semibold">
            {err.title}
          </h2>
          <p className="text-body text-muted-foreground leading-relaxed max-w-sm mx-auto">
            {err.description}
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row justify-center gap-3">
          <Link href="/dashboard">
            <Button className="w-full sm:w-auto gap-2">
              <Home className="h-4 w-4" />
              {err.home}
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full sm:w-auto gap-2">
              <ArrowLeft className="h-4 w-4" />
              {err.back}
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
