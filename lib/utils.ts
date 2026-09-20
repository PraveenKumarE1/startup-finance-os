import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const badgeVariants = (props: { variant?: string }) => {
  const { variant = 'default' } = props;
  const base = 'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2';
  const variants = {
    default: 'border-transparent bg-primary/10 text-primary dark:bg-primary/15 dark:text-primary hover:bg-primary/15',
    secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
    destructive: 'border-transparent bg-destructive/10 text-destructive hover:bg-destructive/15',
    outline: 'border-border/70 text-muted-foreground',
    success: 'border-transparent bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/15 dark:text-emerald-400',
    warning: 'border-transparent bg-amber-500/10 text-amber-700 hover:bg-amber-500/15 dark:text-amber-400',
  };
  return `${base} ${variants[variant as keyof typeof variants] || variants.default}`;
};

export function formatCurrency(value: number, currency = 'USD', decimals = 0): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatNumber(value: number, decimals = 0): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatPercent(value: number, decimals = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

export function calculateRunway(cash: number, monthlyBurn: number): number {
  if (monthlyBurn <= 0) return Infinity;
  return cash / monthlyBurn;
}

export function calculateMonthsOfRunway(cash: number, monthlyBurn: number): string {
  const months = calculateRunway(cash, monthlyBurn);
  if (months === Infinity) return '∞';
  if (months < 1) return '< 1 month';
  if (months < 12) return `${months.toFixed(1)} months`;
  const years = Math.floor(months / 12);
  const remainingMonths = Math.round(months % 12);
  return `${years}y ${remainingMonths}m`;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatDateShort(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: '2-digit',
  }).format(new Date(date));
}