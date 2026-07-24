import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { verifySessionToken } from '../../../../lib/adminAuth';
import { getEquipmentBySlug, updateEquipmentTotalUnits } from '../../../../lib/equipmentDb';

export const prerender = false;

interface UnitsBody {
  slug?: string;
  total_units?: number;
}

export const POST: APIRoute = async ({ request, cookies }) => {
  const token = cookies.get('admin_session')?.value;
  if (!(await verifySessionToken(token, env.ADMIN_SESSION_SECRET))) {
    return new Response(JSON.stringify({ ok: false, error: 'Unauthorized' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    });
  }

  let body: UnitsBody;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid JSON body' }), { status: 400 });
  }

  const { slug, total_units } = body ?? {};
  if (!slug || !Number.isInteger(total_units) || total_units! < 0) {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid slug or units' }), { status: 400 });
  }

  const item = await getEquipmentBySlug(env.DB, slug);
  if (!item) {
    return new Response(JSON.stringify({ ok: false, error: 'Equipment not found' }), { status: 404 });
  }

  await updateEquipmentTotalUnits(env.DB, slug, total_units!);
  return new Response(JSON.stringify({ ok: true }), { headers: { 'content-type': 'application/json' } });
};
