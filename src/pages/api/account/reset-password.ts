import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { hashPassword, createCustomerSessionToken } from '../../../lib/customerAuth';
import { getCustomerByEmail, updateCustomerPassword, markCustomerEmailVerified, verifyOtpCode } from '../../../lib/customerDb';

export const prerender = false;

interface ResetPasswordBody {
  email?: string;
  code?: string;
  password?: string;
}

export const POST: APIRoute = async ({ request, cookies }) => {
  let body: ResetPasswordBody;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid JSON body' }), { status: 400 });
  }

  const email = body?.email?.trim().toLowerCase();
  const { code, password } = body ?? {};
  if (!email || !code || !password) {
    return new Response(JSON.stringify({ ok: false, error: 'Email, code, and new password are required' }), { status: 400 });
  }
  if (password.length < 8) {
    return new Response(JSON.stringify({ ok: false, error: 'Password must be at least 8 characters' }), { status: 400 });
  }

  const valid = await verifyOtpCode(env.DB, email, code);
  if (!valid) {
    return new Response(JSON.stringify({ ok: false, error: 'Incorrect or expired code' }), { status: 400 });
  }

  const customer = await getCustomerByEmail(env.DB, email);
  if (!customer) {
    return new Response(JSON.stringify({ ok: false, error: 'Account not found' }), { status: 404 });
  }

  const passwordHash = await hashPassword(password);
  await updateCustomerPassword(env.DB, customer.id, passwordHash);
  await markCustomerEmailVerified(env.DB, email);

  const token = await createCustomerSessionToken(env.CUSTOMER_SESSION_SECRET, customer.id);
  cookies.set('customer_session', token, {
    httpOnly: true,
    secure: new URL(request.url).protocol === 'https:',
    sameSite: 'lax',
    path: '/',
  });

  return new Response(JSON.stringify({ ok: true }), { headers: { 'content-type': 'application/json' } });
};
