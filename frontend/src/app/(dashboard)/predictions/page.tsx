'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Cpu, Target, ChevronDown, ChevronUp, AlertCircle, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useI18n } from '@/lib/i18n';
import { useIntelligence } from '@/contexts/intelligence-context';
import { fadeInUp, staggerContainer } from '@/lib/constants';
import { cn } from '@/lib/utils';

export default function PredictionsPage() {
  const { dictionary } = useI18n();
  const { predictions, hasLiveData, loading } = useIntelligence();
  const p = dictionary.predictions_page;
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (predictions.length > 0 && expandedIds.size === 0) {
      setExpandedIds(new Set([predictions[0].id]));
    }
  }, [predictions, expandedIds.size]);

  const toggleExpand = (id: string) => {
    const next = new Set(expandedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setExpandedIds(next);
  };

  const filtered = predictions.filter((pred) => {
    const matchesSearch = pred.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pred.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || pred.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-8 select-none">
      <motion.div variants={fadeInUp} className="rounded-[2rem] border border-border/40 bg-card/70 p-6 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.35)] backdrop-blur-xl md:p-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Mission intelligence
            </div>
            <h1 className="mt-4 text-[2rem] font-semibold tracking-[-0.03em] text-foreground sm:text-[2.6rem]">{p.title}</h1>
            <p className="mt-3 text-base leading-8 text-muted-foreground">{p.subtitle}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: 'High confidence', value: hasLiveData && predictions[0] ? `${predictions[0].confidence}%` : loading ? '…' : '—' },
              { label: 'Active alerts', value: String(predictions.filter((pred) => pred.risk_level === 'high' || pred.risk_level === 'critical').length) },
              { label: 'Next action', value: hasLiveData ? 'Review advisory' : loading ? '…' : 'Run analysis' },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-border/35 bg-background/70 px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">{item.label}</p>
                <p className="mt-2 text-base font-semibold text-foreground">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div variants={fadeInUp} className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={p.search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-10 rounded-2xl border-border/35 bg-card/60 pl-10 text-sm focus:border-primary/40 focus:bg-card"
          />
        </div>
        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v || 'all')}>
          <SelectTrigger className="h-10 w-full rounded-2xl border-border/35 bg-card/60 text-sm sm:w-48">
            <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder={p.filter} />
          </SelectTrigger>
          <SelectContent className="border-border/35 bg-card text-sm">
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="weather">Weather</SelectItem>
            <SelectItem value="yield">Yield</SelectItem>
            <SelectItem value="flood">Flood</SelectItem>
            <SelectItem value="drought">Drought</SelectItem>
            <SelectItem value="pest">Pest</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      <motion.div variants={fadeInUp} className="relative space-y-4 pl-6">
        <div className="absolute bottom-2 left-1.5 top-2 w-px bg-border/20" />

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[1.75rem] border border-border/20 bg-card/70 p-12 text-center">
            <Cpu className="mb-3 h-8 w-8 text-muted-foreground/30" />
            <h3 className="text-base font-semibold text-muted-foreground">{p.empty}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{p.emptyDescription}</p>
          </div>
        ) : (
          filtered.map((pred) => {
            const isExpanded = expandedIds.has(pred.id);
            const dateStr = new Date(pred.created_at).toLocaleDateString('en', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            const formattedType = pred.type === 'weather' ? 'Weather forecast' :
              pred.type === 'yield' ? 'Yield projection' :
              pred.type === 'flood' ? 'Flood risk assessment' :
              pred.type === 'pest' ? 'Pest risk analysis' :
              pred.type === 'drought' ? 'Drought hazard assessment' : 'Climate report';

            return (
              <div key={pred.id} className="group relative">
                <div className={cn(
                  'absolute -left-[28.5px] top-[18px] z-10 h-2.5 w-2.5 rounded-full border border-background transition-colors duration-200',
                  isExpanded ? 'bg-primary' : 'bg-muted-foreground/40 group-hover:bg-muted-foreground'
                )} />

                <div className="overflow-hidden rounded-[1.5rem] border border-border/30 bg-card/60 transition-all duration-200 hover:border-border/40 hover:bg-card">
                  <div onClick={() => toggleExpand(pred.id)} className="flex cursor-pointer items-start justify-between gap-4 p-5 select-none">
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                        <span>{formattedType}</span>
                        <span>·</span>
                        <span>{dateStr}</span>
                      </div>
                      <h3 className="text-base font-semibold text-foreground transition-colors group-hover:text-primary">
                        {pred.title}
                      </h3>
                      <p className="text-sm leading-7 text-muted-foreground">{pred.summary}</p>
                    </div>

                    <div className="flex flex-shrink-0 items-center gap-5">
                      <div className="hidden items-center gap-3 text-[11px] font-semibold text-muted-foreground sm:flex">
                        <span className="flex items-center gap-1.5 font-mono">
                          <Target className="h-3.5 w-3.5" />
                          {pred.confidence}% conf.
                        </span>
                        <span className="rounded-full border border-border/35 bg-background/70 px-2.5 py-1 text-foreground capitalize">
                          {pred.risk_level} risk
                        </span>
                      </div>
                      <div className="text-muted-foreground group-hover:text-foreground">
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </div>
                    </div>
                  </div>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="overflow-hidden border-t border-border/10 bg-background/40"
                      >
                        <div className="space-y-6 border-l-2 border-primary/70 p-6 text-sm text-muted-foreground">
                          <div className="space-y-2">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">Executive summary</p>
                            <p className="text-base font-semibold leading-8 text-foreground">{pred.summary}</p>
                          </div>

                          <div className="grid gap-6 sm:grid-cols-2">
                            <div className="space-y-2 rounded-2xl border border-border/30 bg-card/70 p-4">
                              <div className="flex items-center justify-between text-sm font-medium">
                                <span className="text-foreground">Forecast confidence</span>
                                <span className="font-mono font-semibold text-foreground">{pred.confidence}%</span>
                              </div>
                              <div className="h-1.5 overflow-hidden rounded-full bg-background">
                                <div className="h-full bg-primary" style={{ width: `${pred.confidence}%` }} />
                              </div>
                            </div>
                            {pred.accuracy && (
                              <div className="space-y-2 rounded-2xl border border-border/30 bg-card/70 p-4">
                                <div className="flex items-center justify-between text-sm font-medium">
                                  <span className="text-foreground">Historical accuracy</span>
                                  <span className="font-mono font-semibold text-foreground">{pred.accuracy}%</span>
                                </div>
                                <div className="h-1.5 overflow-hidden rounded-full bg-background">
                                  <div className="h-full bg-primary" style={{ width: `${pred.accuracy}%` }} />
                                </div>
                              </div>
                            )}
                          </div>

                          {pred.insights && pred.insights.length > 0 ? (
                            <div className="space-y-3.5">
                              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">AI action protocol</p>
                              {pred.insights.map((insight, index) => (
                                <div key={index} className="space-y-3 rounded-2xl border border-border/30 bg-card/70 p-4">
                                  <div className="flex items-start gap-2.5">
                                    <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                                    <div className="space-y-1">
                                      <p className="font-semibold text-foreground">{insight.title}</p>
                                      <p className="leading-7 text-muted-foreground">{insight.description}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-start gap-2 border-t border-border/20 pt-3 text-sm">
                                    <span className="font-semibold uppercase tracking-[0.2em] text-foreground">Action:</span>
                                    <span className="leading-7 text-muted-foreground">{insight.action}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">Suggested action</p>
                              <div className="rounded-2xl border border-border/30 bg-card/70 p-4 text-sm leading-7 text-muted-foreground">
                                {pred.summary}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })
        )}
      </motion.div>
    </motion.div>
  );
}
