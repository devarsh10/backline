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
  image: string | null;
  featured: number;
  related_accessory_slugs: string | null;
  total_units: number | null;
}

function mapRow(row: EquipmentRow): EquipmentItem {
  const totalUnits = row.total_units ?? 0;
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
    available: totalUnits > 0,
    image: row.image ?? undefined,
    featured: row.featured === 1,
    relatedAccessorySlugs: row.related_accessory_slugs ? JSON.parse(row.related_accessory_slugs) : undefined,
    totalUnits,
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

export async function updateEquipmentPrice(db: D1Database, slug: string, pricePerDay: number): Promise<void> {
  await db
    .prepare(`UPDATE equipment SET price_per_day = ?, updated_at = datetime('now') WHERE slug = ?`)
    .bind(pricePerDay, slug)
    .run();
}

export interface NewEquipmentInput {
  slug: string;
  name: string;
  brand: string;
  category: string;
  subcategory: string;
  specs: Record<string, string>;
  pricePerDay: number;
  minDays: number;
  included: string[];
  totalUnits: number;
  image?: string;
  featured: boolean;
}

export async function createEquipmentItem(db: D1Database, item: NewEquipmentInput): Promise<void> {
  await db
    .prepare(
      `INSERT INTO equipment (
        slug, name, brand, category, subcategory, specs, price_per_day, min_days,
        included, image, featured, total_units
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      item.slug,
      item.name,
      item.brand,
      item.category,
      item.subcategory,
      JSON.stringify(item.specs),
      item.pricePerDay,
      item.minDays,
      JSON.stringify(item.included),
      item.image ?? null,
      item.featured ? 1 : 0,
      item.totalUnits
    )
    .run();
}
