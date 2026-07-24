import type { EquipmentItem } from '../data/equipment';

interface EquipmentRow {
  slug: string;
  name: string;
  brand: string;
  category: string;
  subcategory: string;
  specs: string;
  price_per_day: number;
  min_days: number;
  included: string;
  available: number;
  image: string | null;
  featured: number;
  related_accessory_slugs: string | null;
  total_units: number | null;
}

function mapRow(row: EquipmentRow): EquipmentItem {
  return {
    slug: row.slug,
    name: row.name,
    brand: row.brand,
    category: row.category,
    subcategory: row.subcategory,
    specs: JSON.parse(row.specs),
    pricePerDay: row.price_per_day,
    minDays: row.min_days,
    included: JSON.parse(row.included),
    available: row.available === 1,
    image: row.image ?? undefined,
    featured: row.featured === 1,
    relatedAccessorySlugs: row.related_accessory_slugs ? JSON.parse(row.related_accessory_slugs) : undefined,
    totalUnits: row.total_units ?? undefined,
  };
}

export async function getAllEquipment(db: D1Database): Promise<EquipmentItem[]> {
  const { results } = await db.prepare(`SELECT * FROM equipment`).all<EquipmentRow>();
  return results.map(mapRow);
}

export async function getEquipmentByCategory(db: D1Database, categorySlug: string): Promise<EquipmentItem[]> {
  const { results } = await db
    .prepare(`SELECT * FROM equipment WHERE category = ?`)
    .bind(categorySlug)
    .all<EquipmentRow>();
  return results.map(mapRow);
}

export async function getEquipmentBySlug(db: D1Database, slug: string): Promise<EquipmentItem | null> {
  const row = await db.prepare(`SELECT * FROM equipment WHERE slug = ?`).bind(slug).first<EquipmentRow>();
  return row ? mapRow(row) : null;
}

export async function getEquipmentBySlugs(db: D1Database, slugs: string[]): Promise<EquipmentItem[]> {
  if (slugs.length === 0) return [];
  const placeholders = slugs.map(() => '?').join(', ');
  const { results } = await db
    .prepare(`SELECT * FROM equipment WHERE slug IN (${placeholders})`)
    .bind(...slugs)
    .all<EquipmentRow>();
  return results.map(mapRow);
}

export async function getFeaturedEquipment(db: D1Database): Promise<EquipmentItem[]> {
  const { results } = await db.prepare(`SELECT * FROM equipment WHERE featured = 1`).all<EquipmentRow>();
  return results.map(mapRow);
}

export async function updateEquipmentTotalUnits(db: D1Database, slug: string, totalUnits: number): Promise<void> {
  await db
    .prepare(`UPDATE equipment SET total_units = ?, updated_at = datetime('now') WHERE slug = ?`)
    .bind(totalUnits, slug)
    .run();
}
