import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { verifySessionToken } from '../../../../lib/adminAuth';
import { getEquipmentBySlug, updateEquipmentItem } from '../../../../lib/equipmentDb';

export const prerender = false;

interface UpdateBody {
  slug?: string;
  name?: string;
  brand?: string;
  category?: string;
  subcategory?: string;
  pricePerDay?: number;
  minDays?: number;
  included?: string[];
  specs?: Record<string, string>;
  image?: string;
  featured?: boolean;
}

function badRequest(message: string) {
  return new Response(JSON.stringify({ ok: false, error: message }), {
    status: 400,
    headers: { 'content-type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request, cookies }) => {
  const token = cookies.get('admin_session')?.value;
  if (!(await verifySessionToken(token, env.ADMIN_SESSION_SECRET))) {
    return new Response(JSON.stringify({ ok: false, error: 'Unauthorized' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    });
  }

  let body: UpdateBody;
  try {
    body = await request.json();
  } catch {
    return badRequest('Invalid JSON body');
  }

  const { slug, name, brand, category, subcategory, pricePerDay, minDays, included, specs, image, featured } = body ?? {};
  if (!slug) return badRequest('Slug is required');
  if (!name?.trim() || !brand?.trim() || !category?.trim() || !subcategory?.trim()) {
    return badRequest('Name, brand, category, and subcategory are required');
  }
  if (!Number.isInteger(pricePerDay) || pricePerDay! <= 0) return badRequest('Invalid price per day');
  if (!Number.isInteger(minDays) || minDays! <= 0) return badRequest('Invalid minimum days');

  const existing = await getEquipmentBySlug(env.DB, slug);
  if (!existing) return new Response(JSON.stringify({ ok: false, error: 'Equipment not found' }), { status: 404 });

  await updateEquipmentItem(env.DB, slug, {
    name: name.trim(),
    brand: brand.trim(),
    category: category.trim(),
    subcategory: subcategory.trim(),
    specs: specs ?? {},
    pricePerDay: pricePerDay!,
    minDays: minDays!,
    included: included ?? [],
    image: image?.trim() || undefined,
    featured: Boolean(featured),
  });

  return new Response(JSON.stringify({ ok: true }), { headers: { 'content-type': 'application/json' } });
};
