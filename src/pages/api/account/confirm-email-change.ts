import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { verifyCustomerSessionToken } from '../../../lib/customerAuth';
import { getCustomerById, confirmPendingEmail, verifyOtpCode } from '../../../lib/customerDb';

export const prerender = false;

interface ConfirmBody {
  code?: string;
}

export const POST: APIRoute = async ({ request, cookies }) => {
  const sessionToken = cookies.get('customer_session')?.value;
  const customerId = await verifyCustomerSessionToken(sessionToken, env.CUSTOMER_SESSION_SECRET);
  if (!customerId) return new Response(JSON.stringify({ ok: false, error: 'Not signed in' }), { status: 401 });

  const customer = await getCustomerById(env.DB, customerId);
  if (!customer) return new Response(JSON.stringify({ ok: false, error: 'Account not found' }), { status: 404 });
  if (!customer.pending_email) {
    return new Response(JSON.stringify({ ok: false, error: 'No email change in progress' }), { status: 400 });
  }

  let body: ConfirmBody;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid JSON body' }), { status: 400 });
  }

  const { code } = body ?? {};
  if (!code) return new Response(JSON.stringify({ ok: false, error: 'Code is required' }), { status: 400 });

  const valid = await verifyOtpCode(env.DB, customer.pending_email, code);
  if (!valid) {
    return new Response(JSON.stringify({ ok: false, error: 'Incorrect or expired code' }), { status: 400 });
  }

  await confirmPendingEmail(env.DB, customerId);

  return new Response(JSON.stringify({ ok: true, email: customer.pending_email }), {
    headers: { 'content-type': 'application/json' },
  });
};
