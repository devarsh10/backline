import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { verifyCustomerSessionToken } from '../../../lib/customerAuth';
import { getTransportationCharge, DistanceError } from '../../../lib/distance';

export const prerender = false;

interface QuoteBody {
  city?: string;
  venue?: string;
}

export const POST: APIRoute = async ({ request, cookies }) => {
  const sessionToken = cookies.get('customer_session')?.value;
  const customerId = await verifyCustomerSessionToken(sessionToken, env.CUSTOMER_SESSION_SECRET);
  if (!customerId) {
    return new Response(JSON.stringify({ ok: false, error: 'Please log in' }), { status: 401 });
  }

  let body: QuoteBody;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid JSON body' }), { status: 400 });
  }

  const { city, venue } = body ?? {};
  if (!city?.trim()) {
    return new Response(JSON.stringify({ ok: false, error: 'City is required' }), { status: 400 });
  }

  try {
    const quote = await getTransportationCharge(env.GOOGLE_MAPS_API_KEY, city, venue);
    return new Response(JSON.stringify({ ok: true, ...quote }), { headers: { 'content-type': 'application/json' } });
  } catch (err) {
    if (err instanceof DistanceError) {
      return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 422 });
    }
    throw err;
  }
};
