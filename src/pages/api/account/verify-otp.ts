import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { createCustomerSessionToken } from '../../../lib/customerAuth';
import { getCustomerByEmail, markCustomerEmailVerified, verifyOtpCode } from '../../../lib/customerDb';

export const prerender = false;

interface VerifyBody {
  email?: string;
  code?: string;
}

export const POST: APIRoute = async ({ request, cookies }) => {
  let body: VerifyBody;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid JSON body' }), { status: 400 });
  }

  const { email, code } = body ?? {};
  if (!email || !code) {
    return new Response(JSON.stringify({ ok: false, error: 'Email and code are required' }), { status: 400 });
  }

  const valid = await verifyOtpCode(env.DB, email, code);
  if (!valid) {
    return new Response(JSON.stringify({ ok: false, error: 'Incorrect or expired code' }), { status: 400 });
  }

  await markCustomerEmailVerified(env.DB, email);
  const customer = await getCustomerByEmail(env.DB, email);
  if (!customer) {
    return new Response(JSON.stringify({ ok: false, error: 'Account not found' }), { status: 404 });
  }

  const token = await createCustomerSessionToken(env.CUSTOMER_SESSION_SECRET, customer.id);
  cookies.set('customer_session', token, {
    httpOnly: true,
    secure: new URL(request.url).protocol === 'https:',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });

  return new Response(JSON.stringify({ ok: true }), { headers: { 'content-type': 'application/json' } });
};
