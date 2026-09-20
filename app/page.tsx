import * as React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  TrendingUp,
  Target,
  Calculator,
  PieChart,
  Gauge,
  Send,
  Sparkles,
  Shield,
  Zap,
  Layers,
  Check,
  Landmark,
  Rocket,
  Scale,
  Users,
} from 'lucide-react';

const features = [
  {
    icon: Target,
    title: 'Fundraising CRM',
    desc: 'Run your raise like a CRO — investor pipeline, term sheet tracking, follow-up cadence, and round progress in one place.',
    tint: 'from-[hsl(38_92%_50%/0.18)] to-[hsl(38_92%_50%/0.05)] text-gold-dark dark:text-gold-light',
  },
  {
    icon: Calculator,
    title: 'Financial modeling',
    desc: 'Build an investor-ready 18-month model with base, bear, and bull scenarios. Watch runway, burn, and dilution in real time.',
    tint: 'from-[hsl(226_80%_55%/0.16)] to-[hsl(226_80%_55%/0.05)] text-[hsl(226_70%_46%)] dark:text-[hsl(226_80%_75%)]',
  },
  {
    icon: PieChart,
    title: 'Cap table management',
    desc: 'Founders, option pools, SAFEs, angels, and VCs — visual ownership, vesting schedules, and dilution scenarios without the spreadsheets.',
    tint: 'from-[hsl(284_72%_55%/0.16)] to-[hsl(284_72%_55%/0.05)] text-[hsl(284_70%_50%)] dark:text-[hsl(284_70%_75%)]',
  },
  {
    icon: Gauge,
    title: 'Metrics dashboard',
    desc: 'MRR, ARR, CAC, LTV, churn, gross margin — the unit economics investors actually ask about, tracked faithfully month over month.',
    tint: 'from-emerald-500/16 to-emerald-500/5 text-emerald-700 dark:text-emerald-400',
  },
  {
    icon: Send,
    title: 'Investor updates',
    desc: 'Templates tuned for boards. Highlights, challenges, and asks, wrapped around live financials and KPIs — sent in minutes.',
    tint: 'from-rose-500/14 to-rose-500/5 text-rose-700 dark:text-rose-400',
  },
  {
    icon: Scale,
    title: 'Dilution & governance',
    desc: 'Model new rounds, compare instruments, and keep every stakeholder on the same page as you raise and grow.',
    tint: 'from-[hsl(226_40%_50%/0.14)] to-[hsl(226_40%_50%/0.05)] text-slate-600 dark:text-slate-300',
  },
];

const modules = [
  { name: 'Overview', icon: TrendingUp, desc: 'Cash, runway, and KPI pulse at a glance.' },
  { name: 'Fundraising', icon: Target, desc: 'Pipeline, deals, and active round progress.' },
  { name: 'Financial Model', icon: Calculator, desc: 'Scenarios, projections, and runway math.' },
  { name: 'Cap Table', icon: PieChart, desc: 'Ownership, vesting, and dilution modeling.' },
  { name: 'Metrics', icon: Gauge, desc: 'Unit economics and trend history.' },
  { name: 'Investor Updates', icon: Send, desc: 'Board-ready reporting, fast.' },
];

const pricing = [
  {
    name: 'Founder',
    price: '$0',
    period: '/forever',
    desc: 'Everything you need to stay organized',
    features: ['1 company', 'Fundraising CRM', 'Cap table (up to 10 holders)', 'Monthly metrics log', 'Email support'],
    cta: 'Launch Free',
    highlight: false,
  },
  {
    name: 'Seed',
    price: '$29',
    period: '/month',
    desc: 'For teams actively raising their first rounds',
    features: ['Everything in Founder', 'Financial modeling + scenarios', 'Vesting schedules & dilution', 'Investor update templates', 'Priority support'],
    cta: 'Start 14-day trial',
    highlight: true,
  },
  {
    name: 'Series',
    price: '$79',
    period: '/month',
    desc: 'For post-seed finance operations',
    features: ['Everything in Seed', 'Multi-round modeling', 'Custom KPI reporting', 'Team permissions & audit log', 'White-glove onboarding'],
    cta: 'Talk to Sales',
    highlight: false,
  },
];

