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
  pricing: PricingResult,
  customerId: number
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO orders (
        order_ref, customer_id, customer_name, customer_phone, customer_email, city, venue, notes,
        rental_start_date, rental_end_date, rental_days, items_json,
        subtotal_per_day, discount_pct, discount_amount, total_amount
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      orderRef,
      customerId,
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

export async function getBookedQuantities(
  db: D1Database,
  fromDate: string,
  toDate: string
): Promise<Map<string, number>> {
  const { results } = await db
    .prepare(
      `SELECT items_json FROM orders
       WHERE status != 'cancelled' AND rental_start_date <= ? AND rental_end_date >= ?`
    )
    .bind(toDate, fromDate)
    .all<{ items_json: string }>();

  const bookedQuantities = new Map<string, number>();
  for (const row of results) {
    const lines = JSON.parse(row.items_json) as OrderLine[];
    for (const line of lines) {
      bookedQuantities.set(line.slug, (bookedQuantities.get(line.slug) ?? 0) + line.quantity);
    }
  }
  return bookedQuantities;
}

export async function setRazorpayOrderId(db: D1Database, orderRef: string, razorpayOrderId: string): Promise<void> {
  await db
    .prepare(`UPDATE orders SET razorpay_order_id = ?, updated_at = datetime('now') WHERE order_ref = ?`)
    .bind(razorpayOrderId, orderRef)
    .run();
}

export interface OrderRow {
  order_ref: string;
  razorpay_order_id: string | null;
  status: string;
  total_amount: number;
  customer_name: string;
  customer_email: string;
}

export async function getOrderByRef(db: D1Database, orderRef: string): Promise<OrderRow | null> {
  const row = await db
    .prepare(
      `SELECT order_ref, razorpay_order_id, status, total_amount, customer_name, customer_email
       FROM orders WHERE order_ref = ?`
    )
    .bind(orderRef)
    .first<OrderRow>();
  return row ?? null;
}

export interface OrderListRow {
  order_ref: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  city: string;
  rental_start_date: string;
  rental_end_date: string;
  items_json: string;
  total_amount: number;
  status: string;
  created_at: string;
}

export async function listOrders(db: D1Database, limit = 200): Promise<OrderListRow[]> {
  const { results } = await db
    .prepare(
      `SELECT order_ref, customer_name, customer_phone, customer_email, city,
              rental_start_date, rental_end_date, items_json, total_amount, status, created_at
       FROM orders ORDER BY created_at DESC LIMIT ?`
    )
    .bind(limit)
    .all<OrderListRow>();
  return results;
}

export async function getOrdersByCustomerId(db: D1Database, customerId: number): Promise<OrderListRow[]> {
  const { results } = await db
    .prepare(
      `SELECT order_ref, customer_name, customer_phone, customer_email, city,
              rental_start_date, rental_end_date, items_json, total_amount, status, created_at
       FROM orders WHERE customer_id = ? ORDER BY created_at DESC`
    )
    .bind(customerId)
    .all<OrderListRow>();
  return results;
}

export async function markOrderPaid(db: D1Database, orderRef: string, razorpayPaymentId: string): Promise<void> {
  await db
    .prepare(
      `UPDATE orders
       SET status = 'payment_received', razorpay_payment_id = ?, paid_at = datetime('now'), updated_at = datetime('now')
       WHERE order_ref = ? AND status != 'payment_received'`
    )
    .bind(razorpayPaymentId, orderRef)
    .run();
}

export const ORDER_STATUSES = ['order_placed', 'payment_received', 'out_for_delivery', 'delivered'] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export async function updateOrderStatus(db: D1Database, orderRef: string, status: OrderStatus): Promise<void> {
  await db
    .prepare(`UPDATE orders SET status = ?, updated_at = datetime('now') WHERE order_ref = ?`)
    .bind(status, orderRef)
    .run();
}

export interface OrderTrackingRow {
  order_ref: string;
  customer_phone: string;
  status: string;
  rental_start_date: string;
  rental_end_date: string;
  items_json: string;
  total_amount: number;
}

export async function getOrderForTracking(db: D1Database, orderRef: string): Promise<OrderTrackingRow | null> {
  const row = await db
    .prepare(
      `SELECT order_ref, customer_phone, status, rental_start_date, rental_end_date, items_json, total_amount
       FROM orders WHERE order_ref = ?`
    )
    .bind(orderRef)
    .first<OrderTrackingRow>();
  return row ?? null;
}
