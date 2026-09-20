'use client';

import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sidebarOpen } = useAppStore();
  return (
    <div className="theme-ambient flex h-screen text-foreground">
      <Sidebar />
      <div className={cn('flex flex-1 flex-col overflow-hidden transition-all duration-300 ease-out-expo', sidebarOpen ? 'lg:ml-64' : 'lg:ml-[72px]')}>
        <Header />
        <main className="nice-scroll flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}