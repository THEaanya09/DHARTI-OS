'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useI18n } from '@/lib/i18n';
import { fadeInUp, staggerContainer } from '@/lib/constants';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function SignupPage() {
  const { dictionary } = useI18n();
  const signupText = dictionary.auth.signup;
  const { signUp, loginWithGoogle, loginWithGithub, loading, loadingMessage } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const getPasswordStrength = () => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      await signUp(email, password, name);
    } catch (err) {
      // Errors are handled in useAuth toast
    }
  };

  return (
    <div className="flex min-h-screen bg-background bg-noise">
      {/* Left: Brand panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-info/5 via-background to-primary/10 border-r border-border/50">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 h-[400px] w-[400px] rounded-full bg-info/10 blur-[120px] pointer-events-none float-glow" />
        <div className="relative flex flex-col justify-center px-16 z-10 space-y-12">
          <Link href="/" className="transition-transform duration-150 hover:scale-[1.02]">
            <Logo />
          </Link>
          <div>
            <h2 className="text-display max-w-lg font-display text-foreground leading-tight tracking-tight">
              Every decision starts with{' '}
              <span className="gradient-text">understanding</span>.
            </h2>
            <p className="mt-6 max-w-md text-lg text-muted-foreground leading-relaxed">
              Create your account and connect your farm. Your AI climate advisor is ready.
            </p>
          </div>
          
          {/* Social Proof Stats inside Auth */}
          <div className="grid grid-cols-2 gap-6 border-t border-border/40 pt-8 max-w-sm">
            <div>
              <span className="text-heading-2 font-bold font-mono text-foreground">12,000+</span>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mt-1">Farmers Trust Us</p>
            </div>
            <div>
              <span className="text-heading-2 font-bold font-mono text-foreground">96%</span>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mt-1">Model Accuracy</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Signup form */}
      <div className="flex w-full items-center justify-center px-6 lg:w-1/2">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="w-full max-w-sm"
        >
          <motion.div variants={fadeInUp} className="mb-8 lg:hidden">
            <Link href="/" className="transition-transform duration-150 hover:scale-[1.02]">
              <Logo />
            </Link>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <h1 className="text-heading-1">{signupText.title}</h1>
            <p className="mt-2 text-body text-muted-foreground">{signupText.description}</p>
          </motion.div>

          <motion.form variants={fadeInUp} className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="name">{signupText.name}</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder="Rajesh Kumar"
                  className="pl-10"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{signupText.email}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{signupText.password}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              {password && (
                <div className="space-y-1 pt-1">
                  <div className="h-1 w-full bg-muted rounded-full overflow-hidden flex gap-1">
                    {[1, 2, 3, 4].map((level) => {
                      const strength = getPasswordStrength();
                      const isActive = strength >= level;
                      return (
                        <div
                          key={level}
                          className={cn(
                            "h-full flex-1 rounded-full transition-all duration-300",
                            isActive 
                              ? strength <= 2 ? "bg-destructive" : strength === 3 ? "bg-warning" : "bg-success"
                              : "bg-muted"
                          )}
                        />
                      );
                    })}
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    Password strength: {
                      getPasswordStrength() <= 2 ? "Weak" : getPasswordStrength() === 3 ? "Medium" : "Strong"
                    }
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{signupText.confirmPassword}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full group" size="lg" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {loadingMessage || 'Creating account...'}
                </>
              ) : (
                <>
                  {signupText.submit}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </>
              )}
            </Button>
          </motion.form>

          <motion.p variants={fadeInUp} className="mt-4 text-caption text-muted-foreground text-center">
            {signupText.terms}
          </motion.p>

          <motion.div variants={fadeInUp} className="mt-6">
            <div className="relative">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-4 text-caption text-muted-foreground">
                {signupText.or}
              </span>
            </div>
            <div className="mt-6 flex flex-col gap-3">
              <Button variant="outline" className="w-full" onClick={loginWithGoogle} disabled={loading}>
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                {signupText.google}
              </Button>
            </div>
          </motion.div>

          <motion.p variants={fadeInUp} className="mt-8 text-center text-body-sm text-muted-foreground">
            {signupText.hasAccount}{' '}
            <Link href="/login" className="text-primary font-medium hover:text-primary/80 transition-colors">
              {signupText.loginLink}
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
