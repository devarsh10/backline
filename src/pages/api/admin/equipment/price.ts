import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { verifySessionToken } from '../../../../lib/adminAuth';
import { getEquipmentBySlug, updateEquipmentPrice } from '../../../../lib/equipmentDb';

export const prerender = false;

interface PriceBody {
  slug?: string;
  price_per_day?: number;
}

export const POST: APIRoute = async ({ request, cookies }) => {
  const token = cookies.get('admin_session')?.value;
  if (!(await verifySessionToken(token, env.ADMIN_SESSION_SECRET))) {
    return new Response(JSON.stringify({ ok: false, error: 'Unauthorized' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    });
  }

  let body: PriceBody;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid JSON body' }), { status: 400 });
  }

  const { slug, price_per_day } = body ?? {};
  if (!slug || !Number.isInteger(price_per_day) || price_per_day! <= 0) {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid slug or price' }), { status: 400 });
  }

  const item = await getEquipmentBySlug(env.DB, slug);
  if (!item) {
    return new Response(JSON.stringify({ ok: false, error: 'Equipment not found' }), { status: 404 });
  }

  await updateEquipmentPrice(env.DB, slug, price_per_day!);
  return new Response(JSON.stringify({ ok: true }), { headers: { 'content-type': 'application/json' } });
};
