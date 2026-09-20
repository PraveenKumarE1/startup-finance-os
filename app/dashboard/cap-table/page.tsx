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
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils';
import type { CapTableEntry } from '@/lib/types';
import {
  Plus,
  Trash2,
  Edit,
  Copy,
  Download,
  PieChart,
  Users,
  Building2,
  Briefcase,
  Sparkles,
  Calculator,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const entityTypes = [
  { value: 'founder', label: 'Founder', color: 'bg-blue-500' },
  { value: 'employee', label: 'Employee', color: 'bg-green-500' },
  { value: 'advisor', label: 'Advisor', color: 'bg-purple-500' },
  { value: 'investor', label: 'Investor', color: 'bg-orange-500' },
  { value: 'pool', label: 'Option Pool', color: 'bg-gray-500' },
];

const shareClasses = ['common', 'preferred', 'options'];

const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#6B7280', '#EF4444', '#EC4899', '#06B6D4', '#84CC16', '#F97316'];

export default function CapTablePage() {
  const { capTable, addCapTableEntry, updateCapTableEntry, deleteCapTableEntry, currentStartup } = useAppStore();
  const [activeTab, setActiveTab] = React.useState<'overview' | 'detail' | 'scenarios'>('overview');
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingEntry, setEditingEntry] = React.useState<any>(null);
  const [formData, setFormData] = React.useState({
    name: '',
    entity_type: 'founder',
    shares: '',
    share_class: 'common',
    percentage: '',
    cost_basis: '',
    vesting_start: '',
    vesting_months: '48',
    cliff_months: '12',
    invested_amount: '',
    valuation_cap: '',
    discount: '',
    notes: '',
  });

  const totalShares = capTable.reduce((sum, entry) => sum + entry.shares, 0);
  const totalInvested = capTable
    .filter((e) => e.entity_type === 'investor')
    .reduce((sum, entry) => sum + (entry.invested_amount || 0), 0);

  const founders = capTable.filter((e) => e.entity_type === 'founder');
  const investors = capTable.filter((e) => e.entity_type === 'investor');
  const employees = capTable.filter((e) => e.entity_type === 'employee');
  const advisors = capTable.filter((e) => e.entity_type === 'advisor');
  const pools = capTable.filter((e) => e.entity_type === 'pool');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const shares = parseInt(formData.shares);
    const percentage = totalShares > 0 ? (shares / (totalShares + shares)) * 100 : parseFloat(formData.percentage);
    
    const entryData = {
      id: editingEntry?.id || `ct-${Date.now()}`,
      startup_id: currentStartup?.id || '',
      ...formData,
      entity_type: formData.entity_type as CapTableEntry['entity_type'],
      share_class: formData.share_class as CapTableEntry['share_class'],
      shares,
      percentage: parseFloat(percentage.toFixed(2)),
      cost_basis: formData.cost_basis ? parseFloat(formData.cost_basis) : undefined,
      vesting_months: formData.vesting_months ? parseInt(formData.vesting_months) : undefined,
      cliff_months: formData.cliff_months ? parseInt(formData.cliff_months) : undefined,
      invested_amount: formData.invested_amount ? parseFloat(formData.invested_amount) : undefined,
      valuation_cap: formData.valuation_cap ? parseFloat(formData.valuation_cap) : undefined,
      discount: formData.discount ? parseFloat(formData.discount) : undefined,
      vesting_start: formData.vesting_start || undefined,
      created_at: editingEntry?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    if (editingEntry) {
      updateCapTableEntry(editingEntry.id, entryData);
    } else {
      addCapTableEntry(entryData);
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleNewEntry = () => {
    resetForm();
    setFormData({...formData, vesting_months: '48', cliff_months: '12', share_class: 'common'});
    setIsDialogOpen(true);
  };

  const handleEdit = (entry: any) => {
    setEditingEntry(entry);
    setFormData({
      name: entry.name,
      entity_type: entry.entity_type,
      shares: entry.shares.toString(),
      share_class: entry.share_class,
      percentage: entry.percentage.toString(),
      cost_basis: entry.cost_basis?.toString() || '',
      vesting_start: entry.vesting_start?.split('T')[0] || '',
      vesting_months: entry.vesting_months?.toString() || '48',
      cliff_months: entry.cliff_months?.toString() || '12',
      invested_amount: entry.invested_amount?.toString() || '',
      valuation_cap: entry.valuation_cap?.toString() || '',
      discount: entry.discount?.toString() || '',
      notes: entry.notes || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this cap table entry?')) {
      deleteCapTableEntry(id);
    }
  };

  const resetForm = () => {
    setEditingEntry(null);
    setFormData({
      name: '',
      entity_type: 'founder',
      shares: '',
      share_class: 'common',
      percentage: '',
      cost_basis: '',
      vesting_start: '',
      vesting_months: '48',
      cliff_months: '12',
      invested_amount: '',
      valuation_cap: '',
      discount: '',
      notes: '',
    });
  };

  const getVestingStatus = (entry: any) => {
    if (!entry.vesting_start || !entry.vesting_months) return { status: 'N/A', progress: 0 };
    const start = new Date(entry.vesting_start);
    const now = new Date();
    const monthsElapsed = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
    const totalMonths = entry.vesting_months;
    const cliffMonths = entry.cliff_months || 0;
    
    if (monthsElapsed < cliffMonths) {
      return { status: 'Cliff', progress: 0 };
    }
    if (monthsElapsed >= totalMonths) {
      return { status: 'Fully Vested', progress: 100 };
    }
    const vestedMonths = monthsElapsed - cliffMonths;
    const vestingMonths = totalMonths - cliffMonths;
    return { status: 'Vesting', progress: Math.round((vestedMonths / vestingMonths) * 100) };
  };

  const dilutionScenario = (newShares: number, newInvestment: number, preMoneyVal: number) => {
    const postMoney = preMoneyVal + newInvestment;
    const newPercentage = (newShares / (totalShares + newShares)) * 100;
    const dilution = capTable.map((entry) => ({
      ...entry,
      newPercentage: ((entry.shares / (totalShares + newShares)) * 100).toFixed(2),
      dilution: ((entry.percentage - (entry.shares / (totalShares + newShares)) * 100)).toFixed(2),
    }));
    return { postMoney, newPercentage, dilution };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cap Table Management</h1>
          <p className="text-muted-foreground">Track ownership, model dilution, and manage equity grants</p>
        </div>
        <Button onClick={handleNewEntry}><Plus className="h-4 w-4 mr-2" />Add Stakeholder</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Founders</p>
                <p className="text-2xl font-bold">{founders.reduce((s, e) => s + e.percentage, 0).toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Investors</p>
                <p className="text-2xl font-bold">{investors.reduce((s, e) => s + e.percentage, 0).toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Employees</p>
                <p className="text-2xl font-bold">{(employees.reduce((s, e) => s + e.percentage, 0) + pools.reduce((s, e) => s + e.percentage, 0)).toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Invested</p>
                <p className="text-2xl font-bold">{formatCurrency(totalInvested)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="table" className="w-full">
        <TabsList>
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="visual">Visualization</TabsTrigger>
          <TabsTrigger value="vesting">Vesting</TabsTrigger>
          <TabsTrigger value="dilution">Dilution Modeler</TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Cap Table Entries ({capTable.length} total)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Stakeholder</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead className="text-right">Shares</TableHead>
                      <TableHead className="text-right">%</TableHead>
                      <TableHead className="text-right">Invested</TableHead>
                      <TableHead className="text-right">Price/Share</TableHead>
                      <TableHead>Vesting</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {capTable.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                          No cap table entries. Add your first stakeholder!
                        </TableCell>
                      </TableRow>
                    ) : (
                      [...capTable].sort((a, b) => b.percentage - a.percentage).map((entry, index) => {
                        const typeInfo = entityTypes.find((t) => t.value === entry.entity_type);
                        const vesting = getVestingStatus(entry);
                        return (
                          <TableRow key={entry.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-medium" style={{ backgroundColor: typeInfo?.color }}>
                                  {entry.name.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-medium">{entry.name}</p>
                                  <p className="text-xs text-muted-foreground">{entry.notes || 'No notes'}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={cn(typeInfo?.color)}>{typeInfo?.label}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">{entry.share_class}</Badge>
                            </TableCell>
                            <TableCell className="text-right font-mono">{formatNumber(entry.shares)}</TableCell>
                            <TableCell className="text-right font-semibold">{entry.percentage.toFixed(2)}%</TableCell>
                            <TableCell className="text-right">
                              {entry.invested_amount ? formatCurrency(entry.invested_amount) : '-'}
                            </TableCell>
                            <TableCell className="text-right">
                              {entry.cost_basis ? formatCurrency(entry.cost_basis, 'USD', 4) : '-'}
                            </TableCell>
                            <TableCell>
                              {entry.vesting_months ? (
                                <div className="flex items-center gap-2">
                                  <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${vesting.progress}%` }} />
                                  </div>
                                  <span className="text-xs text-muted-foreground">{vesting.status}</span>
                                </div>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button variant="ghost" size="icon" onClick={() => handleEdit(entry)}><Edit className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(entry.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4 pt-4 border-t flex items-center justify-between">
                <span className="font-semibold">Total Shares: {formatNumber(totalShares)}</span>
                <span className="font-semibold text-primary">100.00%</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visual" className="mt-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Ownership Breakdown</CardTitle></CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={capTable.map((e, i) => ({ name: e.name, value: e.percentage, color: COLORS[i % COLORS.length] }))}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                      >
                        {capTable.map((_, i) => <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip formatter={(value: number) => [value.toFixed(2) + '%', '']} />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>By Entity Type</CardTitle></CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={[
                          { name: 'Founders', value: founders.reduce((s, e) => s + e.percentage, 0), color: '#3B82F6' },
                          { name: 'Investors', value: investors.reduce((s, e) => s + e.percentage, 0), color: '#F59E0B' },
                          { name: 'Employees', value: employees.reduce((s, e) => s + e.percentage, 0), color: '#10B981' },
                          { name: 'Advisors', value: advisors.reduce((s, e) => s + e.percentage, 0), color: '#8B5CF6' },
                          { name: 'Option Pool', value: pools.reduce((s, e) => s + e.percentage, 0), color: '#6B7280' },
                        ].filter(d => d.value > 0)}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                      >
                        {[
                          { name: 'Founders', color: '#3B82F6' },
                          { name: 'Investors', color: '#F59E0B' },
                          { name: 'Employees', color: '#10B981' },
                          { name: 'Advisors', color: '#8B5CF6' },
                          { name: 'Option Pool', color: '#6B7280' },
                        ].map((c, i) => <Cell key={`cell-${i}`} fill={c.color} />)}
                      </Pie>
                      <Tooltip formatter={(value: number) => [value.toFixed(2) + '%', '']} />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="vesting" className="mt-4">
          <Card>
            <CardHeader><CardTitle>Vesting Schedules</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {capTable.filter((e) => e.vesting_months && e.vesting_start).map((entry) => {
                  const vesting = getVestingStatus(entry);
                  const start = new Date(entry.vesting_start!);
                  const end = new Date(start);
                  end.setMonth(end.getMonth() + entry.vesting_months!);
                  const cliffDate = new Date(start);
                  cliffDate.setMonth(cliffDate.getMonth() + (entry.cliff_months || 0));
                  
                  return (
                    <div key={entry.id} className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{entry.name}</p>
                            <p className="text-sm text-muted-foreground">{formatNumber(entry.shares)} shares • {entry.percentage.toFixed(2)}%</p>
                          </div>
                        </div>
                        <Badge variant={vesting.status === 'Fully Vested' ? 'success' : vesting.status === 'Cliff' ? 'warning' : 'outline'}>
                          {vesting.status}
                        </Badge>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${vesting.progress}%` }} />
                      </div>
                      <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                        <span>Start: {start.toLocaleDateString()}</span>
                        <span>Cliff: {cliffDate.toLocaleDateString()}</span>
                        <span>End: {end.toLocaleDateString()}</span>
                      </div>
                    </div>
                  );
                })}
                {capTable.filter((e) => e.vesting_months && e.vesting_start).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No vesting schedules found. Add vesting details to stakeholders to see them here.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dilution" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Dilution Modeler</CardTitle>
                <Badge variant="outline">Beta</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-medium">New Round Parameters</h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Pre-Money Valuation ($)</Label>
                      <Input type="number" placeholder="10000000" defaultValue="10000000" />
                    </div>
                    <div className="space-y-2">
                      <Label>New Investment ($)</Label>
                      <Input type="number" placeholder="2500000" defaultValue="2500000" />
                    </div>
                    <div className="space-y-2">
                      <Label>New Shares Issued</Label>
                      <Input type="number" placeholder="2500000" defaultValue="2500000" />
                    </div>
                    <div className="space-y-2">
                      <Label>Option Pool Increase (%)</Label>
                      <Input type="number" placeholder="10" defaultValue="10" />
                    </div>
                  </div>
                  <Button className="w-full"><Calculator className="h-4 w-4 mr-2" />Calculate Dilution</Button>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">Projected Ownership</h4>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Stakeholder</TableHead>
                          <TableHead className="text-right">Current %</TableHead>
                          <TableHead className="text-right">Post-Round %</TableHead>
                          <TableHead className="text-right">Dilution</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {capTable.map((entry) => (
                          <TableRow key={entry.id}>
                            <TableCell>{entry.name}</TableCell>
                            <TableCell className="text-right">{entry.percentage.toFixed(2)}%</TableCell>
                            <TableCell className="text-right text-muted-foreground">{(entry.percentage * 0.8).toFixed(2)}%</TableCell>
                            <TableCell className="text-right text-red-600">-{(entry.percentage * 0.2).toFixed(2)}%</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingEntry ? 'Edit Stakeholder' : 'Add Stakeholder'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="entity_type">Entity Type *</Label>
                <Select value={formData.entity_type} onValueChange={(v) => setFormData({...formData, entity_type: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {entityTypes.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="shares">Shares *</Label>
                <Input id="shares" type="number" value={formData.shares} onChange={(e) => setFormData({...formData, shares: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="share_class">Share Class</Label>
                <Select value={formData.share_class} onValueChange={(v) => setFormData({...formData, share_class: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {shareClasses.map((c) => <SelectItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="percentage">% (auto-calculated)</Label>
                <Input id="percentage" value={formData.percentage} disabled />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="invested_amount">Invested Amount ($)</Label>
                <Input id="invested_amount" type="number" value={formData.invested_amount} onChange={(e) => setFormData({...formData, invested_amount: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="valuation_cap">Valuation Cap ($)</Label>
                <Input id="valuation_cap" type="number" value={formData.valuation_cap} onChange={(e) => setFormData({...formData, valuation_cap: e.target.value})} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="discount">Discount (%)</Label>
                <Input id="discount" type="number" step="0.1" value={formData.discount} onChange={(e) => setFormData({...formData, discount: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cost_basis">Cost Basis/Share ($)</Label>
                <Input id="cost_basis" type="number" step="0.0001" value={formData.cost_basis} onChange={(e) => setFormData({...formData, cost_basis: e.target.value})} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="vesting_start">Vesting Start Date</Label>
                <Input id="vesting_start" type="date" value={formData.vesting_start} onChange={(e) => setFormData({...formData, vesting_start: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vesting_months">Vesting Period (months)</Label>
                <Input id="vesting_months" type="number" value={formData.vesting_months} onChange={(e) => setFormData({...formData, vesting_months: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cliff_months">Cliff (months)</Label>
                <Input id="cliff_months" type="number" value={formData.cliff_months} onChange={(e) => setFormData({...formData, cliff_months: e.target.value})} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <textarea id="notes" className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit">{editingEntry ? 'Update' : 'Add'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}