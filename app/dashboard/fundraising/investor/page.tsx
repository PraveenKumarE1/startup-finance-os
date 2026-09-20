'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Investor } from '@/lib/types';
import {
  ArrowLeft,
  Mail,
  Linkedin,
  Twitter,
  Building2,
  Calendar,
  DollarSign,
  Layers,
  Tags,
  FileText,
  Phone,
  MessageCircle,
  Clock,
  Landmark,
  BadgeCheck,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';

const statusMeta: Record<Investor['status'], { label: string; cls: string; dot: string }> = {
  prospect: { label: 'Prospect', cls: 'text-gray-700 dark:text-gray-300', dot: 'bg-gray-400' },
  contacted: { label: 'Contacted', cls: 'text-blue-700 dark:text-blue-300', dot: 'bg-blue-500' },
  meeting: { label: 'Meeting', cls: 'text-yellow-700 dark:text-yellow-300', dot: 'bg-yellow-500' },
  'due-diligence': { label: 'Due Diligence', cls: 'text-orange-700 dark:text-orange-300', dot: 'bg-orange-500' },
  'term-sheet': { label: 'Term Sheet', cls: 'text-purple-700 dark:text-purple-300', dot: 'bg-purple-500' },
  invested: { label: 'Invested', cls: 'text-emerald-700 dark:text-emerald-300', dot: 'bg-emerald-500' },
  passed: { label: 'Passed', cls: 'text-red-700 dark:text-red-300', dot: 'bg-red-500' },
};

const typeLabel: Record<Investor['type'], string> = {
  angel: 'Angel',
  vc: 'Venture Capital',
  corporate: 'Corporate',
  accelerator: 'Accelerator',
  fund: 'Fund',
};

function initials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function buildTimeline(investor: Investor) {
  const events: { date: string; title: string; detail: string; icon: React.ReactNode; tone: string }[] = [];
  if (investor.created_at) {
    events.push({
      date: investor.created_at,
      title: 'Added to pipeline',
      detail: `Logged by the founding team · ${investor.type === 'vc' ? 'introduced via warm path' : 'sourced directly'}`,
      icon: <Landmark className="h-3.5 w-3.5" />,
      tone: 'bg-[hsl(226_80%_60%)]',
    });
  }
  if (investor.last_contact) {
    events.push({
      date: investor.last_contact,
      title: investor.status === 'invested' ? 'Commitment confirmed' : 'Latest interaction',
      detail: investor.status === 'invested'
        ? 'Capital committed — wire received and recorded on the cap table.'
        : investor.notes?.slice(0, 110) || 'Progress call / meeting with the investors.',
      icon: investor.status === 'invested' ? <CheckCircle2 className="h-3.5 w-3.5" /> : <MessageCircle className="h-3.5 w-3.5" />,
      tone: investor.status === 'invested' ? 'bg-emerald-500' : 'bg-[hsl(38_92%_50%)]',
    });
  }
  if (investor.notes && investor.created_at) {
    const intro = new Date(investor.created_at);
    intro.setDate(intro.getDate() + 3);
    events.splice(events.length - 1, 0, {
      date: intro.toISOString(),
      title: 'Warm introduction',
      detail: 'Referral call scheduled — discussed stage focus and check size appetite.',
      icon: <Phone className="h-3.5 w-3.5" />,
      tone: 'bg-[hsl(160_80%_45%)]',
    });
  }
  events.sort((a, b) => (a.date < b.date ? 1 : -1));
  return events;
}

function InvestorDetail({ id }: { id: string }) {
  const { investors, updateInvestor, rounds, capTable, currentStartup } = useAppStore();
  const investor = investors.find((i) => i.id === id);
  const [noteDraft, setNoteDraft] = React.useState(investor?.notes ?? '');
  const [saved, setSaved] = React.useState(false);

  React.useEffect(() => {
    setNoteDraft(investor?.notes ?? '');
    setSaved(false);
  }, [investor?.id, investor?.notes]);

  if (!investor) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <Landmark className="h-7 w-7" />
        </div>
        <h1 className="font-display text-xl font-bold">Investor not found</h1>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          This contact may have been removed from your pipeline.
        </p>
        <Button variant="outline" className="mt-6" asChild>
          <Link href="/dashboard/fundraising"><ArrowLeft className="h-4 w-4" /> Back to pipeline</Link>
        </Button>
      </div>
    );
  }

  const meta = statusMeta[investor.status];
  const timeline = buildTimeline(investor);
  const invested = investor.status === 'invested';
  const linkedCapEntry = capTable.find(
    (e) => e.name.toLowerCase().includes(investor.name.toLowerCase()) || e.name.toLowerCase().includes(investor.firm?.toLowerCase() ?? '')
  );
  const activeRound = rounds.find((r) => r.status === 'active');

  const handleSaveNotes = () => {
    updateInvestor(investor.id, { notes: noteDraft, updated_at: new Date().toISOString() });
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 animate-fade-in-up">
      <div>
        <Link href="/dashboard/fundraising" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Investor pipeline
        </Link>
      </div>

      {/* Profile header */}
      <Card className="edge-highlight overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[hsl(38_92%_50%/0.12)] via-transparent to-[hsl(226_80%_55%/0.10)]" />
        <CardContent className="relative p-6 lg:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[hsl(226_70%_40%)] to-[hsl(226_50%_60%)] font-display text-2xl font-bold text-white shadow-navydark">
                {initials(investor.name)}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="font-display text-2xl font-bold tracking-tight">{investor.name}</h1>
                  <span className={`inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card/70 px-2.5 py-1 text-xs font-semibold ${meta.cls}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                    {meta.label}
                  </span>
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  {investor.firm && (
                    <span className="flex items-center gap-1.5">
                      <Building2 className="h-4 w-4" /> {investor.firm}
                      <span className="text-xs capitalize">· {typeLabel[investor.type]}</span>
                    </span>
                  )}
                  {investor.email && <span className="flex items-center gap-1.5"><Mail className="h-4 w-4" /> {investor.email}</span>}
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {investor.tags?.map((tag) => (
                    <Badge key={tag} variant="outline" className="capitalize">
                      <Tags className="h-3 w-3 mr-1" /> {tag}
                    </Badge>
                  ))}
                  <Badge variant="secondary" className="capitalize">{typeLabel[investor.type]}</Badge>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {investor.email && (
                <Button variant="outline" size="sm" asChild>
                  <a href={`mailto:${investor.email}`}><Mail className="h-4 w-4" /> Email</a>
                </Button>
              )}
              {investor.linkedin && (
                <Button size="icon" variant="ghost" asChild title="LinkedIn">
                  <a href={`https://${investor.linkedin.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer"><Linkedin className="h-4 w-4" /></a>
                </Button>
              )}
              {investor.twitter && (
                <Button size="icon" variant="ghost" asChild title="Twitter / X">
                  <a href={`https://twitter.com/${investor.twitter.replace(/^@/, '')}`} target="_blank" rel="noreferrer"><Twitter className="h-4 w-4" /></a>
                </Button>
              )}
            </div>
          </div>

          <Separator className="my-6" />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
              <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                <DollarSign className="h-3.5 w-3.5" /> Check size
              </p>
              <p className="mt-1 font-display text-lg font-bold tabular-nums">
                {investor.check_size_min || investor.check_size_max
                  ? `${formatCurrency(investor.check_size_min ?? 0)} – ${formatCurrency(investor.check_size_max ?? 0)}`
                  : 'Flexible'}
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
              <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                <Layers className="h-3.5 w-3.5" /> Stage focus
              </p>
              <p className="mt-1 font-display text-lg font-bold capitalize tabular-nums">
                {(investor.stage_focus ?? []).join(' · ') || 'Any'}
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
              <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                <TrendingUp className="h-3.5 w-3.5" /> Portfolio
              </p>
              <p className="mt-1 font-display text-lg font-bold tabular-nums">
                {investor.portfolio_companies?.length ?? 0}
                <span className="ml-1 text-xs font-medium text-muted-foreground">companies</span>
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
              <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                <Clock className="h-3.5 w-3.5" /> Next follow-up
              </p>
              <p className="mt-1 font-display text-lg font-bold">
                {investor.next_followup ? formatDate(investor.next_followup) : '—'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          {/* Notes */}
          <Card className="edge-highlight">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle>Notes & relationship</CardTitle>
              <Badge variant="outline">Internal</Badge>
            </CardHeader>
            <CardContent>
              <textarea
                className="nice-scroll min-h-[140px] w-full resize-y rounded-xl border border-border/70 bg-background/60 px-3.5 py-3 text-sm leading-relaxed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Capture call notes, objections, and next steps…"
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
              />
              <div className="mt-3 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Last updated {investor.updated_at ? formatDate(investor.updated_at) : '—'}
                </p>
                <Button size="sm" variant={saved ? 'secondary' : 'default'} onClick={handleSaveNotes}>
                  {saved ? (<><CheckCircle2 className="h-4 w-4" /> Saved</>) : 'Save notes'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Interaction timeline */}
          <Card className="edge-highlight">
            <CardHeader>
              <CardTitle>Interaction history</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">Chronological record of your relationship</p>
            </CardHeader>
            <CardContent>
              {timeline.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">No interactions recorded yet.</p>
              ) : (
                <ol className="relative ml-3 space-y-6 border-l border-border/70 pl-6">
                  {timeline.map((ev, i) => (
                    <li key={i} className="relative">
                      <span className={`absolute -left-[31px] top-0.5 flex h-6 w-6 items-center justify-center rounded-full text-white ${ev.tone}`}>
                        {ev.icon}
                      </span>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-display text-sm font-bold">{ev.title}</p>
                        <span className="text-xs text-muted-foreground">{formatDate(ev.date)}</span>
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{ev.detail}</p>
                    </li>
                  ))}
                </ol>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-2">
          {/* Portfolio */}
          <Card className="edge-highlight">
            <CardHeader>
              <CardTitle>Notable portfolio</CardTitle>
            </CardHeader>
            <CardContent>
              {investor.portfolio_companies?.length ? (
                <div className="flex flex-wrap gap-2">
                  {investor.portfolio_companies.map((c) => (
                    <span key={c} className="chip">
                      <BadgeCheck className="h-3.5 w-3.5 text-gold-dark dark:text-gold-light" /> {c}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No portfolio shown for this contact.</p>
              )}
            </CardContent>
          </Card>

          {/* Status & round */}
          <Card className="edge-highlight">
            <CardHeader>
              <CardTitle>Current position</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Pipeline stage</p>
                <div className="mt-2 flex items-center gap-2.5">
                  <span className={`h-2.5 w-2.5 rounded-full ${meta.dot}`} />
                  <span className="font-display text-base font-bold">{meta.label}</span>
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Last contact</p>
                <p className="mt-1 flex items-center gap-2 font-display text-base font-bold tabular-nums">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {investor.last_contact ? formatDate(investor.last_contact) : 'Not yet contacted'}
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Active round</p>
                <p className="mt-1 font-display text-base font-bold">
                  {activeRound?.name ?? 'No active round'}
                  <span className="ml-2 text-xs font-medium text-muted-foreground">
                    {activeRound ? formatCurrency(activeRound.target_amount) + ' target' : ''}
                  </span>
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Cap table</p>
                <p className="mt-1 font-display text-base font-bold tabular-nums">
                  {linkedCapEntry ? `${linkedCapEntry.percentage}% · ${linkedCapEntry.share_class}` : invested ? 'Invested — see cap table' : 'Not a holder yet'}
                </p>
                {linkedCapEntry ? (
                  <Button size="sm" variant="outline" className="mt-3 w-full" asChild>
                    <Link href="/dashboard/cap-table"><FileText className="h-3.5 w-3.5" /> View on cap table</Link>
                  </Button>
                ) : (
                  <p className="mt-3 text-xs text-muted-foreground">
                    Current runway with {currentStartup?.name ?? 'your'} round: check the dashboard.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function InvestorDetailRoute() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') ?? '';
  return <InvestorDetail id={id} />;
}

export default function InvestorDetailPage() {
  return (
    <React.Suspense fallback={<div className="py-24 text-center text-muted-foreground">Loading investor…</div>}>
      <InvestorDetailRoute />
    </React.Suspense>
  );
}