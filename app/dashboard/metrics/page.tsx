'use client';

import * as React from 'react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { formatCurrency, formatNumber, formatPercent, formatDate } from '@/lib/utils';
import {
  Plus,
  Trash2,
  Edit,
  Download,
  TrendingUp,
  TrendingDown,
  BarChart3,
  DollarSign,
  Users,
  Target,
  Calculator,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Legend,
} from 'recharts';

const metricDefinitions = [
  { key: 'mrr', label: 'MRR', icon: DollarSign, color: 'text-green-600', format: 'currency' },
  { key: 'arr', label: 'ARR', icon: DollarSign, color: 'text-green-600', format: 'currency' },
  { key: 'revenue', label: 'Revenue', icon: DollarSign, color: 'text-blue-600', format: 'currency' },
  { key: 'customers', label: 'Customers', icon: Users, color: 'text-purple-600', format: 'number' },
  { key: 'new_customers', label: 'New Customers', icon: Users, color: 'text-blue-600', format: 'number' },
  { key: 'churned_customers', label: 'Churned', icon: TrendingDown, color: 'text-red-600', format: 'number' },
  { key: 'churn_rate', label: 'Churn Rate', icon: TrendingDown, color: 'text-red-600', format: 'percent' },
  { key: 'cac', label: 'CAC', icon: Target, color: 'text-orange-600', format: 'currency' },
  { key: 'ltv', label: 'LTV', icon: Target, color: 'text-green-600', format: 'currency' },
  { key: 'ltv_cac_ratio', label: 'LTV/CAC', icon: Target, color: 'text-purple-600', format: 'ratio' },
  { key: 'gross_margin', label: 'Gross Margin', icon: Calculator, color: 'text-blue-600', format: 'percent' },
  { key: 'burn_rate', label: 'Burn Rate', icon: TrendingDown, color: 'text-red-600', format: 'currency' },
  { key: 'runway_months', label: 'Runway', icon: Target, color: 'text-blue-600', format: 'months' },
  { key: 'cash_balance', label: 'Cash Balance', icon: DollarSign, color: 'text-green-600', format: 'currency' },
  { key: 'headcount', label: 'Headcount', icon: Users, color: 'text-gray-600', format: 'number' },
];

