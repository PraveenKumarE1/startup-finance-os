'use client';

import * as React from 'react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  DollarSign,
  TrendingUp,
  Clock,
  Users,
  Target,
  BarChart3,
  PieChart,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Settings as SettingsIcon,
} from 'lucide-react';
import { formatCurrency, formatNumber, formatPercent, calculateMonthsOfRunway } from '@/lib/utils';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const metricCards = [
  {
    name: 'Booked Revenue',
    icon: DollarSign,
    color: 'text-green-600',
    getValue: (s: any) => formatCurrency(s.arr || s.mrr),
    change: '+18.2%',
    trend: 'up',
  },
  {
    name: 'Delivery Utilization',
    icon: TrendingUp,
    color: 'text-violet-600',
    getValue: (s: any) => `${Math.min(96, Math.max(50, (s.headcount || 12) * 6))}%`,
    change: '+7.4%',
    trend: 'up',
  },
  {
    name: 'Ops Burn',
    icon: Clock,
    color: 'text-blue-600',
    getValue: (s: any) => formatCurrency(s.burn_rate),
    change: '-9.1%',
    trend: 'down',
  },
  {
    name: 'Active Clients',
    icon: Users,
    color: 'text-purple-600',
    getValue: (s: any) => formatNumber(s.customers || 18),
    change: '+6',
    trend: 'up',
  },
];

const pipelineStages = [
  { name: 'Qualified', count: 32, dot: 'bg-gray-400', text: 'text-gray-600' },
  { name: 'Discovery', count: 18, dot: 'bg-blue-500', text: 'text-blue-600' },
  { name: 'Proposal', count: 9, dot: 'bg-yellow-500', text: 'text-yellow-600' },
  { name: 'Negotiation', count: 4, dot: 'bg-orange-500', text: 'text-orange-600' },
  { name: 'Onboarding', count: 3, dot: 'bg-purple-500', text: 'text-purple-600' },
  { name: 'Retained', count: 11, dot: 'bg-green-500', text: 'text-green-600' },
];

const monthlyData = [
  { month: 'Jan', revenue: 42000, automations: 18, utilization: 62 },
  { month: 'Feb', revenue: 62000, automations: 24, utilization: 68 },
  { month: 'Mar', revenue: 88000, automations: 31, utilization: 72 },
  { month: 'Apr', revenue: 106000, automations: 37, utilization: 78 },
  { month: 'May', revenue: 138000, automations: 42, utilization: 80 },
  { month: 'Jun', revenue: 170000, automations: 49, utilization: 86 },
  { month: 'Jul', revenue: 198000, automations: 54, utilization: 90 },
];

