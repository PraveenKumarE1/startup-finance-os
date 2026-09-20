'use client';

import * as React from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle2, ArrowRight, ArrowLeft, Sparkles, Rocket, Target, Gauge, Building2, CircleDollarSign, PartyPopper } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Startup } from '@/lib/types';

const steps = [
  { icon: Building2, label: 'Company', title: 'Tell us about your company', subtitle: 'Your identity across every report and profile.' },
  { icon: Target, label: 'Round', title: 'Define your fundraising round', subtitle: 'Set the round, valuation, and target you are raising.' },
  { icon: Gauge, label: 'Metrics', title: 'Baseline your metrics', subtitle: 'Your starting point for runway, burn, and growth.' },
  { icon: Rocket, label: 'Launch', title: 'You are ready to launch', subtitle: 'Everything is wired into the OS. Go make it happen.' },
];

function num(v: string): number {
  return Number(String(v).replace(/[^0-9.]/g, '')) || 0;
}

export default function OnboardingPage() {
  const { currentStartup, rounds, updateStartup, addRound, updateRound, addMetricSnapshot } = useAppStore();

  const activeRound = rounds.find((r) => r.status === 'active');

  const [step, setStep] = React.useState(0);

  const [company, setCompany] = React.useState({
    name: currentStartup?.name ?? '',
    description: currentStartup?.description ?? '',
    industry: currentStartup?.industry ?? '',
    website: currentStartup?.website ?? '',
    founder_name: currentStartup?.founder_name ?? '',
    email: currentStartup?.email ?? '',
    stage: currentStartup?.stage ?? 'seed',
  });

  const [round, setRound] = React.useState({
    name: activeRound?.name ?? 'Seed Round',
    instrument: (activeRound?.instrument ?? 'safe') as 'equity' | 'safe' | 'convertible-note' | 'token',
    target: String(activeRound?.target_amount ?? 1500000),
    valuation_pre: String(activeRound?.valuation_pre ?? 10000000),
    raised: String(activeRound?.raised_amount ?? 0),
  });

  const [metrics, setMetrics] = React.useState({
    mrr: '18000',
    burn: '55000',
    cash: '500000',
    customers: '14',
    headcount: '3',
  });

  const saveCompany = () => {
    if (!currentStartup) return;
    updateStartup(currentStartup.id, {
      ...(company.name ? { name: company.name, slug: company.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'my-startup' } : {}),
      description: company.description,
      industry: company.industry,
      website: company.website,
      founder_name: company.founder_name,
      email: company.email,
      stage: company.stage as Startup['stage'],
      updated_at: new Date().toISOString(),
    });
  };

  const saveRound = () => {
    const target = num(round.target);
    const raised = num(round.raised);
    const valuationPre = num(round.valuation_pre);
    if (activeRound) {
      updateRound(activeRound.id, {
        name: round.name,
        instrument: round.instrument,
        target_amount: target,
        raised_amount: Math.min(raised, target),
        valuation_pre: valuationPre,
        valuation_post: valuationPre + target,
        updated_at: new Date().toISOString(),
      });
    } else {
      addRound({
        id: `round-${Date.now()}`,
        startup_id: currentStartup?.id ?? 'demo-startup-1',
        name: round.name,
        target_amount: target,
        raised_amount: Math.min(raised, target),
        currency: 'USD',
        valuation_pre: valuationPre,
        valuation_post: valuationPre + target,
        instrument: round.instrument,
        status: 'active',
        opened_date: new Date().toISOString().split('T')[0],
        investors: [],
        documents: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
  };

  const saveMetrics = () => {
    const mrr = num(metrics.mrr);
    const burn = num(metrics.burn);
    const cash = num(metrics.cash);
    const customers = num(metrics.customers);
    const headcount = num(metrics.headcount);
    addMetricSnapshot({
      id: `m-${Date.now()}`,
      startup_id: currentStartup?.id ?? 'demo-startup-1',
      date: new Date().toISOString().split('T')[0],
      mrr,
      arr: mrr * 12,
      revenue: mrr,
      customers,
      new_customers: 0,
      churned_customers: 0,
      churn_rate: 0,
      cac: 2500,
      ltv: Math.max(1, Math.round(mrr * 6 / Math.max(1, customers))),
      ltv_cac_ratio: Math.max(1, Math.round((mrr * 6 / Math.max(1, customers)) / 2500 * 10) / 10),
      gross_margin: 0.8,
      burn_rate: burn,
      runway_months: Math.round((cash / Math.max(1, burn)) * 10) / 10,
      cash_balance: cash,
      headcount,
      created_at: new Date().toISOString(),
    });
  };

  const canContinue = () => {
    if (step === 0) return company.name.trim().length > 0;
    if (step === 1) return num(round.target) > 0;
    if (step === 2) return true;
    return true;
  };

  const handleNext = () => {
    if (step === 0) saveCompany();
    if (step === 1) saveRound();
    if (step === 2) saveMetrics();
    setStep((s) => s + 1);
  };

  const input = 'bg-background/60 border-border/70 focus-visible:ring-ring';

  return (
    <div className="mx-auto max-w-3xl animate-fade-in-up py-2 space-y-6">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[hsl(38_92%_50%)] via-[hsl(42_95%_58%)] to-[hsl(24_92%_44%)] text-white shadow-gold-glow">
          <Sparkles className="h-7 w-7" />
        </div>
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Founder setup wizard</h1>
        <p className="mt-1 text-muted-foreground">Configure your funding OS in under two minutes.</p>
      </div>

      {/* Progress */}
      <ol className="flex flex-wrap items-center justify-center gap-2 sm:gap-0">
        {steps.map((s, i) => {
          const done = i < step;
          const current = i === step;
          return (
            <li key={s.label} className="flex items-center">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => i < step && setStep(i)}
                  disabled={!done}
                  className={cn(
                    'flex items-center gap-2 rounded-full border px-2 py-1 text-xs font-semibold transition-all',
                    current && 'border-gold-light/60 bg-gold-light/10 text-gold-dark dark:text-gold-light',
                    done && 'border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
                    !done && !current && 'border-border/70 text-muted-foreground/60',
                    !done && 'cursor-default'
                  )}
                >
                  {done ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : (
                    <s.icon className="h-3.5 w-3.5" />
                  )}
                  <span className="hidden sm:inline">{s.label}</span>
                </button>
              </div>
              {i < steps.length - 1 && (
                <span className={cn(
                  'mx-2 hidden h-px w-8 sm:block',
                  done ? 'bg-emerald-500/60' : 'bg-border/60'
                )} />
              )}
            </li>
          );
        })}
      </ol>

      <Card className="edge-highlight overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[hsl(38_92%_50%/0.08)] via-transparent to-[hsl(226_80%_55%/0.08)]" />
        <CardContent className="relative p-6 sm:p-8">
          <div className="mb-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gold-dark dark:text-gold-light">
              Step {step + 1} of {steps.length} · {steps[step].label}
            </p>
            <h2 className="mt-1 font-display text-xl font-bold tracking-tight">{steps[step].title}</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">{steps[step].subtitle}</p>
          </div>

          {step === 0 && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="c-name">Company name *</Label>
                  <Input id="c-name" className={input} value={company.name} onChange={(e) => setCompany({ ...company, name: e.target.value })} placeholder="Acme AI" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="c-stage">Stage</Label>
                  <Select value={company.stage} onValueChange={(v) => setCompany({ ...company, stage: v as Startup['stage'] })}>
                    <SelectTrigger className={input}><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {(['idea', 'pre-seed', 'seed', 'series-a', 'series-b', 'growth'] as const).map((s) => (
                        <SelectItem key={s} value={s}>{s.replace('-', ' ').replace(/^./, (c) => c.toUpperCase())}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="c-desc">One-line description</Label>
                <Input id="c-desc" className={input} value={company.description} onChange={(e) => setCompany({ ...company, description: e.target.value })} placeholder="AI-native accounting for modern finance teams" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="c-industry">Industry</Label>
                  <Input id="c-industry" className={input} value={company.industry} onChange={(e) => setCompany({ ...company, industry: e.target.value })} placeholder="Fintech / B2B SaaS" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="c-website">Website</Label>
                  <Input id="c-website" className={input} value={company.website} onChange={(e) => setCompany({ ...company, website: e.target.value })} placeholder="https://acme.app" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="c-founder">Founder name</Label>
                  <Input id="c-founder" className={input} value={company.founder_name} onChange={(e) => setCompany({ ...company, founder_name: e.target.value })} placeholder="Maya Chen" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="c-email">Founder email</Label>
                  <Input id="c-email" type="email" className={input} value={company.email} onChange={(e) => setCompany({ ...company, email: e.target.value })} placeholder="maya@acme.app" />
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="r-name">Round name</Label>
                  <Input id="r-name" className={input} value={round.name} onChange={(e) => setRound({ ...round, name: e.target.value })} placeholder="Seed Round" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="r-instrument">Instrument</Label>
                  <Select value={round.instrument} onValueChange={(v) => setRound({ ...round, instrument: v as typeof round.instrument })}>
                    <SelectTrigger className={input}><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="safe">SAFE</SelectItem>
                      <SelectItem value="equity">Equity</SelectItem>
                      <SelectItem value="convertible-note">Convertible Note</SelectItem>
                      <SelectItem value="token">Token</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="r-target">Target amount ($)</Label>
                  <Input id="r-target" type="number" className={input} value={round.target} onChange={(e) => setRound({ ...round, target: e.target.value })} placeholder="1500000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="r-raised">Committed so far ($)</Label>
                  <Input id="r-raised" type="number" className={input} value={round.raised} onChange={(e) => setRound({ ...round, raised: e.target.value })} placeholder="0" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="r-valuation">Pre-money valuation ($)</Label>
                <Input id="r-valuation" type="number" className={input} value={round.valuation_pre} onChange={(e) => setRound({ ...round, valuation_pre: e.target.value })} placeholder="10000000" />
                <p className="text-xs text-muted-foreground">
                  Suggested post-money: <span className="tabular-nums text-gold-dark dark:text-gold-light">${(num(round.valuation_pre) + num(round.target)).toLocaleString()}</span>
                </p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="m-mrr">Monthly recurring revenue ($)</Label>
                  <Input id="m-mrr" type="number" className={input} value={metrics.mrr} onChange={(e) => setMetrics({ ...metrics, mrr: e.target.value })} placeholder="18000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="m-customers">Payable customers</Label>
                  <Input id="m-customers" type="number" className={input} value={metrics.customers} onChange={(e) => setMetrics({ ...metrics, customers: e.target.value })} placeholder="14" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="m-burn">Monthly burn ($)</Label>
                  <Input id="m-burn" type="number" className={input} value={metrics.burn} onChange={(e) => setMetrics({ ...metrics, burn: e.target.value })} placeholder="55000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="m-cash">Cash in the bank ($)</Label>
                  <Input id="m-cash" type="number" className={input} value={metrics.cash} onChange={(e) => setMetrics({ ...metrics, cash: e.target.value })} placeholder="500000" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="m-headcount">Headcount</Label>
                <Input id="m-headcount" type="number" className={input} value={metrics.headcount} onChange={(e) => setMetrics({ ...metrics, headcount: e.target.value })} placeholder="3" />
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-muted/30 p-4">
                <Gauge className="h-5 w-5 flex-shrink-0 text-gold-dark dark:text-gold-light" />
                <p className="text-sm text-muted-foreground">
                  Estimated runway: <span className="font-display font-bold tabular-nums text-foreground">{Math.round((num(metrics.cash) / Math.max(1, num(metrics.burn))) * 10) / 10} months</span>
                  {' '}· ARR <span className="font-display font-bold tabular-nums text-foreground">${(num(metrics.mrr) * 12).toLocaleString()}</span>
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg">
                <PartyPopper className="h-8 w-8" />
              </div>
              <h3 className="font-display text-2xl font-bold tracking-tight">
                {company.name || 'Your startup'} is wired up
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                We saved your company profile, {round.name.toLowerCase()} ({round.instrument}), and your baseline metrics. Every module now reflects your numbers.
              </p>
              <div className="mx-auto mt-6 grid max-w-lg gap-3 text-left">
                {[
                  { title: 'Dashboard', desc: 'See KPIs, runway, and round progress', href: '/dashboard' },
                  { title: 'Fundraising CRM', desc: 'Manage your investor pipeline', href: '/dashboard/fundraising' },
                  { title: 'Financial Model', desc: 'Model revenue and burn scenarios', href: '/dashboard/financial-model' },
                  { title: 'Cap Table', desc: 'Ownership and dilution snapshot', href: '/dashboard/cap-table' },
                ].map((c) => (
                  <Link key={c.title} href={c.href} className="group flex items-center justify-between rounded-2xl border border-border/70 bg-muted/20 px-4 py-3 transition-all hover:border-gold-light/60 hover:bg-gold-light/10 hover:shadow-gold-glow">
                    <div>
                      <p className="font-display font-bold">{c.title}</p>
                      <p className="text-xs text-muted-foreground">{c.desc}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-gold-dark dark:group-hover:text-gold-light" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {step < 3 && (
            <div className="mt-8 flex items-center justify-between border-t border-border/60 pt-6">
              <Button variant="ghost" size="sm" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
              <Button variant="gold" size="sm" onClick={handleNext} disabled={!canContinue()}>
                {step === 2 ? 'Finish setup' : 'Continue'} <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}