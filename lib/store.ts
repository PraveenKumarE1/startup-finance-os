import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Startup, Investor, FundraisingRound, FinancialProjection, CapTableEntry, MetricSnapshot } from '@/lib/types';

interface AppState {
  currentStartup: Startup | null;
  startups: Startup[];
  investors: Investor[];
  rounds: FundraisingRound[];
  projections: FinancialProjection[];
  capTable: CapTableEntry[];
  metrics: MetricSnapshot[];
  sidebarOpen: boolean;
  activeModule: string;

  setCurrentStartup: (startup: Startup | null) => void;
  setStartups: (startups: Startup[]) => void;
  addStartup: (startup: Startup) => void;
  updateStartup: (id: string, data: Partial<Startup>) => void;

  setInvestors: (investors: Investor[]) => void;
  addInvestor: (investor: Investor) => void;
  updateInvestor: (id: string, data: Partial<Investor>) => void;
  deleteInvestor: (id: string) => void;

  setRounds: (rounds: FundraisingRound[]) => void;
  addRound: (round: FundraisingRound) => void;
  updateRound: (id: string, data: Partial<FundraisingRound>) => void;

  setProjections: (projections: FinancialProjection[]) => void;
  addProjection: (projection: FinancialProjection) => void;
  updateProjection: (id: string, data: Partial<FinancialProjection>) => void;

  setCapTable: (entries: CapTableEntry[]) => void;
  addCapTableEntry: (entry: CapTableEntry) => void;
  updateCapTableEntry: (id: string, data: Partial<CapTableEntry>) => void;
  deleteCapTableEntry: (id: string) => void;

  setMetrics: (metrics: MetricSnapshot[]) => void;
  addMetricSnapshot: (snapshot: MetricSnapshot) => void;

  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setActiveModule: (module: string) => void;
}

const demoStartup: Startup = {
  id: 'demo-startup-1',
  name: 'OrbitFlow Studio',
  slug: 'orbitflow-studio',
  description: 'AI operating system for agencies and service businesses',
  industry: 'AI Ops / Digital Services',
  stage: 'growth',
  founded_date: '2022-09-10',
  website: 'https://orbitflow.ai',
  user_id: 'demo-user',
  created_at: '2024-01-15T10:00:00Z',
  updated_at: '2024-01-15T10:00:00Z',
};

const demoInvestors: Investor[] = [
  {
    id: 'inv-1',
    startup_id: 'demo-startup-1',
    name: 'Sarah Chen',
    firm: 'Sequoia Capital',
    email: 'sarah@sequoia.com',
    linkedin: 'linkedin.com/in/sarahchen',
    type: 'vc',
    stage_focus: ['seed', 'series-a'],
    check_size_min: 500000,
    check_size_max: 5000000,
    portfolio_companies: ['Stripe', 'Airbnb', 'DoorDash'],
    status: 'meeting',
    last_contact: '2024-01-10',
    next_followup: '2024-01-20',
    notes: 'Interested in AI fintech. Requested detailed financial model.',
    tags: ['tier-1', 'fintech-focus', 'warm-intro'],
    created_at: '2024-01-05T10:00:00Z',
    updated_at: '2024-01-10T10:00:00Z',
  },
  {
    id: 'inv-2',
    startup_id: 'demo-startup-1',
    name: 'Marcus Johnson',
    firm: 'Andreessen Horowitz',
    email: 'marcus@a16z.com',
    linkedin: 'linkedin.com/in/marcusj',
    type: 'vc',
    stage_focus: ['seed', 'series-a', 'series-b'],
    check_size_min: 1000000,
    check_size_max: 10000000,
    portfolio_companies: ['Coinbase', 'OpenAI', 'GitHub'],
    status: 'due-diligence',
    last_contact: '2024-01-12',
    next_followup: '2024-01-18',
    notes: 'Deep dive on unit economics scheduled. Strong interest.',
    tags: ['tier-1', 'ai-focus', 'hot-lead'],
    created_at: '2024-01-03T10:00:00Z',
    updated_at: '2024-01-12T10:00:00Z',
  },
  {
    id: 'inv-3',
    startup_id: 'demo-startup-1',
    name: 'Emily Rodriguez',
    firm: 'Y Combinator',
    email: 'emily@ycombinator.com',
    type: 'accelerator',
    stage_focus: ['pre-seed', 'seed'],
    check_size_min: 125000,
    check_size_max: 500000,
    portfolio_companies: ['Airbnb', 'Dropbox', 'Stripe'],
    status: 'invested',
    last_contact: '2023-12-01',
    notes: 'Invested in pre-seed round. Great mentor.',
    tags: ['alumni', 'mentor'],
    created_at: '2023-11-01T10:00:00Z',
    updated_at: '2023-12-01T10:00:00Z',
  },
];

