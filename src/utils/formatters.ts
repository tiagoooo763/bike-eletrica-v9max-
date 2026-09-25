/**
 * Format number as Brazilian Real (BRL) currency
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Format numbers with K/M abbreviation for social stats
 */
export function formatCompactNumber(value: number): string {
  if (value >= 1_000_000) {
    return (value / 1_000_000).toFixed(1).replace('.0', '') + 'M';
  }
  if (value >= 1_000) {
    return (value / 1_000).toFixed(1).replace('.0', '') + 'k';
  }
  return value.toString();
}

/**
 * Calculate installment value (e.g. 12x de R$ X)
 */
export function calculateInstallments(price: number, maxInstallments = 12): { count: number; value: number; formatted: string } {
  const value = price / maxInstallments;
  return {
    count: maxInstallments,
    value,
    formatted: `${maxInstallments}x ${formatCurrency(value)}`,
  };
}

/**
 * Format remaining milliseconds to HH:MM:SS
 */
export function formatCountdown(ms: number): { hours: string; minutes: string; seconds: string } {
  if (ms <= 0) {
    return { hours: '00', minutes: '00', seconds: '00' };
  }
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    hours: hours.toString().padStart(2, '0'),
    minutes: minutes.toString().padStart(2, '0'),
    seconds: seconds.toString().padStart(2, '0'),
  };
}
