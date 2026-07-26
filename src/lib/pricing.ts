import { getDiscountForDays } from '../data/equipment';
import { getEquipmentBySlug } from './equipmentDb';

export interface OrderLineInput {
  slug: string;
  quantity: number;
}

export interface OrderLine {
  slug: string;
  name: string;
  brand: string;
  category: string;
  pricePerDay: number;
  quantity: number;
}

export interface PricingResult {
  lines: OrderLine[];
  days: number;
  subtotalPerDay: number;
  discountPct: number;
  discountAmount: number;
  transportationCharge: number;
  totalAmount: number;
}

export class PricingError extends Error {}

export function computeRentalDays(fromDate: string, toDate: string): number {
  const from = new Date(fromDate);
  const to = new Date(toDate);
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
    throw new PricingError('Invalid rental dates');
  }
  return Math.max(1, Math.round((to.getTime() - from.getTime()) / 86400000) + 1);
}

export async function computeOrderPricing(
  db: D1Database,
  items: OrderLineInput[],
  fromDate: string,
  toDate: string,
  transportationCharge: number = 0
): Promise<PricingResult> {
  if (!items.length) {
    throw new PricingError('Cart is empty');
  }

  const lines: OrderLine[] = await Promise.all(
    items.map(async ({ slug, quantity }) => {
      if (!Number.isInteger(quantity) || quantity < 1) {
        throw new PricingError(`Invalid quantity for ${slug}`);
      }
      const item = await getEquipmentBySlug(db, slug);
      if (!item) {
        throw new PricingError(`Unknown equipment: ${slug}`);
      }
      if (!item.available) {
        throw new PricingError(`Currently unavailable: ${item.name}`);
      }
      return {
        slug: item.slug,
        name: item.name,
        brand: item.brand,
        category: item.category,
        pricePerDay: item.pricePerDay,
        quantity,
      };
    })
  );

  const days = computeRentalDays(fromDate, toDate);
  const subtotalPerDay = lines.reduce((sum, l) => sum + l.pricePerDay * l.quantity, 0);
  const discountPct = getDiscountForDays(days);
  const subtotal = subtotalPerDay * days;
  const discountAmount = Math.round((subtotal * discountPct) / 100);
  const totalAmount = subtotal - discountAmount + transportationCharge;

  return { lines, days, subtotalPerDay, discountPct, discountAmount, transportationCharge, totalAmount };
}
