import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { sendEmail, contactMessageEmailHtml } from '../../lib/email';

export const prerender = false;

interface ContactBody {
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
}

export const POST: APIRoute = async ({ request }) => {
  let body: ContactBody;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid JSON body' }), { status: 400 });
  }

  const { name, phone, message } = body ?? {};
  const email = body?.email ?? '';
  if (!name?.trim() || !phone?.trim() || !message?.trim()) {
    return new Response(JSON.stringify({ ok: false, error: 'Name, phone, and message are required' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  await sendEmail(
    env,
    'admin@backlineindia.com',
    `New message from ${name}`,
    contactMessageEmailHtml(name, phone, email, message)
  );

  return new Response(JSON.stringify({ ok: true }), { headers: { 'content-type': 'application/json' } });
};
