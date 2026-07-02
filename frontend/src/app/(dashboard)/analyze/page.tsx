'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scan, Play, Loader2, Download, CheckCircle2, MapPin, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/contexts/auth-context';
import { useIntelligence } from '@/contexts/intelligence-context';
import { fadeInUp, staggerContainer } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type AnalysisState = 'idle' | 'analyzing' | 'complete';

const loadingSteps = [
  { key: 'weather', duration: 800 },
  { key: 'climate', duration: 1000 },
  { key: 'models', duration: 1200 },
  { key: 'ai', duration: 900 },
  { key: 'preparing', duration: 600 },
];

export default function AnalyzePage() {
  const { dictionary } = useI18n();
  const { profile } = useAuth();
  const { insights, locationLabel, runAnalysis, loading, error, hasLiveData, aiAdvisory } = useIntelligence();
  const a = dictionary.analyze;
  const [state, setState] = useState<AnalysisState>(hasLiveData ? 'complete' : 'idle');
  const [currentStep, setCurrentStep] = useState(0);

  const cropsDict = dictionary.crops;
  const activeCrop = profile?.crop
    ? profile.crop.split(',').map((c) => cropsDict[c.trim() as keyof typeof cropsDict] || c.trim()).join(', ')
    : '—';

  const startAnalysis = async () => {
    setState('analyzing');
    setCurrentStep(0);

    const stepPromise = (async () => {
      for (let i = 0; i < loadingSteps.length; i++) {
        setCurrentStep(i);
        await new Promise((r) => setTimeout(r, loadingSteps[i].duration));
      }
    })();

    try {
      await Promise.all([runAnalysis(), stepPromise]);
      setState('complete');
      toast.success('Analysis complete');
    } catch {
      setState('idle');
    }
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={fadeInUp}>
        <h1 className="text-heading-1">{a.title}</h1>
        <p className="mt-1 text-body text-muted-foreground">{a.subtitle}</p>
      </motion.div>

      <motion.div variants={fadeInUp}>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-heading-4">{profile?.farm_name || 'Active Field'}</h3>
                  <p className="text-body-sm text-muted-foreground">
                    {profile?.farm_area ?? '—'} acres · {activeCrop} · {locationLabel}
                  </p>
                </div>
              </div>

              <Button
                onClick={startAnalysis}
                disabled={state === 'analyzing' || loading}
                className="gap-2"
                size="lg"
              >
                {state === 'analyzing' || loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {a.analyzing}
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    {a.runAnalysis}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {error && (
        <motion.div variants={fadeInUp}>
          <Card className="border-destructive/30 bg-destructive/5">
            <CardContent className="flex items-start gap-3 p-4">
              <AlertCircle className="mt-0.5 h-5 w-5 text-destructive" />
              <div>
                <p className="text-body-sm font-semibold text-foreground">Analysis failed</p>
                <p className="text-body-sm text-muted-foreground">{error}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {state === 'analyzing' && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card>
              <CardContent className="p-8">
                <div className="space-y-6">
                  {loadingSteps.map((step, i) => (
                    <div key={step.key} className="flex items-center gap-4">
                      <div className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300',
                        i < currentStep ? 'bg-success/10 text-success' :
                        i === currentStep ? 'bg-primary/10 text-primary' :
                        'bg-muted text-muted-foreground'
                      )}>
                        {i < currentStep ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : i === currentStep ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <span className="text-caption font-mono">{i + 1}</span>
                        )}
                      </div>
                      <span className={cn(
                        'text-body-sm transition-colors',
                        i <= currentStep ? 'text-foreground' : 'text-muted-foreground'
                      )}>
                        {a.loading[step.key as keyof typeof a.loading]}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {state === 'complete' && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-heading-2">{a.results}</h2>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                {a.download}
              </Button>
            </div>

            {aiAdvisory && (
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Scan className="h-4 w-4 text-primary" />
                    <span className="text-body-sm font-semibold text-foreground">AI Advisory</span>
                  </div>
                  <p className="text-body-sm text-muted-foreground leading-relaxed">{aiAdvisory}</p>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {insights.map((insight) => (
                <Card key={insight.id}>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                        {insight.category}
                      </span>
                      <span className="text-muted-foreground/40 text-[10px] font-mono select-none">|</span>
                      <span className="text-caption text-muted-foreground font-mono">
                        {insight.confidence}% Match
                      </span>
                    </div>
                    <h3 className="text-heading-4">{insight.title}</h3>
                    <p className="mt-2 text-body-sm text-muted-foreground line-clamp-3">
                      {insight.description}
                    </p>
                    <div className="mt-3 rounded-lg bg-surface p-3">
                      <p className="text-caption text-muted-foreground">{insight.action}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
