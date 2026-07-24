import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { verifySessionToken } from '../../../lib/adminAuth';
import { getAllEquipment } from '../../../lib/equipmentDb';

export const prerender = false;

export const GET: APIRoute = async ({ cookies }) => {
  const token = cookies.get('admin_session')?.value;
  if (!(await verifySessionToken(token, env.ADMIN_SESSION_SECRET))) {
    return new Response(JSON.stringify({ ok: false, error: 'Unauthorized' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    });
  }

  const equipment = await getAllEquipment(env.DB);
  return new Response(JSON.stringify({ ok: true, equipment }), { headers: { 'content-type': 'application/json' } });
};
