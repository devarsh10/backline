import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { createRazorpayOrder } from '../../../lib/razorpay';

export const prerender = false;

export const POST: APIRoute = async () => {
  try {
    const order = await createRazorpayOrder(100, 'server-sanity-check-1', {
      RAZORPAY_KEY_ID: env.RAZORPAY_KEY_ID,
      RAZORPAY_KEY_SECRET: env.RAZORPAY_KEY_SECRET,
    });

    return new Response(JSON.stringify({ ok: true, order }), {
      headers: { 'content-type': 'application/json' },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ ok: false, error: err instanceof Error ? err.message : String(err) }),
      { status: 500, headers: { 'content-type': 'application/json' } }
    );
  }
};
