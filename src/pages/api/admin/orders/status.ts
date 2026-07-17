import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { verifySessionToken } from '../../../../lib/adminAuth';
import { getOrderByRef, updateOrderStatus, ORDER_STATUSES, type OrderStatus } from '../../../../lib/db';

export const prerender = false;

interface StatusBody {
  order_ref?: string;
  status?: string;
}

export const POST: APIRoute = async ({ request, cookies }) => {
  const token = cookies.get('admin_session')?.value;
  if (!(await verifySessionToken(token, env.ADMIN_SESSION_SECRET))) {
    return new Response(JSON.stringify({ ok: false, error: 'Unauthorized' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    });
  }

  let body: StatusBody;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid JSON body' }), { status: 400 });
  }

  const { order_ref, status } = body ?? {};
  if (!order_ref || !status || !(ORDER_STATUSES as readonly string[]).includes(status)) {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid order reference or status' }), { status: 400 });
  }

  const order = await getOrderByRef(env.DB, order_ref);
  if (!order) {
    return new Response(JSON.stringify({ ok: false, error: 'Order not found' }), { status: 404 });
  }

  if (order.status === 'order_placed' && (status === 'out_for_delivery' || status === 'delivered')) {
    return new Response(
      JSON.stringify({ ok: false, error: 'Cannot mark as out for delivery/delivered before payment is received' }),
      { status: 400 }
    );
  }

  await updateOrderStatus(env.DB, order_ref, status as OrderStatus);
  return new Response(JSON.stringify({ ok: true }), { headers: { 'content-type': 'application/json' } });
};
