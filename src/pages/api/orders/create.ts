import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { computeOrderPricing, PricingError } from '../../../lib/pricing';
import {
  generateOrderRef,
  insertOrder,
  setRazorpayOrderId,
  getOverlappingBookedSlugs,
  type OrderCustomer,
} from '../../../lib/db';
import { createRazorpayOrder } from '../../../lib/razorpay';

export const prerender = false;

interface CreateOrderBody {
  items: { slug: string; quantity: number }[];
  customer: OrderCustomer;
  dates: { from: string; to: string };
}

function badRequest(message: string) {
  return new Response(JSON.stringify({ ok: false, error: message }), {
    status: 400,
    headers: { 'content-type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request }) => {
  let body: CreateOrderBody;
  try {
    body = await request.json();
  } catch {
    return badRequest('Invalid JSON body');
  }

  const { items, customer, dates } = body ?? {};
  if (!items?.length) return badRequest('Cart is empty');
  if (!customer?.name || !customer?.phone || !customer?.email || !customer?.city) {
    return badRequest('Missing required customer details');
  }
  if (!dates?.from || !dates?.to) return badRequest('Missing rental dates');

  let pricing;
  try {
    pricing = computeOrderPricing(items, dates.from, dates.to);
  } catch (err) {
    if (err instanceof PricingError) return badRequest(err.message);
    throw err;
  }

  const bookedSlugs = await getOverlappingBookedSlugs(env.DB, dates.from, dates.to);
  const unavailable = pricing.lines.filter(line => bookedSlugs.has(line.slug));
  if (unavailable.length) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: `Already booked for these dates: ${unavailable.map(l => l.name).join(', ')}`,
      }),
      { status: 409, headers: { 'content-type': 'application/json' } }
    );
  }

  const orderRef = generateOrderRef();

  try {
    await insertOrder(env.DB, orderRef, customer, dates.from, dates.to, pricing);

    const razorpayOrder = await createRazorpayOrder(pricing.totalAmount * 100, orderRef, {
      RAZORPAY_KEY_ID: env.RAZORPAY_KEY_ID,
      RAZORPAY_KEY_SECRET: env.RAZORPAY_KEY_SECRET,
    });

    await setRazorpayOrderId(env.DB, orderRef, razorpayOrder.id);

    return new Response(
      JSON.stringify({
        ok: true,
        order_ref: orderRef,
        razorpay_order_id: razorpayOrder.id,
        amount_paise: razorpayOrder.amount,
        key_id: env.RAZORPAY_KEY_ID,
        days: pricing.days,
        subtotal_per_day: pricing.subtotalPerDay,
        discount_pct: pricing.discountPct,
        discount_amount: pricing.discountAmount,
        total_amount: pricing.totalAmount,
      }),
      { headers: { 'content-type': 'application/json' } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ ok: false, error: err instanceof Error ? err.message : String(err) }),
      { status: 500, headers: { 'content-type': 'application/json' } }
    );
  }
};
