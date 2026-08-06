import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { verifyCustomerSessionToken } from '../../../lib/customerAuth';
import { lookupGstin, GstinError } from '../../../lib/gstin';

export const prerender = false;

interface LookupBody {
  gstin?: string;
}

export const POST: APIRoute = async ({ request, cookies }) => {
  const sessionToken = cookies.get('customer_session')?.value;
  const customerId = await verifyCustomerSessionToken(sessionToken, env.CUSTOMER_SESSION_SECRET);
  if (!customerId) {
    return new Response(JSON.stringify({ ok: false, error: 'Please log in' }), { status: 401 });
  }

  let body: LookupBody;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid JSON body' }), { status: 400 });
  }

  const gstin = body?.gstin?.trim();
  if (!gstin) return new Response(JSON.stringify({ ok: false, error: 'GSTIN is required' }), { status: 400 });

  try {
    const details = await lookupGstin(env.GST_AUTO_FETCH, gstin);
    return new Response(JSON.stringify({ ok: true, ...details }), { headers: { 'content-type': 'application/json' } });
  } catch (err) {
    if (err instanceof GstinError) {
      return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 422 });
    }
    throw err;
  }
};
