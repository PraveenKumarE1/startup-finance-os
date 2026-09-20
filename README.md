# StartupFinance OS 🎯

**The financial operating system for early-stage startups.** A one-stop platform that takes a founder from idea validation all the way through Series A — fundraising CRM, financial modeling, cap table management, KPI tracking, and investor updates.

> Built as a **hackathon project** — runs fully in demo mode with realistic sample data, no backend required. Supabase-backed schema is included for a real multi-user deployment.

---

## ✨ Features

| Module | What it does |
|---|---|
| **Dashboard** | Financial health overview: cash, burn, runway, pipeline & cap table summary |
| **Fundraising CRM** | Investor pipeline (prospect → invested), check sizes, follow-ups, kanban + table views, active round progress |
| **Financial Modeling** | 12–36 month projections, conservative/base/aggressive scenarios, cash & runway charts, assumption builder |
| **Cap Table** | Stakeholders, share classes, vesting schedules, ownership visualization, dilution modeler |
| **Metrics Dashboard** | MRR/ARR/CAC/LTV/churn tracking, revenue & unit-economics charts, cohort table |
| **Investor Updates** | Professional monthly/quarterly reports with highlights, challenges, asks & metrics |
| **Team & Settings** | Role-based access, permissions matrix, workspace, billing & integrations UI |

## 🗺️ How it helps founders

1. **Idea stage** — model unit economics and estimate startup costs before you build
2. **Pre-seed / Seed** — run a professional fundraising process and keep a clean cap table
3. **Series A+** — show investors disciplined reporting, model dilution, and hit your numbers

## 🚀 Quick start

```bash
# 1. Install dependencies
npm install

# 2. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the app loads with demo data for a seed-stage fintech startup called **FinFlow AI**. Browse all six modules instantly.

### Production build

```bash
npm run build
npm start
```

## 🧰 Tech stack

- **Next.js 14** (App Router, Server Components) + **TypeScript**
- **Tailwind CSS** + custom shadcn-style UI components
- **Radix UI** primitives (select, dialog, tabs, dropdowns, avatars…)
- **Recharts** for financial visualizations
- **Zustand** (with `persist`) for app state & demo data
- **Supabase-ready** — schema + RLS policies included under `supabase/schema.sql`

## 🔌 Connect to Supabase (optional, for real backend)

The app ships in **demo mode** with Zustand as the data layer. To wire it to a real Supabase project:

1. Copy `.env.example` → `.env.local` and add your project URL + anon key.
2. In the Supabase dashboard SQL editor, run everything in `supabase/schema.sql`.
3. Replace the Zustand store reads/writes with your Supabase queries (see `lib/supabase/client.ts` and `lib/supabase/server.ts`), or add your own data hooks.

## 📁 Project structure

```
app/
  page.tsx                      # Landing page
  dashboard/
    layout.tsx                  # Sidebar + header shell
    page.tsx                    # Financial overview dashboard
    fundraising/page.tsx        # Investor CRM
    financial-model/page.tsx    # Scenario modeling & runway
    cap-table/page.tsx          # Ownership & dilution
    metrics/page.tsx            # KPI dashboard & cohorts
    investor-updates/page.tsx   # Investor reporting
    team/page.tsx               # Team & permissions
    settings/page.tsx           # Workspace configuration
components/
  ui/                           # Reusable UI primitives
  layout/                       # Sidebar, Header
lib/
  types/index.ts                # Domain types
  store.ts                      # Zustand store + demo data
  utils.ts                      # Formatters & math helpers
  supabase/                     # Supabase clients (browser/server)
supabase/schema.sql             # DB schema + RLS policies
```

## 🎤 Hackathon pitch (30 seconds)

> "Founders waste months juggling spreadsheets, CRMs, and investor emails. **StartupFinance OS** unifies their entire financial workflow: model your runway, run your fundraise, manage your cap table, and report to investors — from idea to Series A, in one command center."

**Problem:** financial tooling is scattered, expensive, and not built for founders.
**Solution:** one free platform covering funding, modeling, cap table, metrics, and reporting.
**Differentiator:** demo-mode onboarding with realistic data, so a founder sees the full value in 30 seconds.
**Demo flow:** Dashboard → Financial Model scenarios → Fundraising pipeline → Cap table → Metrics → Send an investor update.

## 📄 License

MIT — built for hackathon demonstration.