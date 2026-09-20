'use client';

import * as React from 'react';
import { useAppStore } from '@/lib/store';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Wallet,
  TrendingUp,
  Flame,
  Hourglass,
  Target,
  Calculator,
  PieChart,
  Gauge,
  Send,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Users,
  Landmark,
} from 'lucide-react';
import { formatCurrency, formatNumber, formatPercent, calculateMonthsOfRunway } from '@/lib/utils';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart as RPieChart,
  Pie,
  Cell,
} from 'recharts';

const runwayData = [
  { month: 'Jul', revenue: 48000, burn: 61000 },
  { month: 'Aug', revenue: 61000, burn: 68000 },
  { month: 'Sep', revenue: 74000, burn: 72000 },
  { month: 'Oct', revenue: 89000, burn: 74000 },
  { month: 'Nov', revenue: 104000, burn: 78000 },
  { month: 'Dec', revenue: 121000, burn: 82000 },
  { month: 'Jan', revenue: 142000, burn: 85000 },
];

export default function DashboardPage() {
  const { currentStartup, metrics, rounds, investors, capTable } = useAppStore();
  const latest = metrics[metrics.length - 1];
  const activeRound = rounds.find((r) => r.status === 'active') ?? rounds[0];
  const capSummary = capTable.reduce<Record<string, number>>((acc, e) => {
    const key = e.entity_type;
    acc[key] = (acc[key] ?? 0) + (e.percentage ?? 0);
    return acc;
  }, {});
  const totalPct = Math.round(capTable.reduce((a, e) => a + (e.percentage ?? 0), 0));
  const investorsActive = investors.filter((i) => i.status !== 'passed' && i.status !== 'invested').length;

  const kpis = [
    {
      name: 'Cash balance',
      icon: Wallet,
      tint: 'from-emerald-500/15 to-emerald-500/5 text-emerald-600 dark:text-emerald-400',
      value: formatCurrency(latest?.cash_balance ?? 0),
      change: '+12.4%',
      delta: 'up',
      note: `Runway ${calculateMonthsOfRunway(latest?.cash_balance ?? 0, latest?.burn_rate ?? 1)}`,
    },
    {
      name: 'Monthly revenue',
      icon: TrendingUp,
      tint: 'from-[hsl(38_92%_50%/0.18)] to-[hsl(38_92%_50%/0.05)] text-gold-dark dark:text-gold-light',
      value: formatCurrency(latest?.mrr ?? 0),
      change: '+18.2%',
      delta: 'up',
      note: `${formatCurrency((latest?.arr ?? 0) * 1.0)} ARR run-rate`,
    },
    {
      name: 'Burn rate',
      icon: Flame,
      tint: 'from-rose-500/15 to-rose-500/5 text-rose-600 dark:text-rose-400',
      value: formatCurrency(latest?.burn_rate ?? 0) + '/mo',
      change: '-9.1%',
      delta: 'down',
      note: 'Cash-efficient last quarter',
    },
    {
      name: 'Customers',
      icon: Users,
      tint: 'from-[hsl(226_80%_55%/0.15)] to-[hsl(226_80%_55%/0.05)] text-[hsl(226_70%_48%)] dark:text-[hsl(226_80%_75%)]',
      value: formatNumber(latest?.customers ?? 0),
      change: `+${latest?.new_customers ?? 0}`,
      delta: 'up',
      note: `${formatPercent(latest?.churn_rate ?? 0)} churn`,
    },
  ];

  const ownershipData = Object.entries(capSummary).map(([key, value]) => ({
    name: key.replace('-', ' '),
    value: Math.round(value),
  }));
  const OWNERSHIP_COLORS = ['hsl(38 92% 50%)', 'hsl(226 80% 60%)', 'hsl(160 80% 45%)', 'hsl(284 72% 55%)'];

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Overview</h1>
            <Badge variant="warning">
              <Sparkles className="h-3 w-3" /> Seed · Demo
            </Badge>
          </div>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Welcome back, {currentStartup?.founder_name?.split(' ')[0] ?? 'founder'} — here&apos;s the pulse of{' '}
            <span className="font-medium text-foreground">{currentStartup?.name}</span>.
          </p>
        </div>
        <Button asChild variant="gold" className="shadow-gold-glow">
          <Link href="/dashboard/fundraising">
            <Target className="h-4 w-4" /> Add Investor
          </Link>
        </Button>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          const deltaColor = kpi.delta === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400';
          const DeltaIcon = kpi.delta === 'up' ? ArrowUpRight : ArrowDownRight;
          return (
            <Card key={kpi.name} className="card-hover edge-highlight overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${kpi.tint}`}>
                    <Icon className="h-5 w-5" strokeWidth={2.2} />
                  </div>
                  <span className="inline-flex items-center gap-0.5 rounded-full border border-border/60 bg-card/60 px-2 py-0.5 text-[11px] font-semibold tabular-nums">
                    <DeltaIcon className={`h-3 w-3 ${deltaColor}`} />
                    <span className={deltaColor}>{kpi.change}</span>
                  </span>
                </div>
                <p className="mt-4 text-[13px] font-medium text-muted-foreground">{kpi.name}</p>
                <p className="mt-0.5 font-display text-[26px] font-bold leading-none tracking-tight tabular-nums">{kpi.value}</p>
                <p className="mt-2 text-xs text-muted-foreground">{kpi.note}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Revenue & burn + fundraising round */}
      <div className="grid gap-4 lg:grid-cols-7">
        <Card className="lg:col-span-4 edge-highlight">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Revenue vs burn</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">Last 7 months · trailing trend</p>
            </div>
            <Badge variant="outline" className="tabular-nums">{formatCurrency(142000)} / {formatCurrency(85000)}</Badge>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={runwayData} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(38 92% 50%)" stopOpacity={0.32} />
                      <stop offset="95%" stopColor="hsl(38 92% 50%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="burnFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(160 80% 45%)" stopOpacity={0.22} />
                      <stop offset="95%" stopColor="hsl(160 80% 45%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-border/60" vertical={false} />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} width={44} />
                  <Tooltip
                    formatter={(value: number, name: string) => [formatCurrency(value), name === 'burn' ? 'Burn' : 'Revenue']}
                    labelFormatter={(label) => label}
                    cursor={{ stroke: 'hsl(var(--ring))', strokeWidth: 1 }}
                    contentStyle={{
                      background: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '12px',
                      boxShadow: '0 12px 32px -12px hsl(226 45% 12% / 0.3)',
                      fontSize: 13,
                    }}
                  />
                  <Area type="monotone" dataKey="burn" stroke="hsl(160 80% 45%)" strokeWidth={2.5} fillOpacity={1} fill="url(#burnFill)" name="burn" />
                  <Area type="monotone" dataKey="revenue" stroke="hsl(38 92% 50%)" strokeWidth={2.5} fillOpacity={1} fill="url(#revFill)" name="revenue" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 card-hover edge-highlight">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Fundraising round</CardTitle>
                <p className="mt-1 text-xs text-muted-foreground">{activeRound?.name ?? 'Active round'}</p>
              </div>
              <Landmark className="h-5 w-5 text-gold-dark dark:text-gold-light" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <p className="font-display text-3xl font-bold tabular-nums">
                  {formatCurrency(activeRound?.raised_amount ?? 0, 'USD', 0)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  of {formatCurrency(activeRound?.target_amount ?? 0, 'USD', 0)} target
                </p>
              </div>
              <Badge variant="warning" className="text-[11px]">
                {Math.round(((activeRound?.raised_amount ?? 0) / Math.max(1, activeRound?.target_amount ?? 1)) * 100)}%
              </Badge>
            </div>
            <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light"
                style={{ width: `${Math.min(100, ((activeRound?.raised_amount ?? 0) / Math.max(1, activeRound?.target_amount ?? 1)) * 100)}%` }}
              />
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border/60 bg-muted/40 p-3">
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Active investors</p>
                <p className="mt-1 font-display text-xl font-bold tabular-nums">{investorsActive}</p>
              </div>
              <div className="rounded-xl border border-border/60 bg-muted/40 p-3">
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Pre-money val.</p>
                <p className="mt-1 font-display text-xl font-bold tabular-nums">
                  {activeRound?.valuation_pre ? formatCurrency(activeRound.valuation_pre) : '—'}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="mt-4 w-full" asChild>
              <Link href="/dashboard/fundraising">Open pipeline <ArrowUpRight className="h-3.5 w-3.5" /></Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Ownership + key metrics */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="card-hover edge-highlight">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Ownership mix</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">{capTable.length} stakeholders · {totalPct}% allocated</p>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/cap-table">Manage <ArrowUpRight className="h-3.5 w-3.5" /></Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-6 sm:flex-row">
              <div className="relative h-40 w-40 flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <RPieChart>
                    <Pie data={ownershipData} dataKey="value" nameKey="name" innerRadius={52} outerRadius={74} paddingAngle={3} strokeWidth={0}>
                      {ownershipData.map((_, i) => (
                        <Cell key={i} fill={OWNERSHIP_COLORS[i % OWNERSHIP_COLORS.length]} />
                      ))}
                    </Pie>
                  </RPieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="font-display text-lg font-bold tabular-nums">{totalPct}%</p>
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">diluted</p>
                  </div>
                </div>
              </div>
              <div className="w-full space-y-2.5">
                {ownershipData.map((item, i) => (
                  <div key={item.name} className="flex items-center gap-3">
                    <span
                      className="h-3 w-3 rounded-[4px]"
                      style={{ background: OWNERSHIP_COLORS[i % OWNERSHIP_COLORS.length] }}
                    />
                    <span className="flex-1 text-sm font-medium capitalize">{item.name}</span>
                    <span className="font-display text-sm font-bold tabular-nums">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover edge-highlight">
          <CardHeader>
            <CardTitle>Unit economics</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">Most recent snapshot</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'MRR', value: formatCurrency(latest?.mrr ?? 0), accent: 'text-gold-dark dark:text-gold-light' },
                { label: 'ARR', value: formatCurrency(latest?.arr ?? 0), accent: 'text-[hsl(226_80%_55%)] dark:text-[hsl(226_80%_75%)]' },
                { label: 'Gross margin', value: formatPercent(latest?.gross_margin ?? 0), accent: 'text-emerald-600 dark:text-emerald-400' },
                { label: 'CAC', value: formatCurrency(latest?.cac ?? 0), accent: 'text-rose-600 dark:text-rose-400' },
                { label: 'LTV', value: formatCurrency(latest?.ltv ?? 0), accent: 'text-[hsl(284_72%_55%)] dark:text-[hsl(284_70%_75%)]' },
                { label: 'LTV : CAC', value: `${(latest?.ltv_cac_ratio ?? 0).toFixed(2)}x`, accent: 'text-[hsl(160_80%_45%)] dark:text-emerald-400' },
                { label: 'Churn', value: formatPercent(latest?.churn_rate ?? 0), accent: 'text-rose-600 dark:text-rose-400' },
                { label: 'Headcount', value: formatNumber(latest?.headcount ?? 0), accent: 'text-foreground' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl border border-border/60 bg-muted/30 p-4">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{stat.label}</p>
                  <p className={`mt-1 font-display text-xl font-bold tabular-nums ${stat.accent}`}>{stat.value}</p>
                </div>
              ))}
            </div>
            <Separator className="my-5" />
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/metrics"><Gauge className="h-3.5 w-3.5" /> Metrics history</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/financial-model"><Calculator className="h-3.5 w-3.5" /> Open the model</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions + activity */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 edge-highlight">
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">Jump straight into the work</p>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3">
            {[
              { href: '/dashboard/fundraising', icon: Target, title: 'Log investor', desc: 'Add a pipeline touchpoint', tint: 'text-gold-dark dark:text-gold-light' },
              { href: '/dashboard/financial-model', icon: Calculator, title: 'New scenario', desc: 'Stress-test the model', tint: 'text-[hsl(226_80%_55%)] dark:text-[hsl(226_80%_75%)]' },
              { href: '/dashboard/cap-table', icon: PieChart, title: 'Add holder', desc: 'Update cap structure', tint: 'text-[hsl(284_72%_55%)] dark:text-[hsl(284_70%_75%)]' },
              { href: '/dashboard/metrics', icon: Gauge, title: 'Log snapshot', desc: 'Record monthly metrics', tint: 'text-[hsl(160_80%_45%)] dark:text-emerald-400' },
              { href: '/dashboard/investor-updates', icon: Send, title: 'Draft update', desc: 'Share progress with backers', tint: 'text-rose-600 dark:text-rose-400' },
              { href: '/dashboard/settings', icon: Landmark, title: 'Workspace', desc: 'Company & integrations', tint: 'text-muted-foreground' },
            ].map((qa) => {
              const Icon = qa.icon;
              return (
                <Link
                  key={qa.title}
                  href={qa.href}
                  className="group rounded-2xl border border-border/60 bg-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-hover"
                >
                  <Icon className={`mb-3 h-5 w-5 ${qa.tint}`} strokeWidth={2.2} />
                  <p className="text-sm font-semibold">{qa.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{qa.desc}</p>
                </Link>
              );
            })}
          </CardContent>
        </Card>

        <Card className="edge-highlight">
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">Latest across the workspace</p>
          </CardHeader>
          <CardContent className="space-y-1">
            {[
              { action: 'Due diligence call booked', target: 'Andreessen Horowitz', time: '2h', tone: 'bg-[hsl(38_92%_50%)]' },
              { action: 'Base scenario updated', target: '18-month model', time: '5h', tone: 'bg-[hsl(226_80%_60%)]' },
              { action: 'Metrics snapshot logged', target: 'January', time: '1d', tone: 'bg-[hsl(160_80%_45%)]' },
              { action: 'Investor update drafted', target: 'Q1 report', time: '2d', tone: 'bg-[hsl(284_72%_55%)]' },
              { action: 'Cap table synced', target: 'Option pool expanded', time: '3d', tone: 'bg-rose-500' },
            ].map((activity, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-accent/50">
                <div className={`h-2 w-2 flex-shrink-0 rounded-full ${activity.tone}`} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{activity.action}</p>
                  <p className="truncate text-xs text-muted-foreground">{activity.target}</p>
                </div>
                <span className="flex-shrink-0 text-[11px] font-medium text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}