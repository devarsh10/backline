import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { hashPassword, generateOtpCode } from '../../../lib/customerAuth';
import { createCustomer, getCustomerByEmail, storeOtpCode } from '../../../lib/customerDb';
import { sendEmail, otpEmailHtml } from '../../../lib/email';

export const prerender = false;

interface SignupBody {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
}

function badRequest(message: string) {
  return new Response(JSON.stringify({ ok: false, error: message }), {
    status: 400,
    headers: { 'content-type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request }) => {
  let body: SignupBody;
  try {
    body = await request.json();
  } catch {
    return badRequest('Invalid JSON body');
  }

  const { name, email, phone, password } = body ?? {};
  if (!name || !email || !password) return badRequest('Name, email, and password are required');
  if (password.length < 8) return badRequest('Password must be at least 8 characters');

  const existing = await getCustomerByEmail(env.DB, email);
  if (existing && existing.email_verified) {
    return badRequest('An account with this email already exists');
  }

  if (!existing) {
    const passwordHash = await hashPassword(password);
    await createCustomer(env.DB, email, passwordHash, name, phone);
  }

  const code = generateOtpCode();
  await storeOtpCode(env.DB, email, code);
  await sendEmail(env, email, 'Verify your Backline India account', otpEmailHtml(code));

  return new Response(JSON.stringify({ ok: true }), { headers: { 'content-type': 'application/json' } });
};
