import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { verifyCustomerSessionToken } from '../../../lib/customerAuth';
import { getPlaceDetails, PlacesError } from '../../../lib/places';

export const prerender = false;

interface DetailsBody {
  placeId?: string;
}

export const POST: APIRoute = async ({ request, cookies }) => {
  const sessionToken = cookies.get('customer_session')?.value;
  const customerId = await verifyCustomerSessionToken(sessionToken, env.CUSTOMER_SESSION_SECRET);
  if (!customerId) {
    return new Response(JSON.stringify({ ok: false, error: 'Please log in' }), { status: 401 });
  }

  let body: DetailsBody;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid JSON body' }), { status: 400 });
  }

  if (!body?.placeId) {
    return new Response(JSON.stringify({ ok: false, error: 'placeId is required' }), { status: 400 });
  }

  try {
    const details = await getPlaceDetails(env.GOOGLE_MAPS_API_KEY, body.placeId);
    return new Response(JSON.stringify({ ok: true, ...details }), { headers: { 'content-type': 'application/json' } });
  } catch (err) {
    if (err instanceof PlacesError) {
      return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 422 });
    }
    throw err;
  }
};
