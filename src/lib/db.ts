import type { OrderLine, PricingResult } from './pricing';

export interface OrderCustomer {
  name: string;
  phone: string;
  email: string;
  city: string;
  venue?: string;
  notes?: string;
}

export function generateOrderRef(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const rand = crypto.randomUUID().replace(/-/g, '').slice(0, 6).toUpperCase();
  return `BLI-${date}-${rand}`;
}

export async function insertOrder(
  db: D1Database,
  orderRef: string,
  customer: OrderCustomer,
  fromDate: string,
  toDate: string,
  pricing: PricingResult
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO orders (
        order_ref, customer_name, customer_phone, customer_email, city, venue, notes,
        rental_start_date, rental_end_date, rental_days, items_json,
        subtotal_per_day, discount_pct, discount_amount, total_amount
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      orderRef,
      customer.name,
      customer.phone,
      customer.email,
      customer.city,
      customer.venue ?? null,
      customer.notes ?? null,
      fromDate,
      toDate,
      pricing.days,
      JSON.stringify(pricing.lines satisfies OrderLine[]),
      pricing.subtotalPerDay,
      pricing.discountPct,
      pricing.discountAmount,
      pricing.totalAmount
    )
    .run();
}

export async function setRazorpayOrderId(db: D1Database, orderRef: string, razorpayOrderId: string): Promise<void> {
  await db
    .prepare(`UPDATE orders SET razorpay_order_id = ?, updated_at = datetime('now') WHERE order_ref = ?`)
    .bind(razorpayOrderId, orderRef)
    .run();
}
