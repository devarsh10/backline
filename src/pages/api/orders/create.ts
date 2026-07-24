import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { computeOrderPricing, PricingError } from '../../../lib/pricing';
import {
  generateOrderRef,
  insertOrder,
  setRazorpayOrderId,
  getBookedQuantities,
  type OrderCustomer,
} from '../../../lib/db';
import { createRazorpayOrder } from '../../../lib/razorpay';
import { getEquipmentBySlug } from '../../../lib/equipmentDb';
import { verifyCustomerSessionToken } from '../../../lib/customerAuth';
import { getCustomerById } from '../../../lib/customerDb';

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

export const POST: APIRoute = async ({ request, cookies }) => {
  const sessionToken = cookies.get('customer_session')?.value;
  const customerId = await verifyCustomerSessionToken(sessionToken, env.CUSTOMER_SESSION_SECRET);
  if (!customerId) {
    return new Response(JSON.stringify({ ok: false, error: 'Please log in to place an order' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    });
  }
  const account = await getCustomerById(env.DB, customerId);
  if (!account) {
    return new Response(JSON.stringify({ ok: false, error: 'Account not found' }), { status: 404 });
  }

  let body: CreateOrderBody;
  try {
    body = await request.json();
  } catch {
    return badRequest('Invalid JSON body');
  }

  const { items, customer, dates } = body ?? {};
  if (!items?.length) return badRequest('Cart is empty');
  if (!customer?.name || !customer?.phone || !customer?.city) {
    return badRequest('Missing required customer details');
  }
  if (!dates?.from || !dates?.to) return badRequest('Missing rental dates');

  // The order's email is always the logged-in account's email, never client-supplied,
  // so order history lookups stay trustworthy.
  customer.email = account.email;

  let pricing;
  try {
    pricing = await computeOrderPricing(env.DB, items, dates.from, dates.to);
  } catch (err) {
    if (err instanceof PricingError) return badRequest(err.message);
    throw err;
  }

  const bookedQuantities = await getBookedQuantities(env.DB, dates.from, dates.to);
  const unavailable = [];
  for (const line of pricing.lines) {
    const item = await getEquipmentBySlug(env.DB, line.slug);
    const totalUnits = item?.totalUnits ?? 0;
    const alreadyBooked = bookedQuantities.get(line.slug) ?? 0;
    if (alreadyBooked + line.quantity > totalUnits) unavailable.push(line);
  }
  if (unavailable.length) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: `Not enough units available for these dates: ${unavailable.map(l => l.name).join(', ')}`,
      }),
      { status: 409, headers: { 'content-type': 'application/json' } }
    );
  }

  const orderRef = generateOrderRef();

  try {
    await insertOrder(env.DB, orderRef, customer, dates.from, dates.to, pricing, customerId);

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
