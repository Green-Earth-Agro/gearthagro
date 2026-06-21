// Shared display formatting for the admin.

export function formatDate(value: string | null | undefined): string {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const CURRENCY_SYMBOL: Record<string, string> = { GHS: '₵', USD: '$', EUR: '€', GBP: '£' };

export function formatMoney(amount: number | null | undefined, currency = 'GHS'): string {
  if (amount == null) return '—';
  const symbol = CURRENCY_SYMBOL[currency] ?? `${currency} `;
  return `${symbol}${amount.toLocaleString()}`;
}
