import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { createCustomerSessionToken, hashPassword } from '../../../lib/customerAuth';
import { getCustomerByEmail, createVerifiedCustomer } from '../../../lib/customerDb';

export const prerender = false;

function failRedirect() {
  return new Response(null, { status: 302, headers: { Location: '/account/login?error=google_failed' } });
}

export const GET: APIRoute = async ({ request, cookies }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const oauthError = url.searchParams.get('error');

  const cookieValue = cookies.get('google_oauth_state')?.value;
  cookies.delete('google_oauth_state', { path: '/' });
  const [expectedState, redirectTo] = (cookieValue ?? '').split('|');
  const safeRedirect = redirectTo && redirectTo.startsWith('/') ? redirectTo : '/';

  if (oauthError || !code || !state || state !== expectedState) {
    return failRedirect();
  }

  const redirectUri = `${url.origin}/api/account/google-callback`;
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: env.GOOGLE_OAUTH_CLIENT_ID,
      client_secret: env.GOOGLE_OAUTH_CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  });
  if (!tokenRes.ok) return failRedirect();

  const tokenData = await tokenRes.json<{ access_token: string }>();
  const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  if (!userRes.ok) return failRedirect();

  const profile = await userRes.json<{ email?: string; email_verified?: boolean; name?: string }>();
  if (!profile.email || !profile.email_verified) return failRedirect();

  const email = profile.email.toLowerCase();
  let customer = await getCustomerByEmail(env.DB, email);
  if (!customer) {
    const randomPasswordHash = await hashPassword(crypto.randomUUID() + crypto.randomUUID());
    await createVerifiedCustomer(env.DB, email, randomPasswordHash, profile.name || email.split('@')[0], undefined);
    customer = await getCustomerByEmail(env.DB, email);
  }
  if (!customer) return failRedirect();

  const token = await createCustomerSessionToken(env.CUSTOMER_SESSION_SECRET, customer.id);
  cookies.set('customer_session', token, {
    httpOnly: true,
    secure: url.protocol === 'https:',
    sameSite: 'lax',
    path: '/',
  });

  return new Response(null, { status: 302, headers: { Location: safeRedirect } });
};