export default function MetricsPage() {
  const { metrics, addMetricSnapshot, currentStartup } = useAppStore();
  const [activeTab, setActiveTab] = React.useState<'overview' | 'builder' | 'cohorts'>('overview');
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingMetric, setEditingMetric] = React.useState<any>(null);
  const [formData, setFormData] = React.useState({
    date: new Date().toISOString().split('T')[0],
    mrr: '',
    arr: '',
    revenue: '',
    customers: '',
    new_customers: '',
    churned_customers: '',
    churn_rate: '',
    cac: '',
    ltv: '',
    ltv_cac_ratio: '',
    gross_margin: '',
    burn_rate: '',
    runway_months: '',
    cash_balance: '',
    headcount: '',
  });
  const [selectedMetrics, setSelectedMetrics] = React.useState<string[]>(['mrr', 'arr', 'customers', 'burn_rate', 'cash_balance']);

  const latestMetrics = metrics[metrics.length - 1];
  const previousMetrics = metrics[metrics.length - 2];

  const calculateChange = (current: number, previous: number) => {
    if (!previous || previous === 0) return { value: 0, trend: 'neutral' as const };
    const change = ((current - previous) / Math.abs(previous)) * 100;
    return {
      value: Math.abs(change),
      trend: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral',
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const metricData = {
      id: editingMetric?.id || `m-${Date.now()}`,
      startup_id: currentStartup?.id || '',
      date: formData.date,
      mrr: parseFloat(formData.mrr) || 0,
      arr: parseFloat(formData.arr) || 0,
      revenue: parseFloat(formData.revenue) || 0,
      customers: parseInt(formData.customers) || 0,
      new_customers: parseInt(formData.new_customers) || 0,
      churned_customers: parseInt(formData.churned_customers) || 0,
      churn_rate: parseFloat(formData.churn_rate) || 0,
      cac: parseFloat(formData.cac) || 0,
      ltv: parseFloat(formData.ltv) || 0,
      ltv_cac_ratio: parseFloat(formData.ltv_cac_ratio) || 0,
      gross_margin: parseFloat(formData.gross_margin) || 0,
      burn_rate: parseFloat(formData.burn_rate) || 0,
      runway_months: parseFloat(formData.runway_months) || 0,
      cash_balance: parseFloat(formData.cash_balance) || 0,
      headcount: parseInt(formData.headcount) || 0,
      created_at: editingMetric?.created_at || new Date().toISOString(),
    };
    if (editingMetric) {
      // Update would need store update function
    } else {
      addMetricSnapshot(metricData);
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleNewMetric = () => {
    resetForm();
    if (latestMetrics) {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        mrr: '',
        arr: '',
        revenue: '',
        customers: '',
        new_customers: '',
        churned_customers: '',
        churn_rate: '',
        cac: '',
        ltv: '',
        ltv_cac_ratio: '',
        gross_margin: '',
        burn_rate: '',
        runway_months: '',
        cash_balance: '',
        headcount: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleEdit = (metric: any) => {
    setEditingMetric(metric);
    setFormData({
      date: metric.date.split('T')[0],
      mrr: metric.mrr.toString(),
      arr: metric.arr.toString(),
      revenue: metric.revenue.toString(),
      customers: metric.customers.toString(),
      new_customers: metric.new_customers.toString(),
      churned_customers: metric.churned_customers.toString(),
      churn_rate: metric.churn_rate.toString(),
      cac: metric.cac.toString(),
      ltv: metric.ltv.toString(),
      ltv_cac_ratio: metric.ltv_cac_ratio.toString(),
      gross_margin: metric.gross_margin.toString(),
      burn_rate: metric.burn_rate.toString(),
      runway_months: metric.runway_months.toString(),
      cash_balance: metric.cash_balance.toString(),
      headcount: metric.headcount.toString(),
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingMetric(null);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      mrr: '',
      arr: '',
      revenue: '',
      customers: '',
      new_customers: '',
      churned_customers: '',
      churn_rate: '',
      cac: '',
      ltv: '',
      ltv_cac_ratio: '',
      gross_margin: '',
      burn_rate: '',
      runway_months: '',
      cash_balance: '',
      headcount: '',
    });
  };

  const formatValue = (key: string, value: number) => {
    const def = metricDefinitions.find((d) => d.key === key);
    if (!def) return value.toString();
    switch (def.format) {
      case 'currency': return formatCurrency(value);
      case 'percent': return formatPercent(value);
      case 'ratio': return `${value.toFixed(1)}x`;
      case 'months': return `${value.toFixed(1)} mo`;
      default: return formatNumber(value);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Metrics Dashboard</h1>
          <p className="mt-1.5 text-muted-foreground">Track KPIs, visualize trends, and monitor business health</p>
        </div>
        <Button variant="gold" onClick={handleNewMetric}><Plus className="h-4 w-4 mr-2" />Log Metrics</Button>
      </div>

      {latestMetrics && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {metricDefinitions.slice(0, 8).map((def) => {
            const current = latestMetrics[def.key as keyof typeof latestMetrics] as number;
            const previous = previousMetrics?.[def.key as keyof typeof previousMetrics] as number;
            const change = calculateChange(current, previous);
            const Icon = def.icon;
            return (
              <Card key={def.key}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{def.label}</CardTitle>
                  <Icon className={cn('h-4 w-4', def.color)} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold tabular-nums">{formatValue(def.key, current)}</div>
                  {previous !== undefined && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <span className={cn(
                        change.trend === 'up' && def.key !== 'churn_rate' && def.key !== 'burn_rate' && def.key !== 'churned_customers' ? 'text-green-600' :
                        change.trend === 'down' && (def.key === 'churn_rate' || def.key === 'burn_rate' || def.key === 'churned_customers') ? 'text-green-600' :
                        change.trend === 'up' ? 'text-red-600' : 'text-green-600',
                        'font-medium'
                      )}>
                        {change.trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                        {change.value.toFixed(1)}%
                      </span>
                      <span>vs last month</span>
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Tabs defaultValue="trends" className="w-full">
        <TabsList>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="table">Data Table</TabsTrigger>
          <TabsTrigger value="ratios">Unit Economics</TabsTrigger>
          <TabsTrigger value="custom">Custom Chart</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="mt-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Revenue Trends</CardTitle>
                  <Badge variant="outline">Last 12 months</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={metrics} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="arrGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="date" stroke="#9ca3af" fontSize={11} tickFormatter={(v) => formatDate(v).split(' ').slice(0,2).join(' ')} />
                      <YAxis stroke="#9ca3af" fontSize={11} tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`} />
                      <Tooltip
                        formatter={(value: number, name: string) => [formatCurrency(value), name]}
                        labelFormatter={(label) => formatDate(label)}
                        contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '12px', boxShadow: '0 12px 32px -12px hsl(226 45% 12% / 0.3)', fontSize: 13 }}
                      />
                      <Legend />
                      <Area type="monotone" dataKey="mrr" stroke="#10B981" fillOpacity={1} fill="url(#mrrGrad)" strokeWidth={2} name="MRR" />
                      <Area type="monotone" dataKey="arr" stroke="#3B82F6" fillOpacity={1} fill="url(#arrGrad)" strokeWidth={2} name="ARR" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Customer Metrics</CardTitle>
                  <Badge variant="outline">Last 12 months</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={metrics} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="date" stroke="#9ca3af" fontSize={11} tickFormatter={(v) => formatDate(v).split(' ').slice(0,2).join(' ')} />
                      <YAxis stroke="#9ca3af" fontSize={11} />
                      <Tooltip formatter={(value: number) => [value, '']} labelFormatter={(label) => formatDate(label)} />
                      <Legend />
                      <Line type="monotone" dataKey="customers" stroke="#8B5CF6" strokeWidth={2} name="Total Customers" dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="new_customers" stroke="#3B82F6" strokeWidth={2} name="New Customers" strokeDasharray="5 5" dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="churned_customers" stroke="#EF4444" strokeWidth={2} name="Churned" strokeDasharray="5 5" dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Burn & Runway</CardTitle>
                  <Badge variant="outline">Last 12 months</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={metrics} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="date" stroke="#9ca3af" fontSize={11} tickFormatter={(v) => formatDate(v).split(' ').slice(0,2).join(' ')} />
                      <YAxis yAxisId="left" stroke="#9ca3af" fontSize={11} tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`} />
                      <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" fontSize={11} tickFormatter={(val) => `${val.toFixed(1)} mo`} />
                      <Tooltip
                        formatter={(value: number, name: string) => {
                          if (name === 'Runway') return [`${value.toFixed(1)} mo`, name];
                          return [formatCurrency(value), name];
                        }}
                        labelFormatter={(label) => formatDate(label)}
                      />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="burn_rate" stroke="#EF4444" strokeWidth={2} name="Burn Rate" dot={false} />
                      <Line yAxisId="left" type="monotone" dataKey="cash_balance" stroke="#3B82F6" strokeWidth={2} name="Cash Balance" dot={false} />
                      <Line yAxisId="right" type="monotone" dataKey="runway_months" stroke="#F59E0B" strokeWidth={2} name="Runway" strokeDasharray="5 5" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Unit Economics</CardTitle>
                  <Badge variant="outline">Last 12 months</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={metrics} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="date" stroke="#9ca3af" fontSize={11} tickFormatter={(v) => formatDate(v).split(' ').slice(0,2).join(' ')} />
                      <YAxis stroke="#9ca3af" fontSize={11} />
                      <Tooltip formatter={(value: number, name: string) => {
                        if (name === 'LTV/CAC') return [`${value.toFixed(1)}x`, name];
                        return [formatCurrency(value), name];
                      }} labelFormatter={(label) => formatDate(label)} />
                      <Legend />
                      <Line type="monotone" dataKey="cac" stroke="#F59E0B" strokeWidth={2} name="CAC" dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="ltv" stroke="#10B981" strokeWidth={2} name="LTV" dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="ltv_cac_ratio" stroke="#8B5CF6" strokeWidth={2} name="LTV/CAC" strokeDasharray="5 5" dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="table" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>All Metrics Snapshots</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1" />Export CSV</Button>
                  <Button variant="outline" size="sm"><RefreshCw className="h-4 w-4 mr-1" />Refresh</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      {metricDefinitions.map((def) => (
                        <TableHead key={def.key} className="text-right">{def.label}</TableHead>
                      ))}
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...metrics].reverse().map((metric) => (
                      <TableRow key={metric.id}>
                        <TableCell>{formatDate(metric.date)}</TableCell>
                        {metricDefinitions.map((def) => (
                          <TableCell key={def.key} className="text-right font-mono text-sm">
                            {formatValue(def.key, metric[def.key as keyof typeof metric] as number)}
                          </TableCell>
                        ))}
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(metric)}><Edit className="h-4 w-4" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ratios" className="mt-4">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card>
              <CardHeader><CardTitle>LTV/CAC Ratio</CardTitle></CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">{latestMetrics?.ltv_cac_ratio?.toFixed(1) || 0}x</div>
                <p className="text-sm text-muted-foreground">Target: {`>`} 3x</p>
                <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: `${Math.min((latestMetrics?.ltv_cac_ratio || 0) / 5, 1) * 100}%` }} />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-muted-foreground">LTV</span><br /><span className="font-semibold">{formatCurrency(latestMetrics?.ltv || 0)}</span></div>
                  <div><span className="text-muted-foreground">CAC</span><br /><span className="font-semibold">{formatCurrency(latestMetrics?.cac || 0)}</span></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Gross Margin</CardTitle></CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{formatPercent(latestMetrics?.gross_margin || 0)}</div>
                <p className="text-sm text-muted-foreground">Target: {`>`} 70%</p>
                <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min((latestMetrics?.gross_margin || 0) / 0.9, 1) * 100}%` }} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Churn Rate</CardTitle></CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-red-600 mb-2">{formatPercent(latestMetrics?.churn_rate || 0)}</div>
                <p className="text-sm text-muted-foreground">Target: {`<`} 5% monthly</p>
                <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: `${Math.min((latestMetrics?.churn_rate || 0) / 0.1, 1) * 100}%` }} />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle>Cohort Analysis (Simulated)</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cohort</TableHead>
                      <TableHead className="text-right">Month 0</TableHead>
                      <TableHead className="text-right">Month 1</TableHead>
                      <TableHead className="text-right">Month 2</TableHead>
                      <TableHead className="text-right">Month 3</TableHead>
                      <TableHead className="text-right">Month 6</TableHead>
                      <TableHead className="text-right">Month 12</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {['Jan 2024', 'Feb 2024', 'Mar 2024', 'Apr 2024', 'May 2024', 'Jun 2024'].map((cohort, i) => (
                      <TableRow key={cohort}>
                        <TableCell className="font-medium">{cohort}</TableCell>
                        <TableCell className="text-right">100%</TableCell>
                        <TableCell className="text-right">96%</TableCell>
                        <TableCell className="text-right">93%</TableCell>
                        <TableCell className="text-right">90%</TableCell>
                        <TableCell className="text-right">82%</TableCell>
                        <TableCell className="text-right">70%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Custom Chart Builder</CardTitle>
                <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1" />Export</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 mb-6 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>X-Axis</Label>
                  <Select defaultValue="date">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="month">Month Number</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Chart Type</Label>
                  <Select defaultValue="line">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="line">Line Chart</SelectItem>
                      <SelectItem value="area">Area Chart</SelectItem>
                      <SelectItem value="bar">Bar Chart</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Metrics to Plot</Label>
                  <Select defaultValue="mrr">
                    <SelectTrigger><SelectValue placeholder="Select metrics..." /></SelectTrigger>
                    <SelectContent>
                      {metricDefinitions.map((def) => (
                        <SelectItem key={def.key} value={def.key}>{def.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="h-80 bg-muted/50 rounded-lg flex items-center justify-center text-muted-foreground">
                Select metrics above to generate chart
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingMetric ? 'Edit Metrics' : 'Log New Metrics Snapshot'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 p-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input id="date" type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {metricDefinitions.slice(0, 10).map((def) => (
                <div key={def.key} className="space-y-2">
                  <Label htmlFor={def.key}>{def.label}</Label>
                  <Input
                    id={def.key}
                    type="number"
                    step={def.format === 'percent' || def.format === 'ratio' ? '0.01' : '1'}
                    value={formData[def.key as keyof typeof formData]}
                    onChange={(e) => setFormData({...formData, [def.key]: e.target.value})}
                    placeholder="0"
                  />
                </div>
              ))}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {metricDefinitions.slice(10).map((def) => (
                <div key={def.key} className="space-y-2">
                  <Label htmlFor={def.key}>{def.label}</Label>
                  <Input
                    id={def.key}
                    type="number"
                    step={def.format === 'percent' ? '0.01' : '1'}
                    value={formData[def.key as keyof typeof formData]}
                    onChange={(e) => setFormData({...formData, [def.key]: e.target.value})}
                    placeholder="0"
                  />
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit">{editingMetric ? 'Update' : 'Save Snapshot'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}