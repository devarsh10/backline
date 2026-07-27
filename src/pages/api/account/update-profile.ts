import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { verifyCustomerSessionToken, generateOtpCode } from '../../../lib/customerAuth';
import { getCustomerByEmail, getCustomerById, updateCustomerProfile, setPendingEmail, storeOtpCode } from '../../../lib/customerDb';
import { sendEmail, otpEmailHtml } from '../../../lib/email';

export const prerender = false;

interface UpdateProfileBody {
  name?: string;
  phone?: string;
  email?: string;
}

function badRequest(message: string) {
  return new Response(JSON.stringify({ ok: false, error: message }), {
    status: 400,
    headers: { 'content-type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request, cookies }) => {
  const sessionToken = cookies.get('customer_session')?.value;
  const customerId = await verifyCustomerSessionToken(sessionToken, env.CUSTOMER_SESSION_SECRET);
  if (!customerId) return new Response(JSON.stringify({ ok: false, error: 'Not signed in' }), { status: 401 });

  const customer = await getCustomerById(env.DB, customerId);
  if (!customer) return new Response(JSON.stringify({ ok: false, error: 'Account not found' }), { status: 404 });

  let body: UpdateProfileBody;
  try {
    body = await request.json();
  } catch {
    return badRequest('Invalid JSON body');
  }

  const { name, phone, email } = body ?? {};
  if (!name) return badRequest('Name is required');
  if (!email) return badRequest('Email is required');

  await updateCustomerProfile(env.DB, customerId, name, phone);

  const newEmail = email.trim().toLowerCase();
  if (newEmail === customer.email.toLowerCase()) {
    return new Response(JSON.stringify({ ok: true }), { headers: { 'content-type': 'application/json' } });
  }

  const existing = await getCustomerByEmail(env.DB, newEmail);
  if (existing && existing.id !== customerId) {
    return badRequest('That email is already in use by another account');
  }

  await setPendingEmail(env.DB, customerId, newEmail);
  const code = generateOtpCode();
  await storeOtpCode(env.DB, newEmail, code);
  await sendEmail(env, newEmail, 'Confirm your new email address', otpEmailHtml(code));

  return new Response(JSON.stringify({ ok: true, pendingEmail: newEmail }), {
    headers: { 'content-type': 'application/json' },
  });
};
