'use client';

import * as React from 'react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  Plus,
  Send,
  Eye,
  Clock,
  CheckCircle2,
  Mail,
  FileText,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  Calendar,
  Download,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface InvestorUpdateItem {
  id: string;
  title: string;
  period_start: string;
  period_end: string;
  highlights: string[];
  challenges: string[];
  asks: string[];
  metrics: {
    mrr: number;
    customers: number;
    growth: number;
    runway_months: number;
  };
  status: 'draft' | 'sent';
  sent_at?: string;
  recipients: string[];
}

const demoUpdates: InvestorUpdateItem[] = [
  {
    id: 'update-1',
    title: 'Q1 2024 Investor Update',
    period_start: '2024-01-01',
    period_end: '2024-03-31',
    highlights: [
      'MRR grew 4.1x from $45k to $185k',
      'Closed 6 design partner deals',
      'Launched AI-powered auto-categorization feature',
      'Hired 3 senior engineers',
    ],
    challenges: [
      'Sales cycle longer than expected (45 vs 30 days)',
      '2 enterprise deals slipped to next quarter',
    ],
    asks: [
      'Introductions to fintech buyers at large banks',
      'Feedback on pricing for enterprise tier',
    ],
    metrics: {
      mrr: 185000,
      customers: 42,
      growth: 412,
      runway_months: 8,
    },
    status: 'sent',
    sent_at: '2024-04-05T10:00:00Z',
    recipients: ['Sarah Chen (Sequoia)', 'Marcus Johnson (a16z)', 'Emily Rodriguez (YC)'],
  },
  {
    id: 'update-2',
    title: 'May 2024 Investor Update',
    period_start: '2024-05-01',
    period_end: '2024-05-31',
    highlights: [
      'MRR crossed $250k ARR milestone',
      'Won enterprise contract with regional bank',
      'Partnered with 3 accounting platforms',
    ],
    challenges: [
      'Hiring pipeline weak for senior product role',
    ],
    asks: [
      'Referrals for senior product managers',
      'Warm intros to Series A leads',
    ],
    metrics: {
      mrr: 250000,
      customers: 55,
      growth: 35,
      runway_months: 7,
    },
    status: 'sent',
    sent_at: '2024-06-03T10:00:00Z',
    recipients: ['Sarah Chen (Sequoia)', 'Emily Rodriguez (YC)'],
  },
  {
    id: 'update-3',
    title: 'June 2024 Investor Update',
    period_start: '2024-06-01',
    period_end: '2024-06-30',
    highlights: [
      'Achieved $300k MRR',
      'Closed $1.8M seed round at $12.5M post',
      'Hired VP of Sales',
    ],
    challenges: [
      'Feature requests outpacing roadmap',
    ],
    asks: [
      'Series A intros for Q4',
      'Feedback on future funding strategy',
    ],
    metrics: {
      mrr: 300000,
      customers: 68,
      growth: 20,
      runway_months: 12,
    },
    status: 'draft',
    recipients: ['Sarah Chen (Sequoia)'],
  },
];

const statusIcons = {
  sent: CheckCircle2,
  draft: Clock,
};

