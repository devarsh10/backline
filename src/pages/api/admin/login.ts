import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { createSessionToken, constantTimeEqual } from '../../../lib/adminAuth';

export const prerender = false;

interface LoginBody {
  password?: string;
}

export const POST: APIRoute = async ({ request, cookies }) => {
  let body: LoginBody;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid JSON body' }), { status: 400 });
  }

  const password = body?.password ?? '';
  if (!env.ADMIN_PASSWORD || !constantTimeEqual(password, env.ADMIN_PASSWORD)) {
    return new Response(JSON.stringify({ ok: false, error: 'Incorrect password' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    });
  }

  const token = await createSessionToken(env.ADMIN_SESSION_SECRET);
  cookies.set('admin_session', token, {
    httpOnly: true,
    secure: new URL(request.url).protocol === 'https:',
    sameSite: 'lax',
    path: '/',
    // No maxAge: this is a browser-session cookie, cleared when the browser
    // closes, rather than persisting the admin login for a week regardless
    // of who might use this machine next.
  });

  return new Response(JSON.stringify({ ok: true }), { headers: { 'content-type': 'application/json' } });
};