const demoRounds: FundraisingRound[] = [
  {
    id: 'round-1',
    startup_id: 'demo-startup-1',
    name: 'Seed Round',
    target_amount: 2500000,
    raised_amount: 1800000,
    currency: 'USD',
    valuation_pre: 10000000,
    valuation_post: 12500000,
    instrument: 'safe',
    status: 'active',
    opened_date: '2024-01-01',
    investors: ['inv-1', 'inv-2', 'inv-3'],
    documents: [
      {
        id: 'doc-1',
        round_id: 'round-1',
        name: 'Seed Pitch Deck v3.2',
        type: 'pitch-deck',
        url: '/documents/pitch-deck.pdf',
        version: 3.2,
        created_at: '2024-01-05T10:00:00Z',
      },
      {
        id: 'doc-2',
        round_id: 'round-1',
        name: 'Financial Model - Base Case',
        type: 'financial-model',
        url: '/documents/financial-model.xlsx',
        version: 1.0,
        created_at: '2024-01-05T10:00:00Z',
      },
    ],
    created_at: '2024-01-01T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
];

const demoProjections: FinancialProjection[] = [
  {
    id: 'proj-1',
    startup_id: 'demo-startup-1',
    name: 'Base Case 2024',
    scenario: 'base',
    months: 18,
    starting_cash: 500000,
    monthly_revenue: [
      { month: 1, revenue: 15000, expenses: 85000, net_burn: -70000, cash_balance: 430000, headcount: 4, mrr: 15000, arr: 180000 },
      { month: 2, revenue: 22000, expenses: 90000, net_burn: -68000, cash_balance: 362000, headcount: 4, mrr: 22000, arr: 264000 },
      { month: 3, revenue: 35000, expenses: 95000, net_burn: -60000, cash_balance: 302000, headcount: 5, mrr: 35000, arr: 420000 },
      { month: 4, revenue: 50000, expenses: 110000, net_burn: -60000, cash_balance: 242000, headcount: 6, mrr: 50000, arr: 600000 },
      { month: 5, revenue: 75000, expenses: 125000, net_burn: -50000, cash_balance: 192000, headcount: 7, mrr: 75000, arr: 900000 },
      { month: 6, revenue: 100000, expenses: 140000, net_burn: -40000, cash_balance: 152000, headcount: 8, mrr: 100000, arr: 1200000 },
      { month: 7, revenue: 130000, expenses: 155000, net_burn: -25000, cash_balance: 127000, headcount: 9, mrr: 130000, arr: 1560000 },
      { month: 8, revenue: 160000, expenses: 170000, net_burn: -10000, cash_balance: 117000, headcount: 10, mrr: 160000, arr: 1920000 },
      { month: 9, revenue: 200000, expenses: 185000, net_burn: 15000, cash_balance: 132000, headcount: 11, mrr: 200000, arr: 2400000 },
      { month: 10, revenue: 240000, expenses: 200000, net_burn: 40000, cash_balance: 172000, headcount: 12, mrr: 240000, arr: 2880000 },
      { month: 11, revenue: 280000, expenses: 215000, net_burn: 65000, cash_balance: 237000, headcount: 13, mrr: 280000, arr: 3360000 },
      { month: 12, revenue: 320000, expenses: 230000, net_burn: 90000, cash_balance: 327000, headcount: 14, mrr: 320000, arr: 3840000 },
      { month: 13, revenue: 360000, expenses: 245000, net_burn: 115000, cash_balance: 442000, headcount: 15, mrr: 360000, arr: 4320000 },
      { month: 14, revenue: 400000, expenses: 260000, net_burn: 140000, cash_balance: 582000, headcount: 16, mrr: 400000, arr: 4800000 },
      { month: 15, revenue: 440000, expenses: 275000, net_burn: 165000, cash_balance: 747000, headcount: 17, mrr: 440000, arr: 5280000 },
      { month: 16, revenue: 480000, expenses: 290000, net_burn: 190000, cash_balance: 937000, headcount: 18, mrr: 480000, arr: 5760000 },
      { month: 17, revenue: 520000, expenses: 305000, net_burn: 215000, cash_balance: 1152000, headcount: 19, mrr: 520000, arr: 6240000 },
      { month: 18, revenue: 560000, expenses: 320000, net_burn: 240000, cash_balance: 1392000, headcount: 20, mrr: 560000, arr: 6720000 },
    ],
    monthly_expenses: [],
    assumptions: {
      'monthly-growth-rate': 0.25,
      'churn-rate': 0.03,
      'avg-contract-value': 5000,
      'sales-cycle-days': 45,
      'gross-margin': 0.8,
    },
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
];

const demoCapTable: CapTableEntry[] = [
  { id: 'ct-1', startup_id: 'demo-startup-1', name: 'Alex Founder', entity_type: 'founder', shares: 4000000, share_class: 'common', percentage: 40, cost_basis: 0.0001, vesting_start: '2023-06-15', vesting_months: 48, cliff_months: 12, created_at: '2023-06-15T10:00:00Z', updated_at: '2023-06-15T10:00:00Z' },
  { id: 'ct-2', startup_id: 'demo-startup-1', name: 'Jordan Founder', entity_type: 'founder', shares: 3000000, share_class: 'common', percentage: 30, cost_basis: 0.0001, vesting_start: '2023-06-15', vesting_months: 48, cliff_months: 12, created_at: '2023-06-15T10:00:00Z', updated_at: '2023-06-15T10:00:00Z' },
  { id: 'ct-3', startup_id: 'demo-startup-1', name: 'Option Pool', entity_type: 'pool', shares: 1500000, share_class: 'options', percentage: 15, created_at: '2023-06-15T10:00:00Z', updated_at: '2023-06-15T10:00:00Z' },
  { id: 'ct-4', startup_id: 'demo-startup-1', name: 'Y Combinator', entity_type: 'investor', shares: 750000, share_class: 'preferred', percentage: 7.5, invested_amount: 125000, valuation_cap: 5000000, created_at: '2023-12-01T10:00:00Z', updated_at: '2023-12-01T10:00:00Z' },
  { id: 'ct-5', startup_id: 'demo-startup-1', name: 'Angel Investor 1', entity_type: 'investor', shares: 375000, share_class: 'preferred', percentage: 3.75, invested_amount: 100000, valuation_cap: 8000000, created_at: '2023-12-15T10:00:00Z', updated_at: '2023-12-15T10:00:00Z' },
  { id: 'ct-6', startup_id: 'demo-startup-1', name: 'Angel Investor 2', entity_type: 'investor', shares: 375000, share_class: 'preferred', percentage: 3.75, invested_amount: 100000, valuation_cap: 8000000, created_at: '2023-12-15T10:00:00Z', updated_at: '2023-12-15T10:00:00Z' },
];

const demoMetrics: MetricSnapshot[] = [
  { id: 'm-1', startup_id: 'demo-startup-1', date: '2023-12-01', mrr: 45000, arr: 540000, revenue: 45000, customers: 12, new_customers: 3, churned_customers: 0, churn_rate: 0, cac: 2500, ltv: 15000, ltv_cac_ratio: 6, gross_margin: 0.78, burn_rate: 85000, runway_months: 5.9, cash_balance: 500000, headcount: 4, created_at: '2023-12-01T10:00:00Z' },
  { id: 'm-2', startup_id: 'demo-startup-1', date: '2024-01-01', mrr: 68000, arr: 816000, revenue: 68000, customers: 18, new_customers: 6, churned_customers: 0, churn_rate: 0, cac: 2200, ltv: 16500, ltv_cac_ratio: 7.5, gross_margin: 0.8, burn_rate: 95000, runway_months: 5.3, cash_balance: 500000, headcount: 5, created_at: '2024-01-01T10:00:00Z' },
  { id: 'm-3', startup_id: 'demo-startup-1', date: '2024-02-01', mrr: 95000, arr: 1140000, revenue: 95000, customers: 24, new_customers: 7, churned_customers: 1, churn_rate: 0.04, cac: 2000, ltv: 18000, ltv_cac_ratio: 9, gross_margin: 0.82, burn_rate: 110000, runway_months: 4.5, cash_balance: 500000, headcount: 6, created_at: '2024-02-01T10:00:00Z' },
];

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentStartup: demoStartup,
      startups: [demoStartup],
      investors: demoInvestors,
      rounds: demoRounds,
      projections: demoProjections,
      capTable: demoCapTable,
      metrics: demoMetrics,
      sidebarOpen: true,
      activeModule: 'dashboard',

      setCurrentStartup: (startup) => set({ currentStartup: startup }),
      setStartups: (startups) => set({ startups }),
      addStartup: (startup) => set((state) => ({ startups: [...state.startups, startup] })),
      updateStartup: (id, data) => set((state) => ({
        startups: state.startups.map((s) => (s.id === id ? { ...s, ...data } : s)),
        currentStartup: state.currentStartup?.id === id ? { ...state.currentStartup, ...data } : state.currentStartup,
      })),

      setInvestors: (investors) => set({ investors }),
      addInvestor: (investor) => set((state) => ({ investors: [...state.investors, investor] })),
      updateInvestor: (id, data) => set((state) => ({
        investors: state.investors.map((i) => (i.id === id ? { ...i, ...data } : i)),
      })),
      deleteInvestor: (id) => set((state) => ({
        investors: state.investors.filter((i) => i.id !== id),
      })),

      setRounds: (rounds) => set({ rounds }),
      addRound: (round) => set((state) => ({ rounds: [...state.rounds, round] })),
      updateRound: (id, data) => set((state) => ({
        rounds: state.rounds.map((r) => (r.id === id ? { ...r, ...data } : r)),
      })),

      setProjections: (projections) => set({ projections }),
      addProjection: (projection) => set((state) => ({ projections: [...state.projections, projection] })),
      updateProjection: (id, data) => set((state) => ({
        projections: state.projections.map((p) => (p.id === id ? { ...p, ...data } : p)),
      })),

      setCapTable: (capTable) => set({ capTable }),
      addCapTableEntry: (entry) => set((state) => ({ capTable: [...state.capTable, entry] })),
      updateCapTableEntry: (id, data) => set((state) => ({
        capTable: state.capTable.map((e) => (e.id === id ? { ...e, ...data } : e)),
      })),
      deleteCapTableEntry: (id) => set((state) => ({
        capTable: state.capTable.filter((e) => e.id !== id),
      })),

      setMetrics: (metrics) => set({ metrics }),
      addMetricSnapshot: (snapshot) => set((state) => ({ metrics: [...state.metrics, snapshot] })),

      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setActiveModule: (module) => set({ activeModule: module }),
    }),
    {
      name: 'startup-finance-os-storage',
      partialize: (state) => ({
        currentStartup: state.currentStartup,
        startups: state.startups,
        investors: state.investors,
        rounds: state.rounds,
        projections: state.projections,
        capTable: state.capTable,
        metrics: state.metrics,
        sidebarOpen: state.sidebarOpen,
        activeModule: state.activeModule,
      }),
    }
  )
);