'use client';

import * as React from 'react';
import { useAppStore } from '@/lib/store';
import type { FinancialProjection } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { formatCurrency, formatNumber, formatPercent, calculateRunway, calculateMonthsOfRunway } from '@/lib/utils';
import {
  Plus,
  Trash2,
  Edit,
  Copy,
  Download,
  BarChart3,
  TrendingUp,
  Calculator,
  Target,
  AlertTriangle,
  CheckCircle,
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
  Legend,
  AreaChart,
  Area,
} from 'recharts';

const scenarioOptions = [
  { value: 'conservative', label: 'Conservative', color: 'bg-red-100 text-red-600' },
  { value: 'base', label: 'Base Case', color: 'bg-blue-100 text-blue-600' },
  { value: 'aggressive', label: 'Aggressive', color: 'bg-green-100 text-green-600' },
];

export default function FinancialModelPage() {
  const { projections, addProjection, updateProjection, currentStartup } = useAppStore();
  const [activeTab, setActiveTab] = React.useState<'overview' | 'builder' | 'scenarios'>('overview');
  const [selectedProjection, setSelectedProjection] = React.useState(projections[0]);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingProjection, setEditingProjection] = React.useState<any>(null);
  const [formData, setFormData] = React.useState({
    name: '',
    scenario: 'base',
    months: 18,
    starting_cash: '',
    assumptions: {
      'monthly-growth-rate': 0.2,
      'churn-rate': 0.03,
      'avg-contract-value': 5000,
      'sales-cycle-days': 45,
      'gross-margin': 0.8,
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const projectionData = {
      id: editingProjection?.id || `proj-${Date.now()}`,
      startup_id: currentStartup?.id || '',
      ...formData,
      scenario: formData.scenario as FinancialProjection['scenario'],
      months: parseInt(formData.months as any),
      starting_cash: parseFloat(formData.starting_cash as any),
      assumptions: formData.assumptions,
      monthly_revenue: generateProjection(formData),
      monthly_expenses: [],
      created_at: editingProjection?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    if (editingProjection) {
      updateProjection(editingProjection.id, projectionData);
    } else {
      addProjection(projectionData);
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const generateProjection = (data: any) => {
    const months = parseInt(data.months);
    const startingCash = parseFloat(data.starting_cash);
    const growthRate = data.assumptions['monthly-growth-rate'];
    const churnRate = data.assumptions['churn-rate'];
    const avgContract = data.assumptions['avg-contract-value'];
    const grossMargin = data.assumptions['gross-margin'];

    let revenue = avgContract * 2;
    let expenses = startingCash * 0.15;
    let cash = startingCash;
    let headcount = 4;
    let customers = 2;

    return Array.from({ length: months }, (_, i) => {
      const month = i + 1;
      
      if (month > 1) {
        revenue = revenue * (1 + growthRate) * (1 - churnRate);
        customers = Math.round(customers * (1 + growthRate) * (1 - churnRate));
        expenses = expenses * 1.08;
        headcount = Math.min(headcount + (month % 3 === 0 ? 1 : 0), 25);
      }
      
      const netBurn = revenue * grossMargin - expenses;
      cash += netBurn;

      return {
        month,
        revenue: Math.round(revenue),
        expenses: Math.round(expenses),
        net_burn: Math.round(netBurn),
        cash_balance: Math.round(cash),
        headcount,
        mrr: Math.round(revenue),
        arr: Math.round(revenue * 12),
      };
    });
  };

  const handleNewProjection = () => {
    resetForm();
    setFormData({...formData, starting_cash: '500000', months: 18});
    setIsDialogOpen(true);
  };

  const handleEdit = (proj: any) => {
    setEditingProjection(proj);
    setFormData({
      name: proj.name,
      scenario: proj.scenario as any,
      months: Number(proj.months),
      starting_cash: proj.starting_cash.toString(),
      assumptions: proj.assumptions,
    });
    setIsDialogOpen(true);
  };

  const handleDuplicate = (proj: any) => {
    const newProj = {
      ...proj,
      id: `proj-${Date.now()}`,
      name: `${proj.name} (Copy)`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    addProjection(newProj);
  };

  const resetForm = () => {
    setEditingProjection(null);
    setFormData({
      name: '',
      scenario: 'base',
      months: 18,
      starting_cash: '',
      assumptions: {
        'monthly-growth-rate': 0.2,
        'churn-rate': 0.03,
        'avg-contract-value': 5000,
        'sales-cycle-days': 45,
        'gross-margin': 0.8,
      },
    });
  };

  const currentProj = selectedProjection || projections[0];
  const latestMonth = currentProj?.monthly_revenue?.[currentProj.monthly_revenue.length - 1];
  const runwayMonths = latestMonth ? calculateRunway(latestMonth.cash_balance, -Math.min(latestMonth.net_burn, 0)) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Financial Modeling</h1>
          <p className="text-muted-foreground">Build projections, model scenarios, and plan your runway</p>
        </div>
        <Button variant="gold" onClick={handleNewProjection}><Plus className="h-4 w-4 mr-2" />New Projection</Button>
      </div>

      {currentProj && (
        <Card className="border-primary">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <CardTitle>{currentProj.name}</CardTitle>
                <p className="text-muted-foreground">
                  {currentProj.months}-month projection • Starting cash: {formatCurrency(currentProj.starting_cash)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={cn(
                  scenarioOptions.find(s => s.value === currentProj.scenario)?.color
                )}>
                  {scenarioOptions.find(s => s.value === currentProj.scenario)?.label}
                </Badge>
                <Button variant="ghost" size="icon" onClick={() => handleDuplicate(currentProj)}><Copy className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => handleEdit(currentProj)}><Edit className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => {}}><Download className="h-4 w-4" /></Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4 mb-6">
              <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                <p className="text-sm text-green-700">Ending Cash</p>
                <p className="text-2xl font-bold text-green-900">{formatCurrency(latestMonth?.cash_balance || 0)}</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-700">Runway</p>
                <p className="text-2xl font-bold text-blue-900">{calculateMonthsOfRunway(latestMonth?.cash_balance || 0, -Math.min(latestMonth?.net_burn || 0, 1))}</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                <p className="text-sm text-purple-700">Final MRR</p>
                <p className="text-2xl font-bold text-purple-900">{formatCurrency(latestMonth?.mrr || 0)}</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                <p className="text-sm text-orange-700">Final ARR</p>
                <p className="text-2xl font-bold text-orange-900">{formatCurrency(latestMonth?.arr || 0)}</p>
              </div>
            </div>

            <Tabs defaultValue="chart" className="w-full">
              <TabsList>
                <TabsTrigger value="chart">Charts</TabsTrigger>
                <TabsTrigger value="table">Data Table</TabsTrigger>
                <TabsTrigger value="assumptions">Assumptions</TabsTrigger>
              </TabsList>
              <TabsContent value="chart" className="mt-4">
                <div className="grid gap-6 lg:grid-cols-2">
                  <Card>
                    <CardHeader><CardTitle>Cash Balance & Runway</CardTitle></CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={currentProj.monthly_revenue} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                              <linearGradient id="cashGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="month" stroke="#9ca3af" fontSize={11} tick={{ fill: '#6b7280' }} />
                            <YAxis stroke="#9ca3af" fontSize={11} tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`} tick={{ fill: '#6b7280' }} />
                            <Tooltip
                              formatter={(value: number) => [formatCurrency(value), '']}
                              labelFormatter={(label) => `Month ${label}`}
                              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                            />
                            <Legend />
                            <Area
                              type="monotone"
                              dataKey="cash_balance"
                              stroke="#3B82F6"
                              fillOpacity={1}
                              fill="url(#cashGradient)"
                              strokeWidth={2}
                              name="Cash Balance"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader><CardTitle>Revenue vs Expenses</CardTitle></CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={currentProj.monthly_revenue} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="month" stroke="#9ca3af" fontSize={11} />
                            <YAxis stroke="#9ca3af" fontSize={11} tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`} />
                            <Tooltip
                              formatter={(value: number) => [formatCurrency(value), '']}
                              labelFormatter={(label) => `Month ${label}`}
                              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                            />
                            <Legend />
                            <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} name="Revenue" dot={false} />
                            <Line type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={2} name="Expenses" dot={false} />
                            <Line type="monotone" dataKey="net_burn" stroke="#F59E0B" strokeWidth={2} name="Net Burn" strokeDasharray="5 5" dot={false} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader><CardTitle>MRR Growth</CardTitle></CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={currentProj.monthly_revenue} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                              <linearGradient id="mrrGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="month" stroke="#9ca3af" fontSize={11} />
                            <YAxis stroke="#9ca3af" fontSize={11} tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`} />
                            <Tooltip formatter={(value: number) => [formatCurrency(value), '']} labelFormatter={(label) => `Month ${label}`} />
                            <Area type="monotone" dataKey="mrr" stroke="#10B981" fillOpacity={1} fill="url(#mrrGradient)" strokeWidth={2} name="MRR" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader><CardTitle>Headcount Plan</CardTitle></CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={currentProj.monthly_revenue} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="month" stroke="#9ca3af" fontSize={11} />
                            <YAxis stroke="#9ca3af" fontSize={11} />
                            <Tooltip formatter={(value: number) => [value, '']} labelFormatter={(label) => `Month ${label}`} />
                            <Line type="monotone" dataKey="headcount" stroke="#8B5CF6" strokeWidth={3} name="Headcount" dot={{ r: 4 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="table" className="mt-4">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Month</TableHead>
                        <TableHead className="text-right">Revenue</TableHead>
                        <TableHead className="text-right">Expenses</TableHead>
                        <TableHead className="text-right">Net Burn</TableHead>
                        <TableHead className="text-right">Cash Balance</TableHead>
                        <TableHead className="text-right">MRR</TableHead>
                        <TableHead className="text-right">ARR</TableHead>
                        <TableHead className="text-right">Headcount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentProj.monthly_revenue.map((m: any) => (
                        <TableRow key={m.month}>
                          <TableCell>Month {m.month}</TableCell>
                          <TableCell className="text-right font-medium text-green-600">{formatCurrency(m.revenue)}</TableCell>
                          <TableCell className="text-right font-medium text-red-600">{formatCurrency(m.expenses)}</TableCell>
                          <TableCell className={cn('text-right font-medium', m.net_burn >= 0 ? 'text-green-600' : 'text-red-600')}>
                            {formatCurrency(m.net_burn)}
                          </TableCell>
                          <TableCell className="text-right font-semibold">{formatCurrency(m.cash_balance)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(m.mrr)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(m.arr)}</TableCell>
                          <TableCell className="text-right">{m.headcount}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="assumptions" className="mt-4">
                <Card>
                  <CardHeader><CardTitle>Key Assumptions</CardTitle></CardHeader>
                  <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Object.entries(currentProj.assumptions || {}).map(([key, value]) => (
                      <div key={key} className="p-4 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">{key.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</p>
                        <p className="text-2xl font-bold">
                          {typeof value === 'number' && value < 1 ? formatPercent(value) : typeof value === 'number' ? formatNumber(value) : String(value)}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Projections</CardTitle>
              <Button variant="ghost" size="sm" onClick={handleNewProjection}><Plus className="h-4 w-4 mr-1" />New</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {projections.map((proj) => (
                <div
                  key={proj.id}
                  className={cn(
                    'flex items-center justify-between p-3 rounded-lg border transition-colors cursor-pointer',
                    selectedProjection?.id === proj.id
                      ? 'border-primary bg-primary/5'
                      : 'hover:bg-muted/50'
                  )}
                  onClick={() => setSelectedProjection(proj)}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn('h-2.5 w-2.5 rounded-full', 
                      proj.scenario === 'conservative' && 'bg-red-500',
                      proj.scenario === 'base' && 'bg-blue-500',
                      proj.scenario === 'aggressive' && 'bg-green-500'
                    )} />
                    <div>
                      <p className="font-medium">{proj.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {proj.months} months • {formatCurrency(proj.starting_cash)} starting
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={cn(
                      scenarioOptions.find(s => s.value === proj.scenario)?.color
                    )}>
                      {scenarioOptions.find(s => s.value === proj.scenario)?.label}
                    </Badge>
                    <span className="text-sm font-medium text-green-600">
                      {proj.monthly_revenue[proj.monthly_revenue.length - 1]?.cash_balance > 0 ? '✓' : '⚠'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Scenario Comparison</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scenarioOptions.map((scenario) => {
                const proj = projections.find((p) => p.scenario === scenario.value);
                const final = proj?.monthly_revenue[proj.monthly_revenue.length - 1];
                return (
                  <div key={scenario.value} className="p-4 bg-muted/50 rounded-lg border-l-4" style={{ borderColor: scenario.color.replace('text-', '').replace('bg-', '') }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className={scenario.color}>{scenario.label}</Badge>
                        {proj && (
                          <>
                            <span className="font-medium">{proj.name}</span>
                            <span className="text-sm text-muted-foreground">{proj.months} months</span>
                          </>
                        )}
                      </div>
                      {proj && final && (
                        <div className="flex items-center gap-4 text-sm">
                          <span className="font-semibold">{formatCurrency(final.cash_balance)}</span>
                          <span className={final.cash_balance > 0 ? 'text-green-600' : 'text-red-600'}>
                            {calculateMonthsOfRunway(final.cash_balance, -Math.min(final.net_burn, 1))}
                          </span>
                        </div>
                      )}
                    </div>
                    {proj && final && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Final MRR: {formatCurrency(final?.mrr ?? 0)} • Final ARR: {formatCurrency(final?.arr ?? 0)} • Headcount: {final?.headcount ?? 0}
                      </p>
                    )}
                    {!proj && (
                      <p className="text-xs text-muted-foreground mt-2">No projection created for this scenario</p>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProjection ? 'Edit Projection' : 'Create New Projection'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Projection Name *</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required placeholder="Base Case 2024" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="scenario">Scenario</Label>
                <Select value={formData.scenario} onValueChange={(v) => setFormData({...formData, scenario: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {scenarioOptions.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="months">Projection Period (months)</Label>
                <Input id="months" type="number" value={formData.months} onChange={(e) => setFormData({...formData, months: Number(e.target.value)})} min="6" max="60" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="starting_cash">Starting Cash ($)</Label>
                <Input id="starting_cash" type="number" value={formData.starting_cash} onChange={(e) => setFormData({...formData, starting_cash: e.target.value})} placeholder="500000" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Key Assumptions</Label>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="growth">Monthly Growth Rate</Label>
                  <Input id="growth" type="number" step="0.01" min="0" max="2" value={formData.assumptions['monthly-growth-rate']} onChange={(e) => setFormData({...formData, assumptions: {...formData.assumptions, 'monthly-growth-rate': parseFloat(e.target.value)}})} placeholder="0.20" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="churn">Monthly Churn Rate</Label>
                  <Input id="churn" type="number" step="0.001" min="0" max="0.5" value={formData.assumptions['churn-rate']} onChange={(e) => setFormData({...formData, assumptions: {...formData.assumptions, 'churn-rate': parseFloat(e.target.value)}})} placeholder="0.03" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="acv">Avg Contract Value ($)</Label>
                  <Input id="acv" type="number" value={formData.assumptions['avg-contract-value']} onChange={(e) => setFormData({...formData, assumptions: {...formData.assumptions, 'avg-contract-value': parseFloat(e.target.value)}})} placeholder="5000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="margin">Gross Margin</Label>
                  <Input id="margin" type="number" step="0.01" min="0" max="1" value={formData.assumptions['gross-margin']} onChange={(e) => setFormData({...formData, assumptions: {...formData.assumptions, 'gross-margin': parseFloat(e.target.value)}})} placeholder="0.80" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit">{editingProjection ? 'Update' : 'Create'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}