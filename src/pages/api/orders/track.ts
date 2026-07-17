import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { getOrderForTracking } from '../../../lib/db';

export const prerender = false;

interface TrackBody {
  order_ref?: string;
  phone?: string;
}

function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '').slice(-10);
}

export const POST: APIRoute = async ({ request }) => {
  let body: TrackBody;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid JSON body' }), { status: 400 });
  }

  const orderRef = body?.order_ref?.trim();
  const phone = body?.phone?.trim();
  if (!orderRef || !phone) {
    return new Response(
      JSON.stringify({ ok: false, error: 'Order reference and phone number are required' }),
      { status: 400, headers: { 'content-type': 'application/json' } }
    );
  }

  const order = await getOrderForTracking(env.DB, orderRef);
  if (!order || normalizePhone(order.customer_phone) !== normalizePhone(phone)) {
    return new Response(
      JSON.stringify({ ok: false, error: 'No matching order found. Check your order reference and phone number.' }),
      { status: 404, headers: { 'content-type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify({
      ok: true,
      order_ref: order.order_ref,
      status: order.status,
      rental_start_date: order.rental_start_date,
      rental_end_date: order.rental_end_date,
      items: JSON.parse(order.items_json),
      total_amount: order.total_amount,
    }),
    { headers: { 'content-type': 'application/json' } }
  );
};