export default function DashboardPage() {
  const { currentStartup, metrics } = useAppStore();
  const latestMetrics = metrics[metrics.length - 1];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
          <p className="text-muted-foreground">
            Welcome back. Here&apos;s the health of {currentStartup?.name}&apos;s delivery engine and client pipeline.
          </p>
        </div>
        <Button asChild>
          <a href="/fundraising">New Deal</a>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metricCards.map((metric) => {
          const Icon = metric.icon;
          const trendColor = metric.trend === 'up' ? 'text-green-600' : 'text-red-600';
          return (
            <Card key={metric.name}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
                <Icon className={cn('h-4 w-4', metric.color)} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.getValue(latestMetrics)}</div>
                <p className="text-xs text-muted-foreground">
                  <span className={cn(trendColor, 'font-medium')}>{metric.change}</span> vs last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Revenue & team momentum</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="autoFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2DD4BF" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#2DD4BF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`} />
                  <Tooltip
                    formatter={(value: number) => [formatCurrency(value), '']}
                    labelFormatter={(label) => `Month: ${label}`}
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#6366F1" fillOpacity={1} fill="url(#revenueFill)" strokeWidth={2} name="Revenue" />
                  <Area type="monotone" dataKey="automations" stroke="#14B8A6" fillOpacity={1} fill="url(#autoFill)" strokeWidth={2} name="Automations" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Client pipeline</CardTitle>
              <Badge className="bg-emerald-100 text-emerald-700">$530k active</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pipelineStages.map((stage) => (
                <div key={stage.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn('h-2.5 w-2.5 rounded-full', stage.dot)} />
                    <span className="text-sm font-medium">{stage.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={cn('font-semibold', stage.text)}>{stage.count}</span>
                    <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
                      <div className={cn('h-full rounded-full', stage.dot)} style={{ width: `${(stage.count / 32) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Key metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">MRR</p>
                <p className="text-2xl font-bold">{formatCurrency(latestMetrics?.mrr || 0)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ARR</p>
                <p className="text-2xl font-bold">{formatCurrency(latestMetrics?.arr || 0)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gross margin</p>
                <p className="text-2xl font-bold text-emerald-600">{formatPercent(latestMetrics?.gross_margin || 0)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Delivery health</p>
                <p className="text-2xl font-bold text-violet-600">92%</p>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Churn</p>
                <p className="text-2xl font-bold text-red-600">{formatPercent(latestMetrics?.churn_rate || 0)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">CAC</p>
                <p className="text-2xl font-bold">{formatCurrency(latestMetrics?.cac || 0)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Team utilization</p>
                <p className="text-2xl font-bold">86%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">AI automations</p>
                <p className="text-2xl font-bold">54</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Delivery snapshot</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <a href="/cap-table">Details</a>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'Client retention', percentage: 92, color: 'bg-violet-500' },
                { name: 'Projects on track', percentage: 88, color: 'bg-emerald-500' },
                { name: 'Resource balance', percentage: 76, color: 'bg-cyan-500' },
              ].map((item) => (
                <div key={item.name} className="flex items-center gap-3">
                  <div className={cn('h-3 w-3 rounded', item.color)} />
                  <span className="text-sm font-medium">{item.name}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <div className={cn('h-full rounded-full', item.color)} style={{ width: `${item.percentage}%` }} />
                  </div>
                  <span className="w-16 text-right text-sm font-semibold">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Button variant="outline" className="h-24 flex-col gap-2" asChild>
              <a href="/fundraising">
                <Target className="h-6 w-6" />
                <span>New deal</span>
                <p className="text-xs text-muted-foreground">Add a new opportunity</p>
              </a>
            </Button>
            <Button variant="outline" className="h-24 flex-col gap-2" asChild>
              <a href="/financial-model">
                <BarChart3 className="h-6 w-6" />
                <span>AI brief</span>
                <p className="text-xs text-muted-foreground">Generate a scoped project brief</p>
              </a>
            </Button>
            <Button variant="outline" className="h-24 flex-col gap-2" asChild>
              <a href="/cap-table">
                <PieChart className="h-6 w-6" />
                <span>Assign work</span>
                <p className="text-xs text-muted-foreground">Balance team load instantly</p>
              </a>
            </Button>
            <Button variant="outline" className="h-24 flex-col gap-2" asChild>
              <a href="/metrics">
                <TrendingUp className="h-6 w-6" />
                <span>Log update</span>
                <p className="text-xs text-muted-foreground">Record performance snapshot</p>
              </a>
            </Button>
            <Button variant="outline" className="h-24 flex-col gap-2" asChild>
              <a href="/investor-updates">
                <FileText className="h-6 w-6" />
                <span>Send report</span>
                <p className="text-xs text-muted-foreground">Create your weekly update</p>
              </a>
            </Button>
            <Button variant="outline" className="h-24 flex-col gap-2" asChild>
              <a href="/settings">
                <SettingsIcon className="h-6 w-6" />
                <span>Settings</span>
                <p className="text-xs text-muted-foreground">Tune the workspace</p>
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { action: 'Discovery call booked', target: 'Northstar Labs', time: '2 hours ago' },
              { action: 'AI brief generated', target: 'Brand Sprint', time: '5 hours ago' },
              { action: 'Team allocation updated', target: 'Design pod', time: '1 day ago' },
              { action: 'Q3 forecast refreshed', target: 'Executive summary', time: '2 days ago' },
              { action: 'Client update sent', target: 'Launch partner', time: '3 days ago' },
            ].map((activity, i) => (
              <div key={i} className="flex items-center justify-between border-b py-2 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <div>
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.target}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}