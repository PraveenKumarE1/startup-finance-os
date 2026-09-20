'use client';

import * as React from 'react';
import Link from 'next/link';
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
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Investor } from '@/lib/types';
import {
  Plus,
  Search,
  Filter,
  Mail,
  Linkedin,
  Twitter,
  Calendar,
  DollarSign,
  Building2,
  User,
  Trash2,
  Edit,
  Eye,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const statusOptions = [
  { value: 'prospect', label: 'Prospect', color: 'bg-gray-100 text-gray-600' },
  { value: 'contacted', label: 'Contacted', color: 'bg-blue-100 text-blue-600' },
  { value: 'meeting', label: 'Meeting', color: 'bg-yellow-100 text-yellow-600' },
  { value: 'due-diligence', label: 'Due Diligence', color: 'bg-orange-100 text-orange-600' },
  { value: 'term-sheet', label: 'Term Sheet', color: 'bg-purple-100 text-purple-600' },
  { value: 'invested', label: 'Invested', color: 'bg-green-100 text-green-600' },
  { value: 'passed', label: 'Passed', color: 'bg-red-100 text-red-600' },
];

const typeOptions = ['angel', 'vc', 'corporate', 'accelerator', 'fund'];

export default function FundraisingPage() {
  const { investors, addInvestor, updateInvestor, deleteInvestor, rounds, currentStartup } = useAppStore();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [typeFilter, setTypeFilter] = React.useState<string>('all');
  const [sortBy, setSortBy] = React.useState<'name' | 'status' | 'last_contact' | 'check_size'>('last_contact');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('desc');
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingInvestor, setEditingInvestor] = React.useState<any>(null);
  const [formData, setFormData] = React.useState({
    name: '',
    firm: '',
    email: '',
    linkedin: '',
    twitter: '',
    type: 'vc',
    stage_focus: '',
    check_size_min: '',
    check_size_max: '',
    status: 'prospect',
    last_contact: '',
    next_followup: '',
    notes: '',
    tags: '',
  });

  const filteredInvestors = investors
    .filter((inv) => {
      if (searchQuery && !inv.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !inv.firm?.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !inv.email?.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (statusFilter !== 'all' && inv.status !== statusFilter) return false;
      if (typeFilter !== 'all' && inv.type !== typeFilter) return false;
      return true;
    })
    .sort((a, b) => {
      let aVal: string | number | undefined = String(a[sortBy as keyof typeof a] ?? '');
      let bVal: string | number | undefined = String(b[sortBy as keyof typeof b] ?? '');
      if (sortBy === 'check_size') {
        aVal = a.check_size_max || 0;
        bVal = b.check_size_max || 0;
      }
      if (typeof aVal === 'string') { aVal = aVal.toLowerCase(); }
      if (typeof bVal === 'string') { bVal = bVal.toLowerCase(); }
      if ((aVal ?? '') < (bVal ?? '')) return sortOrder === 'asc' ? -1 : 1;
      if ((aVal ?? '') > (bVal ?? '')) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  const activeRound = rounds.find((r) => r.status === 'active');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const investorData = {
      id: editingInvestor?.id || `inv-${Date.now()}`,
      startup_id: currentStartup?.id || '',
      ...formData,
      type: formData.type as Investor['type'],
      status: formData.status as Investor['status'],
      stage_focus: formData.stage_focus.split(',').map((s: string) => s.trim()).filter(Boolean),
      check_size_min: formData.check_size_min ? parseInt(formData.check_size_min) : undefined,
      check_size_max: formData.check_size_max ? parseInt(formData.check_size_max) : undefined,
      tags: formData.tags.split(',').map((s: string) => s.trim()).filter(Boolean),
      last_contact: formData.last_contact || undefined,
      next_followup: formData.next_followup || undefined,
      created_at: editingInvestor?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    if (editingInvestor) {
      updateInvestor(editingInvestor.id, investorData);
    } else {
      addInvestor(investorData);
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (investor: any) => {
    setEditingInvestor(investor);
    setFormData({
      name: investor.name,
      firm: investor.firm || '',
      email: investor.email || '',
      linkedin: investor.linkedin || '',
      twitter: investor.twitter || '',
      type: investor.type,
      stage_focus: investor.stage_focus?.join(', ') || '',
      check_size_min: investor.check_size_min?.toString() || '',
      check_size_max: investor.check_size_max?.toString() || '',
      status: investor.status,
      last_contact: investor.last_contact ? investor.last_contact.split('T')[0] : '',
      next_followup: investor.next_followup ? investor.next_followup.split('T')[0] : '',
      notes: investor.notes || '',
      tags: investor.tags?.join(', ') || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this investor?')) {
      deleteInvestor(id);
    }
  };

  const resetForm = () => {
    setEditingInvestor(null);
    setFormData({
      name: '',
      firm: '',
      email: '',
      linkedin: '',
      twitter: '',
      type: 'vc',
      stage_focus: '',
      check_size_min: '',
      check_size_max: '',
      status: 'prospect',
      last_contact: '',
      next_followup: '',
      notes: '',
      tags: '',
    });
  };

  const openNewDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const statusCounts = statusOptions.reduce((acc, opt) => {
    acc[opt.value] = investors.filter((i) => i.status === opt.value).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Fundraising CRM</h1>
          <p className="text-muted-foreground">Manage your investor pipeline and fundraising rounds</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="gold" onClick={openNewDialog}><Plus className="h-4 w-4 mr-2" />Add Investor</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingInvestor ? 'Edit Investor' : 'Add New Investor'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 p-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="firm">Firm</Label>
                  <Input id="firm" value={formData.firm} onChange={(e) => setFormData({...formData, firm: e.target.value})} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select value={formData.type} onValueChange={(v) => setFormData({...formData, type: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {typeOptions.map((t) => <SelectItem key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input id="linkedin" value={formData.linkedin} onChange={(e) => setFormData({...formData, linkedin: e.target.value})} placeholder="linkedin.com/in/..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input id="twitter" value={formData.twitter} onChange={(e) => setFormData({...formData, twitter: e.target.value})} placeholder="@handle" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="stage_focus">Stage Focus (comma separated)</Label>
                  <Input id="stage_focus" value={formData.stage_focus} onChange={(e) => setFormData({...formData, stage_focus: e.target.value})} placeholder="seed, series-a" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="check_size_min">Min Check Size ($)</Label>
                  <Input id="check_size_min" type="number" value={formData.check_size_min} onChange={(e) => setFormData({...formData, check_size_min: e.target.value})} placeholder="500000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="check_size_max">Max Check Size ($)</Label>
                  <Input id="check_size_max" type="number" value={formData.check_size_max} onChange={(e) => setFormData({...formData, check_size_max: e.target.value})} placeholder="5000000" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(v) => setFormData({...formData, status: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_contact">Last Contact</Label>
                  <Input id="last_contact" type="date" value={formData.last_contact} onChange={(e) => setFormData({...formData, last_contact: e.target.value})} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="next_followup">Next Follow-up</Label>
                  <Input id="next_followup" type="date" value={formData.next_followup} onChange={(e) => setFormData({...formData, next_followup: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input id="tags" value={formData.tags} onChange={(e) => setFormData({...formData, tags: e.target.value})} placeholder="tier-1, fintech, warm-intro" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <textarea
                  id="notes"
                  className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit" variant="gold">{editingInvestor ? 'Update' : 'Add Investor'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {activeRound && (
        <Card className="border-primary">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>{activeRound.name}</CardTitle>
              <p className="text-muted-foreground tabular-nums">
                {formatCurrency(activeRound.raised_amount)} / {formatCurrency(activeRound.target_amount)} raised
                ({Math.round((activeRound.raised_amount / activeRound.target_amount) * 100)}%)
              </p>
            </div>
            <Badge variant="success">Active</Badge>
          </CardHeader>
          <CardContent>
            <div className="h-4 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${(activeRound.raised_amount / activeRound.target_amount) * 100}%` }}
              />
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-sm text-muted-foreground">Pre-money Valuation</p>
                <p className="text-lg font-semibold tabular-nums">{activeRound.valuation_pre ? formatCurrency(activeRound.valuation_pre) : 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Post-money Valuation</p>
                <p className="text-lg font-semibold tabular-nums">{activeRound.valuation_post ? formatCurrency(activeRound.valuation_post) : 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Instrument</p>
                <p className="text-lg font-semibold capitalize">{activeRound.instrument}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <CardTitle className="tabular-nums">Investor Pipeline ({investors.length} total)</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search investors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]"><SelectValue placeholder="All Statuses" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {statusOptions.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label} ({statusCounts[s.value]})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[130px]"><SelectValue placeholder="All Types" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {typeOptions.map((t) => <SelectItem key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="table" className="w-full">
            <TabsList>
              <TabsTrigger value="table">Table</TabsTrigger>
              <TabsTrigger value="kanban">Kanban</TabsTrigger>
            </TabsList>
            <TabsContent value="table">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <Button variant="ghost" size="sm" className="h-auto p-0" onClick={() => { setSortBy('name'); setSortOrder(sortBy === 'name' && sortOrder === 'asc' ? 'desc' : 'asc'); }}>
                          Name <ChevronDown className="h-3 w-3 ml-1" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button variant="ghost" size="sm" className="h-auto p-0" onClick={() => { setSortBy('status'); setSortOrder(sortBy === 'status' && sortOrder === 'asc' ? 'desc' : 'asc'); }}>
                          Status <ChevronDown className="h-3 w-3 ml-1" />
                        </Button>
                      </TableHead>
                      <TableHead>Firm</TableHead>
                      <TableHead>
                        <Button variant="ghost" size="sm" className="h-auto p-0" onClick={() => { setSortBy('check_size'); setSortOrder(sortBy === 'check_size' && sortOrder === 'asc' ? 'desc' : 'asc'); }}>
                          Check Size <ChevronDown className="h-3 w-3 ml-1" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button variant="ghost" size="sm" className="h-auto p-0" onClick={() => { setSortBy('last_contact'); setSortOrder(sortBy === 'last_contact' && sortOrder === 'asc' ? 'desc' : 'asc'); }}>
                          Last Contact <ChevronDown className="h-3 w-3 ml-1" />
                        </Button>
                      </TableHead>
                      <TableHead>Next Follow-up</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvestors.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No investors found. Add your first investor to get started!
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredInvestors.map((investor) => {
                        const statusOpt = statusOptions.find((s) => s.value === investor.status);
                        return (
                          <TableRow key={investor.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                  <User className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                  <Link href={`/dashboard/fundraising/investor?id=${investor.id}`} className="font-medium transition-colors hover:text-gold-dark dark:hover:text-gold-light">
                                    {investor.name}
                                  </Link>
                                  <p className="text-xs text-muted-foreground">{investor.email}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={cn(statusOpt?.color)}>
                                {statusOpt?.label}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{investor.firm || '-'}</p>
                                <p className="text-xs text-muted-foreground capitalize">{investor.type}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              {investor.check_size_min || investor.check_size_max ? (
                                `${formatCurrency(investor.check_size_min || 0)} - ${formatCurrency(investor.check_size_max || 0)}`
                              ) : (
                                <span className="text-muted-foreground">Not specified</span>
                              )}
                            </TableCell>
                            <TableCell>{investor.last_contact ? formatDate(investor.last_contact) : '-'}</TableCell>
                            <TableCell>{investor.next_followup ? formatDate(investor.next_followup) : '-'}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button variant="ghost" size="icon" onClick={() => handleEdit(investor)}><Edit className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(investor.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="kanban">
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-4">
                {statusOptions.map((stage) => (
                  <div key={stage.value} className="bg-muted/50 rounded-lg p-3 min-h-[400px]">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="outline" className={cn(stage.color)}>
                        {stage.label}
                      </Badge>
                      <span className="text-xs text-muted-foreground tabular-nums">{statusCounts[stage.value]}</span>
                    </div>
                    <div className="space-y-2 min-h-[300px]">
                      {filteredInvestors.filter((inv) => inv.status === stage.value).map((investor) => (
                        <Link
                          key={investor.id}
                          href={`/dashboard/fundraising/investor?id=${investor.id}`}
                          className="block bg-card border rounded-lg p-3 hover:shadow-md hover:border-gold-light/50 transition-shadow cursor-pointer"
                        >
                          <p className="font-medium">{investor.name}</p>
                          <p className="text-xs text-muted-foreground">{investor.firm || 'No firm'}</p>
                          <div className="flex items-center gap-2 mt-2 text-xs">
                            {investor.check_size_max && (
                              <span className="text-green-600 tabular-nums">${(investor.check_size_max / 1000).toFixed(0)}k max</span>
                            )}
                            {investor.next_followup && (
                              <span className="text-orange-600 flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(investor.next_followup)}
                              </span>
                            )}
                          </div>
                        </Link>
                      ))}
                      {filteredInvestors.filter((inv) => inv.status === stage.value).length === 0 && (
                        <div className="text-center text-muted-foreground text-sm py-8">Drop investors here</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}