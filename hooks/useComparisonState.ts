'use client';

import { useState } from 'react';
import type { PeriodType } from '@/types/dashboard';

export function useComparisonState() {
  const [comparePeriodType, setComparePeriodType] = useState<PeriodType>('lastMonth');
  const [compareStartDate, setCompareStartDate] = useState('');
  const [compareEndDate, setCompareEndDate] = useState('');
  const [showCompareSelector, setShowCompareSelector] = useState(false);
  const [showCompareIncome, setShowCompareIncome] = useState(false);
  const [showCompareExpenses, setShowCompareExpenses] = useState(true);
  const [showCompareSavings, setShowCompareSavings] = useState(false);
  const [comparePreset, setComparePreset] = useState<'previous-period' | 'previous-year' | 'custom' | null>(null);

  return {
    comparePeriodType, setComparePeriodType,
    compareStartDate, setCompareStartDate,
    compareEndDate, setCompareEndDate,
    showCompareSelector, setShowCompareSelector,
    showCompareIncome, setShowCompareIncome,
    showCompareExpenses, setShowCompareExpenses,
    showCompareSavings, setShowCompareSavings,
    comparePreset, setComparePreset,
  };
}