const faqs = [
  { q: 'Is the demo pre-loaded with data?', a: 'Yes. The live demo ships with FinFlow AI — a seed-stage fintech startup with investors, a full cap table, an 18-month model, metrics history, and investor updates. Everything is interactive.' },
  { q: 'Do I need to set up a database?', a: 'No. The demo runs entirely in the browser on pre-loaded demo data, so you can present it anywhere without credentials. The optional Supabase schema is included if you want the real backend.' },
  { q: 'Which startup metrics does it track?', a: 'Cash balance, MRR, ARR, gross margin, CAC, LTV, LTV:CAC, churn, headcount, burn rate, and runway — including month-over-month snapshot history and charts.' },
  { q: 'Can I model fundraising scenarios?', a: 'Absolutely. The financial model supports base, bear, and bull scenarios, plus dilution modeling on the cap table so you can see the impact of a new round before you raise it.' },
  { q: 'Is it built to extend or demo only?', a: 'Both. It runs as a polished, self-contained demo today, and the repository includes a Supabase schema with RLS policies so it can grow into a real multi-tenant product.' },
];

export default function LandingPage() {
  return (
    <div className="theme-ambient min-h-screen text-foreground">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[hsl(38_92%_50%)] via-[hsl(42_95%_58%)] to-[hsl(24_92%_44%)] text-white shadow-gold-glow">
              <TrendingUp className="h-5 w-5" strokeWidth={2.4} />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-display text-[15px] font-bold tracking-tight">StartupFinance OS</span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-dark dark:text-gold-light">Funds · Model · Govern</span>
            </div>
          </Link>
          <div className="hidden items-center gap-7 md:flex">
            {['Features', 'Platform', 'Pricing', 'FAQ'].map((label) => (
              <a
                key={label}
                href={`#${label.toLowerCase()}`}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:block">
              View demo
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-navy-glow"
            >
              Launch App <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(60rem_36rem_at_50%_-8%,black,transparent)]" />
        <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[52rem] -translate-x-1/2 rounded-full bg-[hsl(38_92%_50%/0.14)] blur-[130px]" />
        <div className="container relative py-20 lg:py-28">
          <div className="mx-auto max-w-4xl text-center">
            <a href="#features" className="group mb-6 inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/70 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur transition-colors hover:border-gold/40 hover:text-foreground">
              <Sparkles className="h-3.5 w-3.5 text-gold-dark dark:text-gold-light" />
              Built for early-stage founders · Live demo with investor-ready data
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </a>
            <h1 className="font-display text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              The financial operating system for{' '}
              <span className="text-gradient-gold">early-stage startups</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Fundraising, financial modeling, cap table management, and investor reporting — one premium workspace
              that keeps you raise-ready and board-ready.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="group inline-flex h-12 items-center gap-2 rounded-xl bg-gradient-to-br from-gold-light via-gold to-gold-dark px-7 text-base font-semibold text-white shadow-gold-glow transition-all hover:-translate-y-0.5 hover:shadow-gold-glow dark:text-[hsl(226_45%_10%)]"
              >
                Try the Live Demo
                <ArrowRight className="h-4.5 w-4.5 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="#features"
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-border/70 bg-card/70 px-7 text-base font-semibold backdrop-blur transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:bg-accent/50"
              >
                Explore the platform
              </Link>
            </div>
          </div>

          {/* Floating product preview */}
          <div className="relative mx-auto mt-16 max-w-3xl">
            <div className="animate-float rounded-3xl border border-border/70 bg-card/80 p-6 shadow-hover backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-border/60 pb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[hsl(38_92%_50%)] to-[hsl(24_92%_44%)] text-white">
                    <TrendingUp className="h-4.5 w-4.5 h-5 w-5" strokeWidth={2.4} />
                  </div>
                  <div>
                    <p className="font-display text-sm font-bold">FinFlow AI</p>
                    <p className="text-[11px] text-muted-foreground">Seed · Founders</p>
                  </div>
                </div>
                <span className="chip">
                  <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-emerald-500" />
                  Live demo data
                </span>
              </div>
              <div className="grid gap-4 py-5 sm:grid-cols-4">
                {[
                  { label: 'Cash balance', value: '$1.28M', tone: 'text-emerald-600 dark:text-emerald-400' },
                  { label: 'Monthly revenue', value: '$142k', tone: 'text-gold-dark dark:text-gold-light' },
                  { label: 'Burn rate', value: '$85k/mo', tone: 'text-rose-600 dark:text-rose-400' },
                  { label: 'Runway', value: '15 mo', tone: 'text-[hsl(226_80%_55%)] dark:text-[hsl(226_80%_75%)]' },
                ].map((kpi) => (
                  <div key={kpi.label} className="rounded-2xl border border-border/60 bg-muted/30 p-4">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{kpi.label}</p>
                    <p className={`mt-1.5 font-display text-xl font-bold tabular-nums ${kpi.tone}`}>{kpi.value}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-6 rounded-2xl border border-border/60 bg-muted/20 px-5 py-4">
                {[38, 52, 44, 68, 61, 82, 74].map((h, i) => (
                  <div key={i} className="flex flex-1 items-end justify-center gap-1.5">
                    <div className="h-16 w-full max-w-6 rounded-full bg-gradient-to-t from-[hsl(38_92%_50%/0.35)] to-gold" style={{ height: `${h}px` }} />
                  </div>
                ))}
              </div>
            </div>
            <div className="pointer-events-none absolute -right-6 -top-6 hidden h-24 w-24 rounded-2xl border border-gold/30 bg-gold/10 blur-[1px] md:block" />
          </div>

          {/* Stats */}
          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { value: '18 mo', label: 'model horizon' },
              { value: '8', label: 'finance hub modules' },
              { value: '$3.2M', label: 'demo round target' },
              { value: '0', label: 'backend required' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-border/60 bg-card/60 p-5 text-center backdrop-blur">
                <p className="font-display text-2xl font-bold tabular-nums text-gradient-gold">{stat.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-border/60 bg-background/40 py-24">
        <div className="container">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Every finance domain a founder needs, in one deck
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Stop hopping between spreadsheets, CRMs, and chat threads. StartupFinance OS gives you the full picture.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="group card-hover edge-highlight rounded-2xl border border-border/70 bg-card p-6">
                  <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.tint}`}>
                    <Icon className="h-6 w-6" strokeWidth={2} />
                  </div>
                  <h3 className="mb-2 font-display text-lg font-bold tracking-tight">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Platform modules */}
      <section id="platform" className="border-t border-border/60 py-24">
        <div className="container">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">One workspace, raise-ready end to end</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              From pipeline to projection to partnership agreement — the whole story in context.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {modules.map((mod) => {
              const Icon = mod.icon;
              return (
                <Link key={mod.name} href="/dashboard" className="group">
                  <div className="h-full rounded-2xl border border-border/70 bg-card p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-hover">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[hsl(38_92%_50%/0.16)] to-transparent text-gold-dark dark:text-gold-light">
                        <Icon className="h-5 w-5" strokeWidth={2.1} />
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-gold-dark dark:group-hover:text-gold-light" />
                    </div>
                    <h3 className="mb-1 font-display text-base font-bold">{mod.name}</h3>
                    <p className="text-sm text-muted-foreground">{mod.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="mx-auto mt-14 flex max-w-2xl justify-center">
            <Link
              href="/dashboard"
              className="group inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-7 font-semibold text-primary-foreground shadow-navy-glow transition-all hover:-translate-y-0.5 hover:shadow-hover"
            >
              Open the dashboard <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border/60 bg-background/40 py-24">
        <div className="container">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Raising with conviction, not chaos</h2>
            <p className="mt-4 text-lg text-muted-foreground">A rhythm that scales from first conversation to close.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { step: '01', title: 'Build the model', desc: 'Set an 18-month projection across scenarios and watch runway, burn, and dilution update live.', icon: Calculator },
              { step: '02', title: 'Run the pipeline', desc: 'Track every investor from prospect to term sheet with reminders, notes, and round progress.', icon: Target },
              { step: '03', title: 'Report with confidence', desc: 'Send concise investor updates wired to your real KPIs — highlight what moved the needle.', icon: Send },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="card-hover edge-highlight rounded-2xl border border-border/70 bg-card p-8">
                  <div className="mb-5 flex items-center justify-between">
                    <span className="font-display text-4xl font-bold text-[hsl(38_92%_50%/0.35)]">{item.step}</span>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[hsl(38_92%_50%/0.18)] to-transparent text-gold-dark dark:text-gold-light">
                      <Icon className="h-6 w-6" strokeWidth={2} />
                    </div>
                  </div>
                  <h3 className="mb-2 font-display text-xl font-bold tracking-tight">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-border/60 py-24">
        <div className="container">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Pricing that respects the burn</h2>
            <p className="mt-4 text-lg text-muted-foreground">Start free. Upgrade when the first term sheet lands.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {pricing.map((plan) => (
              <div
                key={plan.name}
                className={
                  plan.highlight
                    ? 'relative rounded-3xl border border-gold/50 bg-card p-8 shadow-gold-glow'
                    : 'card-hover relative rounded-3xl border border-border/70 bg-card p-8'
                }
              >
                {plan.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-gold-light to-gold-dark px-3 py-1 text-xs font-bold text-white shadow-gold-glow dark:text-[hsl(226_45%_10%)]">
                    Most Popular
                  </span>
                )}
                <h3 className="font-display text-lg font-bold">{plan.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{plan.desc}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-display text-4xl font-bold tabular-nums">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm">
                      <span className="mt-0.5 flex h-4.5 w-4.5 h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/12 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href="/dashboard" className="mt-8 block">
                  <span
                    className={
                      plan.highlight
                        ? 'inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-br from-gold-light via-gold to-gold-dark px-4 py-3 text-sm font-bold text-white shadow-gold-glow transition-all hover:-translate-y-0.5 dark:text-[hsl(226_45%_10%)]'
                        : 'inline-flex w-full items-center justify-center rounded-xl border border-border/70 bg-background px-4 py-3 text-sm font-bold transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-accent'
                    }
                  >
                    {plan.cta}
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-border/60 bg-background/40 py-24">
        <div className="container mx-auto max-w-3xl">
          <div className="mb-14 text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Questions founders ask</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((item, i) => (
              <details key={i} className="group card-hover rounded-2xl border border-border/70 bg-card p-5" open={i === 0}>
                <summary className="flex cursor-pointer items-center justify-between font-display text-[15px] font-bold">
                  {item.q}
                  <span className="ml-4 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-border/70 font-sans text-sm font-medium text-muted-foreground transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/60 py-24">
        <div className="container">
          <div className="relative mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-border/70 px-8 py-14 text-center shadow-hover">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[hsl(38_92%_50%/0.14)] via-background to-[hsl(226_80%_55%/0.10)]" />
            <div className="pointer-events-none absolute -top-16 left-1/2 h-40 w-[32rem] -translate-x-1/2 rounded-full bg-[hsl(38_92%_50%/0.18)] blur-[100px]" />
            <div className="relative">
              <Rocket className="mx-auto mb-5 h-10 w-10 text-gold-dark dark:text-gold-light" />
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Turn fundraising chaos into a clear flight path
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
                Open the live demo — explore every module with investor-ready demo data, then make it yours.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link
                  href="/dashboard"
                  className="group inline-flex h-12 items-center gap-2 rounded-xl bg-gradient-to-br from-gold-light via-gold to-gold-dark px-7 font-semibold text-white shadow-gold-glow transition-all hover:-translate-y-0.5 dark:text-[hsl(226_45%_10%)]"
                >
                  <Zap className="h-4.5 w-4.5 h-5 w-5" /> Launch the demo
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 py-14">
        <div className="container grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[hsl(38_92%_50%)] to-[hsl(24_92%_44%)] text-white shadow-gold-glow">
                <TrendingUp className="h-5 w-5" strokeWidth={2.4} />
              </div>
              <div className="leading-tight">
                <p className="font-display text-[15px] font-bold tracking-tight">StartupFinance OS</p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-dark dark:text-gold-light">Funds · Model · Govern</p>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              The financial operating system for early-stage startups — fundraising, modeling, cap tables, and reporting
              in one premium workspace.
            </p>
          </div>
          <div>
            <p className="mb-4 text-sm font-bold">Platform</p>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><Link href="/dashboard/fundraising" className="transition-colors hover:text-foreground">Fundraising</Link></li>
              <li><Link href="/dashboard/financial-model" className="transition-colors hover:text-foreground">Financial Model</Link></li>
              <li><Link href="/dashboard/cap-table" className="transition-colors hover:text-foreground">Cap Table</Link></li>
              <li><Link href="/dashboard/metrics" className="transition-colors hover:text-foreground">Metrics</Link></li>
            </ul>
          </div>
          <div>
            <p className="mb-4 text-sm font-bold">Resources</p>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><a href="#features" className="transition-colors hover:text-foreground">Features</a></li>
              <li><a href="#pricing" className="transition-colors hover:text-foreground">Pricing</a></li>
              <li><Link href="/dashboard" className="transition-colors hover:text-foreground">Live Demo</Link></li>
              <li><a href="#faq" className="transition-colors hover:text-foreground">FAQ</a></li>
            </ul>
          </div>
        </div>
        <div className="container mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border/60 pt-6">
          <p className="text-sm text-muted-foreground">© 2026 StartupFinance OS · Built for founders in motion</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5" /> Demo data only</span>
            <span className="flex items-center gap-1.5"><Layers className="h-3.5 w-3.5" /> Next.js 14</span>
            <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> Founder-first</span>
          </div>
        </div>
      </footer>
    </div>
  );
}