export default function InvestorUpdatesPage() {
  const { currentStartup, investors } = useAppStore();
  const [updates, setUpdates] = React.useState<InvestorUpdateItem[]>(demoUpdates);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [viewingUpdate, setViewingUpdate] = React.useState<InvestorUpdateItem | null>(null);
  const [formData, setFormData] = React.useState({
    title: '',
    period_start: '',
    period_end: '',
    highlights: '',
    challenges: '',
    asks: '',
    mrr: '',
    customers: '',
    growth: '',
    runway_months: '',
    recipients: [] as string[],
  });
  const [activeTab, setActiveTab] = React.useState<'templates' | 'sent'>('templates');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUpdate: InvestorUpdateItem = {
      id: `update-${Date.now()}`,
      title: formData.title,
      period_start: formData.period_start,
      period_end: formData.period_end,
      highlights: formData.highlights.split('\n').filter(Boolean),
      challenges: formData.challenges.split('\n').filter(Boolean),
      asks: formData.asks.split('\n').filter(Boolean),
      metrics: {
        mrr: parseFloat(formData.mrr) || 0,
        customers: parseInt(formData.customers) || 0,
        growth: parseFloat(formData.growth) || 0,
        runway_months: parseFloat(formData.runway_months) || 0,
      },
      status: 'draft',
      recipients: formData.recipients,
    };
    setUpdates((prev) => [newUpdate, ...prev]);
    setFormData({
      title: '',
      period_start: '',
      period_end: '',
      highlights: '',
      challenges: '',
      asks: '',
      mrr: '',
      customers: '',
      growth: '',
      runway_months: '',
      recipients: [],
    });
    setIsDialogOpen(false);
  };

  const handleSend = (id: string) => {
    setUpdates((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: 'sent' as const, sent_at: new Date().toISOString() }
          : u
      )
    );
  };

  const markAsSent = () => {
    if (viewingUpdate) {
      handleSend(viewingUpdate.id);
      setViewingUpdate({ ...viewingUpdate, status: 'sent' as const, sent_at: new Date().toISOString() });
    }
  };

  const openTemplate = () => {
    // Pre-fill with a template structure
    setFormData({
      title: `${currentStartup?.name} — Investor Update`,
      period_start: '',
      period_end: '',
      highlights: '',
      challenges: '',
      asks: '',
      mrr: '',
      customers: '',
      growth: '',
      runway_months: '',
      recipients: investors.filter((i) => i.status === 'invested').map((i) => i.name),
    });
    setIsDialogOpen(true);
  };

  const toggleRecipient = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      recipients: prev.recipients.includes(name)
        ? prev.recipients.filter((r) => r !== name)
        : [...prev.recipients, name],
    }));
  };

  const templateSections = [
    { title: 'Highlights', color: 'bg-green-100 text-green-700', icon: TrendingUp },
    { title: 'Challenges', color: 'bg-yellow-100 text-yellow-700', icon: AlertTriangle },
    { title: 'Asks', color: 'bg-blue-100 text-blue-700', icon: Sparkles },
    { title: 'Metrics Summary', color: 'bg-purple-100 text-purple-700', icon: BarGraphIcon },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Investor Updates</h1>
          <p className="text-muted-foreground">Keep investors aligned with professional monthly reports</p>
        </div>
        <Button onClick={openTemplate}><Plus className="h-4 w-4 mr-2" />New Update</Button>
      </div>

      {updates.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <Mail className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Updates Sent</p>
                  <p className="text-2xl font-bold">{updates.filter((u) => u.status === 'sent').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Drafts</p>
                  <p className="text-2xl font-bold">{updates.filter((u) => u.status === 'draft').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Eye className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Investors</p>
                  <p className="text-2xl font-bold">{investors.filter((i) => i.status !== 'passed' && i.status !== 'prospect').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="sent" className="w-full" onValueChange={(v) => setActiveTab(v as any)} value={activeTab}>
        <TabsList>
          <TabsTrigger value="sent">All Updates</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="sent" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Updates ({updates.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Recipients</TableHead>
                      <TableHead>Key Metrics</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {updates.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No updates yet. Create your first investor update!
                        </TableCell>
                      </TableRow>
                    ) : (
                      updates.map((update) => {
                        const StatusIcon = update.status === 'sent' ? CheckCircle2 : Clock;
                        return (
                          <TableRow key={update.id}>
                            <TableCell>
                              <button
                                className="text-left font-medium hover:text-primary hover:underline"
                                onClick={() => setViewingUpdate(update)}
                              >
                                {update.title}
                              </button>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1 text-sm">
                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                {formatDate(update.period_start)} — {formatDate(update.period_end)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex -space-x-2">
                                {update.recipients.slice(0, 3).map((r, i) => (
                                  <div key={r} className="h-7 w-7 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center text-[10px] font-bold" style={{ zIndex: 3 - i }}>
                                    {r.charAt(0)}
                                  </div>
                                ))}
                                {update.recipients.length > 3 && (
                                  <div className="h-7 w-7 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[10px] font-bold">
                                    +{update.recipients.length - 3}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-0.5">
                                <p className="text-sm">MRR: <span className="font-semibold">{formatCurrency(update.metrics.mrr)}</span></p>
                                <p className="text-xs text-muted-foreground">
                                  {update.metrics.customers} customers • {update.metrics.growth}% growth
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={update.status === 'sent' ? 'success' : 'secondary'}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {update.status === 'sent' ? 'Sent' : 'Draft'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button variant="ghost" size="icon" onClick={() => setViewingUpdate(update)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                                {update.status === 'draft' && (
                                  <Button variant="ghost" size="icon" className="text-green-600" onClick={() => handleSend(update.id)}>
                                    <Send className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="mt-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Update Template</CardTitle>
                <p className="text-sm text-muted-foreground">Standard structure used by top-tier founders</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {templateSections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <div key={section.title} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className={cn('p-2 rounded-lg', section.color)}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">{section.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {section.title === 'Highlights' && 'Top wins, growth milestones, product launches'}
                          {section.title === 'Challenges' && 'Hiring struggles, market shifts, what needs help'}
                          {section.title === 'Asks' && 'Intros, feedback, mentorship requests'}
                          {section.title === 'Metrics Summary' && 'MRR, churn, revenue, runway, ask for a coffee'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Best Practices</CardTitle>
                <p className="text-sm text-muted-foreground">What investors actually want to see</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { title: 'Be honest about challenges', desc: 'Investors are for the long haul. Flag problems early.', icon: AlertTriangle },
                  { title: 'Show traction honestly', desc: 'MRR, churn, CAC, LTV. Raw data beats polished stories.', icon: TrendingUp },
                  { title: 'Make specific asks', desc: '\"Introduce me to X at Y\" is 10x better than \"any help\".', icon: Sparkles },
                  { title: 'Set clear cadence', desc: 'Monthly or quarterly. Consistency builds trust.', icon: Calendar },
                ].map((tip) => {
                  const Icon = tip.icon;
                  return (
                    <div key={tip.title} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="p-2 rounded-lg bg-muted">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{tip.title}</p>
                        <p className="text-sm text-muted-foreground">{tip.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Investor Update</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="title">Title *</Label>
                <Input id="title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="period_start">Period Start</Label>
                <Input id="period_start" type="date" value={formData.period_start} onChange={(e) => setFormData({...formData, period_start: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="period_end">Period End</Label>
                <Input id="period_end" type="date" value={formData.period_end} onChange={(e) => setFormData({...formData, period_end: e.target.value})} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="highlights">Highlights (one per line)</Label>
                <textarea id="highlights" className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.highlights} onChange={(e) => setFormData({...formData, highlights: e.target.value})} placeholder={'MRR grew 40% MoM\nClosed 6 design partners'} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="challenges">Challenges (one per line)</Label>
                <textarea id="challenges" className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.challenges} onChange={(e) => setFormData({...formData, challenges: e.target.value})} placeholder={'Sales cycle longer than expected\nHiring pipeline weak'} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="asks">Asks (one per line)</Label>
                <textarea id="asks" className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.asks} onChange={(e) => setFormData({...formData, asks: e.target.value})} placeholder={'Intro to CFOs at banks\nFeedback on pricing'} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2 sm:col-span-2">
                <div className="space-y-2">
                  <Label htmlFor="mrr">MRR ($)</Label>
                  <Input id="mrr" type="number" value={formData.mrr} onChange={(e) => setFormData({...formData, mrr: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customers">Customers</Label>
                  <Input id="customers" type="number" value={formData.customers} onChange={(e) => setFormData({...formData, customers: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="growth">Growth (%)</Label>
                  <Input id="growth" type="number" value={formData.growth} onChange={(e) => setFormData({...formData, growth: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="runway_months">Runway (months)</Label>
                  <Input id="runway_months" type="number" value={formData.runway_months} onChange={(e) => setFormData({...formData, runway_months: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Recipients</Label>
                <div className="flex flex-wrap gap-2">
                  {investors.map((inv) => (
                    <button
                      key={inv.id}
                      type="button"
                      className={cn(
                        'px-3 py-1 rounded-full border text-sm transition-colors',
                        formData.recipients.includes(inv.name)
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'hover:bg-accent'
                      )}
                      onClick={() => toggleRecipient(inv.name)}
                    >
                      {inv.name} ({inv.firm})
                    </button>
                  ))}
                  {investors.length === 0 && (
                    <p className="text-sm text-muted-foreground">Add investors in the Fundraising module first</p>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Save Draft</Button>
              <Button type="submit">Create Draft</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewingUpdate} onOpenChange={(open) => !open && setViewingUpdate(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>{viewingUpdate?.title}</DialogTitle>
              {viewingUpdate && (
                <Badge variant={viewingUpdate.status === 'sent' ? 'success' : 'secondary'}>
                  {viewingUpdate.status === 'sent' ? 'Sent' : 'Draft'}
                </Badge>
              )}
            </div>
          </DialogHeader>
          {viewingUpdate && (
            <div className="space-y-5 p-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{formatDate(viewingUpdate.period_start)} — {formatDate(viewingUpdate.period_end)}</span>
                {viewingUpdate.sent_at && <span>Sent: {formatDate(viewingUpdate.sent_at)}</span>}
              </div>

              <div>
                <h4 className="text-sm font-semibold text-green-600 mb-2 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" /> What went well
                </h4>
                <ul className="space-y-1">
                  {viewingUpdate.highlights.map((h, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>

              {viewingUpdate.challenges.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-yellow-600 mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" /> Challenges
                  </h4>
                  <ul className="space-y-1">
                    {viewingUpdate.challenges.map((c, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="text-yellow-500 mt-1">•</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h4 className="text-sm font-semibold text-blue-600 mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" /> How you can help
                </h4>
                <ul className="space-y-1">
                  {viewingUpdate.asks.map((a, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      {a}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-xs text-muted-foreground">MRR</p>
                  <p className="font-semibold text-lg">{formatCurrency(viewingUpdate.metrics.mrr)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Customers</p>
                  <p className="font-semibold text-lg">{viewingUpdate.metrics.customers}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Growth</p>
                  <p className="font-semibold text-lg">{viewingUpdate.metrics.growth}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Runway</p>
                  <p className="font-semibold text-lg">{viewingUpdate.metrics.runway_months} mo</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Recipients</p>
                <div className="flex flex-wrap gap-2">
                  {viewingUpdate.recipients.map((r) => (
                    <Badge key={r} variant="outline">{r}</Badge>
                  ))}
                </div>
              </div>

              <DialogFooter className="border-t pt-4">
                <Button variant="outline" onClick={() => setViewingUpdate(null)}>Close</Button>
                {viewingUpdate.status === 'draft' && (
                  <Button className="text-white" onClick={markAsSent}>
                    <Send className="h-4 w-4 mr-2" /> Mark as Sent
                  </Button>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function BarGraphIcon({ className }: { className?: string }) {
  return <FileText className={className} />;
}