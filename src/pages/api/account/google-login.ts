import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const prerender = false;

export const GET: APIRoute = async ({ request, cookies }) => {
  const url = new URL(request.url);
  const redirectTo = url.searchParams.get('redirect') || '/';
  const state = crypto.randomUUID();

  cookies.set('google_oauth_state', `${state}|${redirectTo}`, {
    httpOnly: true,
    secure: url.protocol === 'https:',
    sameSite: 'lax',
    path: '/',
    maxAge: 600,
  });

  const redirectUri = `${url.origin}/api/account/google-callback`;
  const params = new URLSearchParams({
    client_id: env.GOOGLE_OAUTH_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    prompt: 'select_account',
  });

  return new Response(null, {
    status: 302,
    headers: { Location: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}` },
  });
};
