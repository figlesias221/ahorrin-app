import { differenceInCalendarDays } from 'date-fns';
import type { PeriodType } from '@/types/dashboard';

export const UNCATEGORIZED_ID = '00000000-0000-0000-0000-000000000000';
export const EXCHANGE_RATE = 40;

/**
 * Calculate date range based on period type
 */
export function calculateDateRange(
  periodType: PeriodType,
  customStart?: string,
  customEnd?: string
): { start: string; end: string; months: number } {
  const today = new Date();
  let start: Date;
  let end: Date;
  let months: number;

  if (periodType === 'custom' && customStart && customEnd) {
    const startD = new Date(customStart);
    const endD = new Date(customEnd);
    months = Math.max(1, Math.ceil((endD.getTime() - startD.getTime()) / (1000 * 60 * 60 * 24 * 30)));
    return { start: customStart, end: customEnd, months };
  }

  switch (periodType) {
    case 'last7days':
      start = new Date(today);
      start.setDate(today.getDate() - 6);
      end = new Date(today);
      months = 1;
      break;
    case 'last30days':
      start = new Date(today);
      start.setDate(today.getDate() - 29);
      end = new Date(today);
      months = 1;
      break;
    case 'thisMonth':
      start = new Date(today.getFullYear(), today.getMonth(), 1);
      end = new Date(today);
      months = 1;
      break;
    case 'lastMonth':
      start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      end = new Date(today.getFullYear(), today.getMonth(), 0);
      months = 1;
      break;
    case 'last3months':
      start = new Date(today.getFullYear(), today.getMonth() - 2, 1);
      end = new Date(today);
      months = 3;
      break;
    case 'thisYear':
      start = new Date(today.getFullYear(), 0, 1);
      end = new Date(today.getFullYear(), 11, 31);
      months = 12;
      break;
    case 'lastYear':
      start = new Date(today.getFullYear() - 1, 0, 1);
      end = new Date(today.getFullYear() - 1, 11, 31);
      months = 12;
      break;
    case 'allTime':
      // Show all data from the earliest transaction to today
      if (customStart) {
        start = new Date(customStart);
      } else {
        // Fallback to year 2000 if no custom start provided
        start = new Date(2000, 0, 1);
      }
      end = new Date(today);
      const yearsDiff = end.getFullYear() - start.getFullYear();
      months = Math.max(1, yearsDiff * 12);
      break;
    default:
      start = new Date(today.getFullYear(), today.getMonth(), 1);
      end = new Date(today);
      months = 1;
  }

  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
    months,
  };
}

/**
 * Convert currency between USD and UYU
 */
export function convertCurrency(
  amount: number,
  fromCurrency: string,
  displayCurrency: 'USD' | 'UYU'
): number {
  if (displayCurrency === fromCurrency) {
    return amount;
  }

  if (displayCurrency === 'USD' && fromCurrency === 'UYU') {
    return amount / EXCHANGE_RATE;
  }

  if (displayCurrency === 'UYU' && fromCurrency === 'USD') {
    return amount * EXCHANGE_RATE;
  }

  return amount;
}

/**
 * Format date range as human-readable string
 */
export function formatRangeLabel(start: string | undefined, end: string | undefined): string {
  if (!start || !end) return '—';
  const formatter = new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  return `${formatter.format(new Date(start))} → ${formatter.format(new Date(end))}`;
}

/**
 * Format duration between dates as human-readable string
 */
export function formatDurationLabel(start: string | undefined, end: string | undefined): string {
  if (!start || !end) return '';
  const days = Math.max(1, differenceInCalendarDays(new Date(end), new Date(start)) + 1);
  if (days === 1) return '1 día';
  if (days < 30) return `${days} días`;
  if (days < 45) return '≈ 1 mes';
  if (days < 365) return `≈ ${Math.round(days / 30)} meses`;
  if (days < 540) return '≈ 1 año';
  return `≈ ${(days / 365).toFixed(1)} años`;
}

/**
 * Calculate the previous period based on current date range
 */
export function calculatePreviousPeriod(
  startDate: string,
  endDate: string
): { start: string; end: string } {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const durationMs = end.getTime() - start.getTime();
  
  const prevEnd = new Date(start.getTime() - 1);
  const prevStart = new Date(prevEnd.getTime() - durationMs);
  
  return {
    start: prevStart.toISOString().split('T')[0],
    end: prevEnd.toISOString().split('T')[0],
  };
}

/**
 * Calculate the same period from previous year
 */
export function calculatePreviousYearPeriod(
  startDate: string,
  endDate: string
): { start: string; end: string } {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  start.setFullYear(start.getFullYear() - 1);
  end.setFullYear(end.getFullYear() - 1);
  
  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
  };
}
