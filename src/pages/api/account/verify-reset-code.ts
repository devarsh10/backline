import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { checkOtpCode } from '../../../lib/customerDb';

export const prerender = false;

interface VerifyResetCodeBody {
  email?: string;
  code?: string;
}

export const POST: APIRoute = async ({ request }) => {
  let body: VerifyResetCodeBody;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid JSON body' }), { status: 400 });
  }

  const email = body?.email?.trim().toLowerCase();
  const { code } = body ?? {};
  if (!email || !code) {
    return new Response(JSON.stringify({ ok: false, error: 'Email and code are required' }), { status: 400 });
  }

  const valid = await checkOtpCode(env.DB, email, code);
  if (!valid) {
    return new Response(JSON.stringify({ ok: false, error: 'Incorrect or expired code' }), { status: 400 });
  }

  return new Response(JSON.stringify({ ok: true }), { headers: { 'content-type': 'application/json' } });
};
