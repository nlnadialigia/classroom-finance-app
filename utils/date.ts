/**
 * Month names in different locales
 */
export const months = {
  en: [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ],
  pt: [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ]
};

/**
 * Get month names for a specific locale
 */
export function getMonthNames(locale: string = 'en'): string[] {
  return months[locale as keyof typeof months] || months.en;
}

/**
 * Get month name for a specific month number (1-12) and locale
 */
export function getMonthName(month: number, locale: string = 'en'): string {
  const monthNames = getMonthNames(locale);
  return monthNames[month - 1] || monthNames[0];
}

/**
 * Convert a date to the correct month considering Brazilian timezone
 * Always uses America/Sao_Paulo timezone regardless of locale
 */
export function getLocalMonth(date: Date | string): number {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const localDateString = dateObj.toLocaleDateString('pt-BR', { 
    timeZone: 'America/Sao_Paulo',
    month: 'numeric'
  });
  
  return parseInt(localDateString, 10);
}

/**
 * Format date according to locale
 * Always uses Brazilian timezone but formats according to locale preference
 */
export function formatDate(date: Date | string, locale: string = 'en'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  };
  
  return dateObj.toLocaleDateString(locale === 'pt' ? 'pt-BR' : 'en-US', options);
}