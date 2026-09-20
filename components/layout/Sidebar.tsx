'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Target,
  Calculator,
  PieChart,
  Gauge,
  Send,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Landmark,
  TrendingUp,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Fundraising', href: '/dashboard/fundraising', icon: Target },
  { name: 'Financial Model', href: '/dashboard/financial-model', icon: Calculator },
  { name: 'Cap Table', href: '/dashboard/cap-table', icon: PieChart },
  { name: 'Metrics', href: '/dashboard/metrics', icon: Gauge },
  { name: 'Investor Updates', href: '/dashboard/investor-updates', icon: Send },
  { name: 'Team', href: '/dashboard/team', icon: Users },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

const quickActions = [
  { name: 'Setup wizard', href: '/dashboard/onboarding' },
  { name: '+ Add Investor', href: '/dashboard/fundraising' },
  { name: '+ New Scenario', href: '/dashboard/financial-model' },
  { name: '+ New Update', href: '/dashboard/investor-updates' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar, setActiveModule } = useAppStore();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border/70 bg-card/75 backdrop-blur-xl transition-all duration-300 ease-out-expo',
        sidebarOpen ? 'w-64' : 'w-[72px]'
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-border/60 px-4">
        {sidebarOpen ? (
          <Link href="/dashboard" className="group flex items-center gap-2.5">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[hsl(38_92%_50%)] via-[hsl(42_95%_58%)] to-[hsl(24_92%_44%)] text-white shadow-gold-glow">
              <TrendingUp className="h-5 w-5" strokeWidth={2.4} />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-display text-[15px] font-bold tracking-tight text-foreground">
                StartupFinance
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-dark dark:text-gold-light">
                OS · Founders
              </span>
            </div>
          </Link>
        ) : (
          <Link href="/dashboard" className="mx-auto">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[hsl(38_92%_50%)] via-[hsl(42_95%_58%)] to-[hsl(24_92%_44%)] text-white shadow-gold-glow">
              <TrendingUp className="h-5 w-5" strokeWidth={2.4} />
            </div>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className={cn('h-8 w-8', sidebarOpen ? '' : 'hidden')}
          aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto nice-scroll p-3 space-y-1" aria-label="Main navigation">
        <p className={cn('mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground/70', !sidebarOpen && 'sr-only')}>
          Workspace
        </p>
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setActiveModule(item.name.toLowerCase().replace(/\s+/g, '-'))}
              className={cn(
                'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-gradient-to-r from-[hsl(226_55%_20%)] to-[hsl(226_45%_26%/0.65)] text-white shadow-sm dark:from-[hsl(38_92%_50%)] dark:to-[hsl(38_92%_50%/0.55)] dark:text-[hsl(226_45%_10%)]'
                  : 'text-muted-foreground hover:bg-accent/70 hover:text-accent-foreground',
                !sidebarOpen && 'justify-center px-0'
              )}
              title={sidebarOpen ? undefined : item.name}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-gold-light dark:bg-[hsl(226_50%_8%)]" />
              )}
              <Icon
                className={cn(
                  'h-[18px] w-[18px] flex-shrink-0',
                  isActive && 'stroke-[2.2]'
                )}
                strokeWidth={isActive ? 2.2 : 2}
                aria-hidden="true"
              />
              {sidebarOpen && <span>{item.name}</span>}
            </Link>
          );
        })}

        {sidebarOpen && (
          <div className="mt-6 rounded-2xl border border-border/70 bg-gradient-to-br from-[hsl(226_45%_96%)] to-[hsl(38_92%_50%/0.10)] p-3.5 dark:from-[hsl(226_34%_15%)] dark:to-[hsl(38_92%_50%/0.12)]">
            <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
              Quick Actions
            </p>
            <div className="space-y-1">
              {quickActions.map((qa) => (
                <Button key={qa.name} variant="ghost" size="sm" className="w-full justify-start gap-2 px-2 text-foreground/90">
                  <Link href={qa.href} className="w-full text-left">{qa.name}</Link>
                </Button>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-card/80 px-3 py-2.5 text-[11px] text-muted-foreground">
              <Landmark className="h-4 w-4 text-gold-dark dark:text-gold-light" />
              <span>Demo data · FinFlow AI</span>
            </div>
          </div>
        )}
      </nav>

      <div className="border-t border-border/60 p-3">
        {!sidebarOpen && (
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mx-auto h-8 w-8" aria-label="Expand sidebar">
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </aside>
  );
}