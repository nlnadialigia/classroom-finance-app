/**
 * Format currency value according to locale
 * Always uses BRL (Brazilian Real) but formats according to locale preference
 */
export function formatCurrency(value: number, locale: string = 'en'): string {
  const formatter = new Intl.NumberFormat(locale === 'pt' ? 'pt-BR' : 'en-US', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  
  return formatter.format(value);
}

/**
 * Format number according to locale
 * PT-BR: 1.234,56
 * EN-US: 1,234.56
 */
export function formatNumber(value: number, locale: string = 'en'): string {
  const formatter = new Intl.NumberFormat(locale === 'pt' ? 'pt-BR' : 'en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  
  return formatter.format(value);
}

/**
 * Parse currency string to number
 * Handles both PT-BR (1.234,56) and EN-US (1,234.56) formats
 */
export function parseCurrency(value: string): number {
  // Remove currency symbols and spaces
  let cleaned = value.replace(/[R$\s]/g, '');
  
  // Check if it's PT-BR format (uses comma as decimal separator)
  if (cleaned.includes(',') && cleaned.lastIndexOf(',') > cleaned.lastIndexOf('.')) {
    // PT-BR format: 1.234,56
    cleaned = cleaned.replace(/\./g, '').replace(',', '.');
  } else {
    // EN-US format: 1,234.56
    cleaned = cleaned.replace(/,/g, '');
  }
  
  return parseFloat(cleaned) || 0;
}
