import * as React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Orbit,
  Sparkles,
  Workflow,
  BarChart3,
  Zap,
  Users,
  Shield,
  Check,
  BrainCircuit,
  Rocket,
  TimerReset,
} from 'lucide-react';

const features = [
  {
    icon: Workflow,
    title: 'AI workflow engine',
    desc: 'Turn incoming requests, briefs, and tasks into a live operating system that keeps work moving without bottlenecks.',
    color: 'bg-indigo-100 text-indigo-600',
  },
  {
    icon: BarChart3,
    title: 'Revenue forecasting',
    desc: 'Model pipeline health, delivery velocity, and utilization so your team can forecast growth with confidence.',
    color: 'bg-cyan-100 text-cyan-600',
  },
  {
    icon: Zap,
    title: 'Automation builder',
    desc: 'Deploy AI-powered automations across onboarding, follow-ups, status reporting, and recurring client touchpoints.',
    color: 'bg-violet-100 text-violet-600',
  },
  {
    icon: Users,
    title: 'Client command center',
    desc: 'Track every engagement, stakeholder, decision, and milestone in a single workspace built for delivery teams.',
    color: 'bg-emerald-100 text-emerald-600',
  },
  {
    icon: Shield,
    title: 'Risk & delivery health',
    desc: 'Spot delivery risk, project drift, and burn before they become late-stage issues for the client or the team.',
    color: 'bg-amber-100 text-amber-600',
  },
  {
    icon: BrainCircuit,
    title: 'Operational intelligence',
    desc: 'See weekly trends in productivity, workload balance, and client sentiment with decision-ready insights.',
    color: 'bg-pink-100 text-pink-600',
  },
];

const modules = [
  { name: 'Overview', icon: Orbit, desc: 'Your live command center for team performance and delivery.' },
  { name: 'Pipeline', icon: BarChart3, desc: 'Revenue, sales opportunities, and deal momentum in one place.' },
  { name: 'Clients', icon: Users, desc: 'Client relationships, project stages, and relationship history.' },
  { name: 'Automations', icon: Zap, desc: 'AI-generated actions for recurring tasks and campaigns.' },
  { name: 'Team', icon: Users, desc: 'Capacity, workload, utilization, and staffing balance.' },
  { name: 'Reports', icon: Shield, desc: 'Board-ready weekly summaries and leadership updates.' },
];

