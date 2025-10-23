import { format } from 'date-fns';

/**
 * Format currency amount in UYU
 */
export function formatCurrency(amount: number, currency: string = 'UYU'): string {
  return new Intl.NumberFormat('es-UY', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format date in friendly format
 * Handles YYYY-MM-DD strings correctly without timezone issues
 */
export function formatDate(date: Date | string, formatStr: string = 'dd/MM/yyyy'): string {
  let dateObj: Date;

  if (typeof date === 'string') {
    // Parse YYYY-MM-DD as local date to avoid timezone issues
    const [year, month, day] = date.split('T')[0].split('-').map(Number);
    dateObj = new Date(year, month - 1, day);
  } else {
    dateObj = date;
  }

  return format(dateObj, formatStr);
}

/**
 * Format month-year for charts
 */
export function formatMonthYear(date: Date): string {
  return format(date, 'MMM yyyy');
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
