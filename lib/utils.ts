import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const badgeVariants = (props: { variant?: string }) => {
  const { variant = 'default' } = props;
  const base = 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2';
  const variants = {
    default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
    secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
    destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
    outline: 'text-foreground',
    success: 'border-transparent bg-green-500 text-white hover:bg-green-600',
    warning: 'border-transparent bg-yellow-500 text-white hover:bg-yellow-600',
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