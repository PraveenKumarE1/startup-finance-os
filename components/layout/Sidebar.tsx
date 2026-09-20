'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Users,
  Target,
  TrendingUp,
  PieChart,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Orbit,
  Sparkles,
  Workflow,
  Radar,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Pipeline', href: '/fundraising', icon: Target },
  { name: 'Clients', href: '/financial-model', icon: Workflow },
  { name: 'Automations', href: '/cap-table', icon: Sparkles },
  { name: 'Team', href: '/metrics', icon: Users },
  { name: 'Reports', href: '/investor-updates', icon: FileText },
  { name: 'Insights', href: '/team', icon: Radar },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar, setActiveModule } = useAppStore();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen border-r bg-card transition-all duration-300',
        sidebarOpen ? 'w-64' : 'w-16'
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center justify-between border-b px-4">
          {sidebarOpen && (
            <Link href="/dashboard" className="flex items-center gap-2">
              <Orbit className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">OrbitFlow</span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8"
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1" aria-label="Main navigation">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setActiveModule(item.name.toLowerCase().replace(/\s+/g, '-'))}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                  !sidebarOpen && 'justify-center'
                )}
                title={sidebarOpen ? undefined : item.name}
              >
                <Icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                {sidebarOpen && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="border-t p-3">
          {sidebarOpen && (
            <div className="rounded-lg bg-muted p-3 text-xs text-muted-foreground">
              <p className="font-medium mb-1">Quick Actions</p>
              <div className="space-y-1">
                <Button variant="outline" size="sm" className="w-full justify-start gap-2" asChild>
                  <Link href="/fundraising">+ New Deal</Link>
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start gap-2" asChild>
                  <Link href="/financial-model">+ AI Brief</Link>
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start gap-2" asChild>
                  <Link href="/cap-table">+ Add Task</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}