export const months = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

/**
 * Converte uma data para o mês correto considerando o timezone local
 * Evita problemas de timezone que podem fazer uma data aparecer no mês errado
 */
export function getLocalMonth(date: Date | string): number {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Usar toLocaleDateString para garantir que a data seja interpretada no timezone local
  const localDateString = dateObj.toLocaleDateString('pt-BR', { 
    timeZone: 'America/Sao_Paulo',
    month: 'numeric'
  });
  
  return parseInt(localDateString, 10);
}