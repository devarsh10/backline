import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { generateOtpCode } from '../../../lib/customerAuth';
import { getCustomerByEmail, storeOtpCode } from '../../../lib/customerDb';
import { sendEmail, passwordResetOtpHtml } from '../../../lib/email';

export const prerender = false;

interface ForgotPasswordBody {
  email?: string;
}

function genericOk() {
  return new Response(
    JSON.stringify({ ok: true, message: "If an account exists for that email, we've sent a reset code." }),
    { headers: { 'content-type': 'application/json' } }
  );
}

export const POST: APIRoute = async ({ request }) => {
  let body: ForgotPasswordBody;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid JSON body' }), { status: 400 });
  }

  const email = body?.email?.trim().toLowerCase();
  if (!email) {
    return new Response(JSON.stringify({ ok: false, error: 'Email is required' }), { status: 400 });
  }

  const customer = await getCustomerByEmail(env.DB, email);
  if (!customer) return genericOk();

  const code = generateOtpCode();
  await storeOtpCode(env.DB, email, code);
  await sendEmail(env, email, 'Reset your Backline India password', passwordResetOtpHtml(code));

  return genericOk();
};
