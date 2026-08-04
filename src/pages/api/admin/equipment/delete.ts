import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { verifySessionToken } from '../../../../lib/adminAuth';
import { getEquipmentBySlug, deleteEquipmentItem } from '../../../../lib/equipmentDb';

export const prerender = false;

interface DeleteBody {
  slug?: string;
}

export const POST: APIRoute = async ({ request, cookies }) => {
  const token = cookies.get('admin_session')?.value;
  if (!(await verifySessionToken(token, env.ADMIN_SESSION_SECRET))) {
    return new Response(JSON.stringify({ ok: false, error: 'Unauthorized' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    });
  }

  let body: DeleteBody;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid JSON body' }), { status: 400 });
  }

  const { slug } = body ?? {};
  if (!slug) return new Response(JSON.stringify({ ok: false, error: 'Slug is required' }), { status: 400 });

  const item = await getEquipmentBySlug(env.DB, slug);
  if (!item) {
    return new Response(JSON.stringify({ ok: false, error: 'Equipment not found' }), { status: 404 });
  }

  await deleteEquipmentItem(env.DB, slug);
  return new Response(JSON.stringify({ ok: true }), { headers: { 'content-type': 'application/json' } });
};
