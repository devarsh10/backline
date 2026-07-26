import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { verifyCustomerSessionToken } from '../../../lib/customerAuth';
import { autocompletePlaces, PlacesError } from '../../../lib/places';

export const prerender = false;

interface AutocompleteBody {
  input?: string;
}

export const POST: APIRoute = async ({ request, cookies }) => {
  const sessionToken = cookies.get('customer_session')?.value;
  const customerId = await verifyCustomerSessionToken(sessionToken, env.CUSTOMER_SESSION_SECRET);
  if (!customerId) {
    return new Response(JSON.stringify({ ok: false, error: 'Please log in' }), { status: 401 });
  }

  let body: AutocompleteBody;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid JSON body' }), { status: 400 });
  }

  const input = body?.input?.trim();
  if (!input) {
    return new Response(JSON.stringify({ ok: true, predictions: [] }), { headers: { 'content-type': 'application/json' } });
  }

  try {
    const predictions = await autocompletePlaces(env.GOOGLE_MAPS_API_KEY, input);
    return new Response(JSON.stringify({ ok: true, predictions }), { headers: { 'content-type': 'application/json' } });
  } catch (err) {
    if (err instanceof PlacesError) {
      return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 422 });
    }
    throw err;
  }
};
