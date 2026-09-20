export interface Startup {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  description?: string;
  industry?: string;
  stage: 'idea' | 'pre-seed' | 'seed' | 'series-a' | 'series-b' | 'growth';
  founded_date: string;
  website?: string;
  founder_name?: string;
  email?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Investor {
  id: string;
  startup_id: string;
  name: string;
  firm?: string;
  email?: string;
  linkedin?: string;
  twitter?: string;
  type: 'angel' | 'vc' | 'corporate' | 'accelerator' | 'fund';
  stage_focus: string[];
  check_size_min?: number;
  check_size_max?: number;
  portfolio_companies?: string[];
  status: 'prospect' | 'contacted' | 'meeting' | 'due-diligence' | 'term-sheet' | 'invested' | 'passed';
  last_contact?: string;
  next_followup?: string;
  notes?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface FundraisingRound {
  id: string;
  startup_id: string;
  name: string;
  target_amount: number;
  raised_amount: number;
  currency: string;
  valuation_pre?: number;
  valuation_post?: number;
  instrument: 'equity' | 'safe' | 'convertible-note' | 'token';
  status: 'planning' | 'active' | 'closed' | 'paused';
  opened_date?: string;
  closed_date?: string;
  investors: string[];
  documents: FundraisingDocument[];
  created_at: string;
  updated_at: string;
}

export interface FundraisingDocument {
  id: string;
  round_id: string;
  name: string;
  type: 'pitch-deck' | 'financial-model' | 'data-room' | 'legal' | 'other';
  url: string;
  version: number;
  created_at: string;
}

export interface FinancialProjection {
  id: string;
  startup_id: string;
  name: string;
  scenario: 'conservative' | 'base' | 'aggressive';
  months: number;
  starting_cash: number;
  monthly_revenue: MonthlyProjection[];
  monthly_expenses: MonthlyProjection[];
  assumptions: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface MonthlyProjection {
  month: number;
  revenue: number;
  expenses: number;
  net_burn: number;
  cash_balance: number;
  headcount: number;
  arr?: number;
  mrr?: number;
}

export interface CapTableEntry {
  id: string;
  startup_id: string;
  name: string;
  entity_type: 'founder' | 'employee' | 'advisor' | 'investor' | 'pool';
  shares: number;
  share_class: 'common' | 'preferred' | 'options';
  percentage: number;
  cost_basis?: number;
  vesting_start?: string;
  vesting_months?: number;
  cliff_months?: number;
  invested_amount?: number;
  valuation_cap?: number;
  discount?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface SafeNote {
  id: string;
  startup_id: string;
  investor_id: string;
  investor_name: string;
  amount: number;
  valuation_cap?: number;
  discount?: number;
  mfn?: boolean;
  issue_date: string;
  maturity_date?: string;
  status: 'active' | 'converted' | 'expired';
  conversion_details?: ConversionDetails;
  created_at: string;
  updated_at: string;
}

export interface ConversionDetails {
  conversion_price?: number;
  shares_issued?: number;
  conversion_date?: string;
  qualified_financing?: boolean;
}

export interface MetricSnapshot {
  id: string;
  startup_id: string;
  date: string;
  mrr: number;
  arr: number;
  revenue: number;
  customers: number;
  new_customers: number;
  churned_customers: number;
  churn_rate: number;
  cac: number;
  ltv: number;
  ltv_cac_ratio: number;
  gross_margin: number;
  burn_rate: number;
  runway_months: number;
  cash_balance: number;
  headcount: number;
  created_at: string;
}

export interface InvestorUpdate {
  id: string;
  startup_id: string;
  title: string;
  period_start: string;
  period_end: string;
  highlights: string[];
  challenges: string[];
  asks: string[];
  metrics: Record<string, unknown>;
  financials: {
    revenue: number;
    expenses: number;
    cash_balance: number;
    runway_months: number;
  };
  sent_at?: string;
  recipients: string[];
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: 'founder' | 'admin' | 'member' | 'viewer';
  startup_id?: string;
  created_at: string;
  updated_at: string;
}