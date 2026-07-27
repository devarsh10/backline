export const RENTAL_DATES_COOKIE = 'rental_dates';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export interface RentalDateRange {
  from: string;
  to: string;
}

export function parseRentalDatesCookie(raw: string | undefined): RentalDateRange | null {
  if (!raw) return null;
  const [from, to] = raw.split('_');
  if (!from || !to || !DATE_RE.test(from) || !DATE_RE.test(to)) return null;
  if (to < from) return null;
  return { from, to };
}

export function remainingUnitsFor(totalUnits: number, slug: string, booked: Map<string, number> | null): number {
  if (!booked) return totalUnits;
  return Math.max(0, totalUnits - (booked.get(slug) ?? 0));
}

export function formatDateChip(dateStr: string): string {
  const opts: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short' };
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString('en-IN', opts);
}

export function formatDateRangeShort(range: RentalDateRange): string {
  const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
  const from = new Date(`${range.from}T00:00:00`).toLocaleDateString('en-IN', opts);
  const to = new Date(`${range.to}T00:00:00`).toLocaleDateString('en-IN', opts);
  return from === to ? from : `${from} – ${to}`;
}
