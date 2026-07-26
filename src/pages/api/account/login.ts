import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { verifyPassword, createCustomerSessionToken } from '../../../lib/customerAuth';
import { getCustomerByEmail } from '../../../lib/customerDb';

export const prerender = false;

interface LoginBody {
  email?: string;
  password?: string;
}

export const POST: APIRoute = async ({ request, cookies }) => {
  let body: LoginBody;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid JSON body' }), { status: 400 });
  }

  const { email, password } = body ?? {};
  if (!email || !password) {
    return new Response(JSON.stringify({ ok: false, error: 'Email and password are required' }), { status: 400 });
  }

  const customer = await getCustomerByEmail(env.DB, email);
  if (!customer || !(await verifyPassword(password, customer.password_hash))) {
    return new Response(JSON.stringify({ ok: false, error: 'Incorrect email or password' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    });
  }

  if (!customer.email_verified) {
    return new Response(JSON.stringify({ ok: false, error: 'Please verify your email first', needsVerification: true }), {
      status: 403,
      headers: { 'content-type': 'application/json' },
    });
  }

  const token = await createCustomerSessionToken(env.CUSTOMER_SESSION_SECRET, customer.id);
  cookies.set('customer_session', token, {
    httpOnly: true,
    secure: new URL(request.url).protocol === 'https:',
    sameSite: 'lax',
    path: '/',
    // No maxAge: this is a browser-session cookie, cleared when the browser closes,
    // rather than persisting the login for 30 days regardless.
  });

  return new Response(JSON.stringify({ ok: true }), { headers: { 'content-type': 'application/json' } });
};