const pricing = [
  {
    name: 'Starter',
    price: '$0',
    period: '/month',
    desc: 'For small teams getting organized',
    features: ['2 active projects', 'Basic AI automations', 'Team dashboard', 'Email support'],
    cta: 'Try Free',
    highlight: false,
  },
  {
    name: 'Growth',
    price: '$39',
    period: '/seat',
    desc: 'For scaling service businesses',
    features: ['Unlimited projects', 'Smart workflows', 'Forecasting & insights', 'Priority support'],
    cta: 'Start Trial',
    highlight: true,
  },
  {
    name: 'Scale',
    price: '$99',
    period: '/seat',
    desc: 'For multi-team operations',
    features: ['Custom automations', 'Executive reporting', 'White-glove onboarding', 'Advanced integrations'],
    cta: 'Talk to Sales',
    highlight: false,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Orbit className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold">OrbitFlow AI</span>
          </Link>
          <div className="hidden items-center gap-6 md:flex">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground">Features</a>
            <a href="#modules" className="text-sm text-muted-foreground hover:text-foreground">Modules</a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground">Pricing</a>
            <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="hidden text-sm font-medium text-muted-foreground hover:text-foreground sm:block">
              Sign in
            </Link>
            <Link href="/dashboard">
              <span className="inline-flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                Launch App <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="container relative py-24 text-center">
          <div className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Built for agencies, studios, and digital service teams</span>
          </div>
          <h1 className="mx-auto max-w-5xl text-5xl font-bold leading-tight tracking-tight md:text-6xl">
            The AI operating system for{' '}
            <span className="bg-gradient-to-r from-primary via-violet-500 to-cyan-500 bg-clip-text text-transparent">modern service businesses</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Replace fragmented tools with one AI-powered workspace to manage client work, optimize delivery, and grow recurring revenue.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/dashboard">
              <span className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3 text-base font-semibold text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/30">
                Try the Live Demo <ArrowRight className="h-5 w-5" />
              </span>
            </Link>
            <a href="#features" className="inline-flex items-center gap-2 rounded-lg border bg-background px-8 py-3 text-base font-semibold hover:bg-muted">
              Explore Features
            </a>
          </div>
          <div className="mx-auto mt-16 grid max-w-4xl gap-4 sm:grid-cols-2 md:grid-cols-4">
            {[
              { value: '42%', label: 'faster ops cycles' },
              { value: '12k+', label: 'automations launched' },
              { value: '97%', label: 'team alignment score' },
              { value: '4.9/5', label: 'customer love' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border bg-card p-5">
                <p className="text-3xl font-bold text-primary">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="border-t bg-muted/30 py-24">
        <div className="container">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-4xl font-bold tracking-tight">Run the business, not the chaos</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              OrbitFlow gives operations, delivery, and leadership one clear view of what matters next.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="rounded-2xl border bg-card p-6 transition-all hover:shadow-lg hover:shadow-primary/5">
                  <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="modules" className="border-t py-24">
        <div className="container">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-4xl font-bold tracking-tight">Built around how modern teams actually work</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Every module is designed for a real business workflow, not just dashboards for the sake of dashboards.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {modules.map((mod) => {
              const Icon = mod.icon;
              return (
                <Link key={mod.name} href="/dashboard" className="group">
                  <div className="h-full rounded-2xl border bg-card p-6 transition-all hover:border-primary hover:shadow-lg">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                    </div>
                    <h3 className="mb-1 font-semibold">{mod.name}</h3>
                    <p className="text-sm text-muted-foreground">{mod.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="mx-auto mt-14 max-w-2xl text-center">
            <Link href="/dashboard">
              <span className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3 font-semibold text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/30">
                Explore the Dashboard <ArrowRight className="h-5 w-5" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t bg-muted/30 py-24">
        <div className="container">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-4xl font-bold tracking-tight">From lead to launch in one orbit</h2>
            <p className="mt-4 text-lg text-muted-foreground">Every stage of the client lifecycle is visible, measurable, and action-ready.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { step: '01', title: 'Capture demand', desc: 'Collect leads, conversations, and opportunities automatically in a single pipeline.', icon: Rocket },
              { step: '02', title: 'Optimize delivery', desc: 'See team workload, timeline risk, and client milestones before issues hit.', icon: TimerReset },
              { step: '03', title: 'Scale execution', desc: 'Automate follow-ups, generate updates, and turn repeatable work into predictable growth.', icon: Sparkles },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="rounded-2xl border bg-card p-8">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="text-4xl font-bold text-primary/20">{item.step}</span>
                  </div>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="pricing" className="border-t py-24">
        <div className="container">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-4xl font-bold tracking-tight">Simple pricing for teams that want momentum</h2>
            <p className="mt-4 text-lg text-muted-foreground">Start free, then scale as your ops become more complex.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {pricing.map((plan) => (
              <div
                key={plan.name}
                className={
                  plan.highlight
                    ? 'relative rounded-2xl border-2 border-primary bg-card p-8 shadow-xl shadow-primary/10'
                    : 'rounded-2xl border bg-card p-8'
                }
              >
                {plan.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                    Most Popular
                  </span>
                )}
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{plan.desc}</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 shrink-0 text-green-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href="/dashboard" className="mt-8 block">
                  <span className={plan.highlight ? 'inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90' : 'inline-flex w-full items-center justify-center rounded-lg border bg-background px-4 py-2.5 text-sm font-semibold hover:bg-muted'}>
                    {plan.cta}
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="border-t bg-muted/30 py-24">
        <div className="container mx-auto max-w-3xl">
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-bold tracking-tight">Questions from growing teams</h2>
          </div>
          <div className="space-y-3">
            {[
              { q: 'Can this replace our scattered tooling?', a: 'Yes. OrbitFlow centralizes your client work, delivery plans, team capacity, and reporting into one operational layer.' },
              { q: 'Is it useful for agencies and consultancies?', a: 'Absolutely. The platform is built around recurring client workflows, project momentum, and leadership visibility.' },
              { q: 'How does AI help?', a: 'It drafts updates, summarizes work progress, routes tasks, and flags risk before deadlines slip.' },
              { q: 'Can our team collaborate without noise?', a: 'Each project, task, and client interaction is visible in context so the team spends less time searching and more time shipping.' },
              { q: 'Do you support integrations?', a: 'Yes. We support the tools teams already live in, with a growing library for project, CRM, and communication systems.' },
            ].map((item, i) => (
              <details key={i} className="group rounded-xl border bg-card p-5" open={i === 0}>
                <summary className="flex cursor-pointer items-center justify-between font-medium">
                  {item.q}
                  <span className="ml-4 text-primary transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl rounded-3xl border bg-gradient-to-br from-primary/10 via-background to-cyan-500/10 p-12 text-center">
            <h2 className="text-4xl font-bold tracking-tight">Turn operational chaos into momentum</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
              Give your business a clearer operating system so your team can deliver faster, stay aligned, and grow with confidence.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link href="/dashboard">
                <span className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3 text-base font-semibold text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/30">
                  Launch the App <ArrowRight className="h-5 w-5" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t py-12">
        <div className="container grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Orbit className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold">OrbitFlow AI</span>
            </div>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              The AI operating system for service businesses that want better delivery, cleaner ops, and faster growth.
            </p>
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold">Product</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#features" className="hover:text-foreground">Features</a></li>
              <li><a href="#pricing" className="hover:text-foreground">Pricing</a></li>
              <li><a href="/dashboard" className="hover:text-foreground">Live Demo</a></li>
            </ul>
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold">Company</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#faq" className="hover:text-foreground">FAQ</a></li>
              <li><a href="#" className="hover:text-foreground">Contact</a></li>
              <li><a href="#" className="hover:text-foreground">Resources</a></li>
            </ul>
          </div>
        </div>
        <div className="container mt-8 border-t pt-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">© 2026 OrbitFlow AI. Built for teams that move fast.</p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>Next.js 14</span>
            <span>AI Workflow</span>
            <span>Ops Dashboard</span>
          </div>
        </div>
      </footer>
    </div>
  );
}