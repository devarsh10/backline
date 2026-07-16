import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { getOrderByRef, markOrderPaid } from '../../../lib/db';
import { verifyPaymentSignature } from '../../../lib/razorpay';
import { sendEmail, paymentReceivedEmailHtml } from '../../../lib/email';

export const prerender = false;

interface VerifyBody {
  order_ref: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export const POST: APIRoute = async ({ request }) => {
  let body: VerifyBody;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid JSON body' }), { status: 400 });
  }

  const { order_ref, razorpay_order_id, razorpay_payment_id, razorpay_signature } = body ?? {};
  if (!order_ref || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return new Response(JSON.stringify({ ok: false, error: 'Missing required fields' }), { status: 400 });
  }

  const order = await getOrderByRef(env.DB, order_ref);
  if (!order || order.razorpay_order_id !== razorpay_order_id) {
    return new Response(JSON.stringify({ ok: false, error: 'Order not found' }), { status: 404 });
  }

  const isValid = await verifyPaymentSignature(
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    env.RAZORPAY_KEY_SECRET
  );

  if (!isValid) {
    return new Response(JSON.stringify({ ok: false, error: 'Signature verification failed' }), { status: 400 });
  }

  await markOrderPaid(env.DB, order_ref, razorpay_payment_id);

  await sendEmail(
    env,
    order.customer_email,
    `Payment received — order ${order_ref}`,
    paymentReceivedEmailHtml(order_ref, order.customer_name, order.total_amount)
  );

  return new Response(JSON.stringify({ ok: true, order_ref, status: 'payment_received' }), {
    headers: { 'content-type': 'application/json' },
  });
};
