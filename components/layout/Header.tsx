'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Menu,
  LogOut,
  User,
  Settings,
  TrendingUp,
  Moon,
  Sun,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Overview',
  '/dashboard/fundraising': 'Fundraising',
  '/dashboard/financial-model': 'Financial Model',
  '/dashboard/cap-table': 'Cap Table',
  '/dashboard/metrics': 'Metrics',
  '/dashboard/investor-updates': 'Investor Updates',
  '/dashboard/team': 'Team',
  '/dashboard/settings': 'Settings',
  '/dashboard/onboarding': 'Setup',
};

export function Header() {
  const pathname = usePathname();
  const { currentStartup, toggleSidebar, sidebarOpen } = useAppStore();
  const { resolvedTheme, setTheme } = useTheme();
  const title = pageTitles[pathname] ?? (pathname.startsWith('/dashboard/fundraising/') ? 'Investor Profile' : 'StartupFinance OS');

  return (
    <header
      className={cn(
        'sticky top-0 z-30 h-16 border-b border-border/70 bg-background/70 backdrop-blur-xl',
        sidebarOpen ? 'lg:ml-64' : 'lg:ml-[72px]'
      )}
    >
      <div className="flex h-full items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="lg:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Separator orientation="vertical" className="h-6 lg:hidden" />

          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[hsl(38_92%_50%)] to-[hsl(24_92%_44%)] text-white shadow-gold-glow lg:hidden">
              <TrendingUp className="h-4 w-4" strokeWidth={2.4} />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-display text-sm font-bold tracking-tight">{title}</span>
              {currentStartup && (
                <span className="hidden text-[11px] text-muted-foreground sm:block">
                  {currentStartup.name} · {currentStartup.stage ?? 'seed'}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            aria-label="Toggle theme"
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-[18px] w-[18px] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[18px] w-[18px] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 gap-2 rounded-full px-1.5 pl-1.5 pr-2.5">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-gradient-to-br from-[hsl(226_70%_40%)] to-[hsl(226_50%_60%)] text-white">
                    {currentStartup?.name?.[0] ?? 'F'}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden text-sm font-medium sm:block">
                  {currentStartup?.founder_name?.split(' ')[0] ?? 'Founder'}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{currentStartup?.founder_name ?? 'Founder'}</p>
                  <p className="text-xs text-muted-foreground">{currentStartup?.email ?? 'founder@startup.com'}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                <LogOut className="h-4 w-4 mr-2" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}