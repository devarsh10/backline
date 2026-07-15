export interface SearchableItem {
  slug: string;
  name: string;
  brand: string;
  category: string;
  subcategory: string;
  pricePerDay: number;
  available: boolean;
  featured?: boolean;
  image?: string;
}

export function normalise(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, '');
}

export function searchScore(item: SearchableItem, query: string): number {
  const q = normalise(query);
  const words = q.split(/\s+/).filter(w => w.length > 1);
  const fields = [
    { text: normalise(item.name), weight: 4 },
    { text: normalise(item.brand), weight: 3 },
    { text: normalise(item.subcategory), weight: 2 },
    { text: normalise(item.category), weight: 1 },
  ];
  let score = 0;
  fields.forEach(f => { if (f.text.includes(q)) score += f.weight * 2; });
  words.forEach(word => {
    fields.forEach(f => { if (f.text.includes(word)) score += f.weight; });
  });
  return score;
}

export function searchItems<T extends SearchableItem>(items: T[], query: string, limit = 8): T[] {
  return items
    .map(item => ({ item, score: searchScore(item, query) }))
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(r => r.item);
}
