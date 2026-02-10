'use client';

import { useLocale } from 'next-intl';
import { formatCurrency, formatNumber } from '@/utils/currency';
import { formatDate, getMonthName, getMonthNames } from '@/utils/date';

/**
 * Hook for locale-aware formatting
 * Provides currency, number, and date formatting based on current locale
 */
export function useFormatting() {
  const locale = useLocale();

  return {
    formatCurrency: (value: number) => formatCurrency(value, locale),
    formatNumber: (value: number) => formatNumber(value, locale),
    formatDate: (date: Date | string) => formatDate(date, locale),
    getMonthName: (month: number) => getMonthName(month, locale),
    getMonthNames: () => getMonthNames(locale),
    locale
  };
}
