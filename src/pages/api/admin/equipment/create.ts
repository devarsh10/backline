import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { verifySessionToken } from '../../../../lib/adminAuth';
import { getEquipmentBySlug, createEquipmentItem } from '../../../../lib/equipmentDb';

export const prerender = false;

interface CreateBody {
  name?: string;
  brand?: string;
  category?: string;
  subcategory?: string;
  pricePerDay?: number;
  minDays?: number;
  totalUnits?: number;
  included?: string[];
  specs?: Record<string, string>;
  image?: string;
  featured?: boolean;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
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

  let body: CreateBody;
  try {
    body = await request.json();
  } catch {
    return badRequest('Invalid JSON body');
  }

  const { name, brand, category, subcategory, pricePerDay, minDays, totalUnits, included, specs, image, featured } = body ?? {};
  if (!name?.trim() || !brand?.trim() || !category?.trim() || !subcategory?.trim()) {
    return badRequest('Name, brand, category, and subcategory are required');
  }
  if (!Number.isInteger(pricePerDay) || pricePerDay! <= 0) return badRequest('Invalid price per day');
  if (!Number.isInteger(minDays) || minDays! <= 0) return badRequest('Invalid minimum days');
  if (!Number.isInteger(totalUnits) || totalUnits! < 0) return badRequest('Invalid total units');

  const baseSlug = slugify(name);
  if (!baseSlug) return badRequest('Could not generate a slug from that name');

  let slug = baseSlug;
  let suffix = 2;
  while (await getEquipmentBySlug(env.DB, slug)) {
    slug = `${baseSlug}-${suffix}`;
    suffix++;
  }

  await createEquipmentItem(env.DB, {
    slug,
    name: name.trim(),
    brand: brand.trim(),
    category: category.trim(),
    subcategory: subcategory.trim(),
    specs: specs ?? {},
    pricePerDay: pricePerDay!,
    minDays: minDays!,
    included: included ?? [],
    totalUnits: totalUnits!,
    image: image?.trim() || undefined,
    featured: Boolean(featured),
  });

  return new Response(JSON.stringify({ ok: true, slug }), { headers: { 'content-type': 'application/json' } });
};
