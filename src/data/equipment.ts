export interface CartItem {
  slug: string;
  name: string;
  brand: string;
  category: string;
  pricePerDay: number;
  quantity: number;
}

export interface EquipmentItem {
  slug: string;
  name: string;
  brand: string;
  category: string;
  subcategory: string;
  specs: Record<string, string>;
  pricePerDay: number;
  minDays: number;
  included: string[];
  available: boolean;
  image?: string;
  featured?: boolean;
  relatedAccessorySlugs?: string[];
  totalUnits?: number;
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  icon: string;
}

export const rentalDiscountTiers = [
  { minDays: 1, discountPct: 0 },
  { minDays: 2, discountPct: 2 },
  { minDays: 3, discountPct: 5 },
  { minDays: 7, discountPct: 10 },
];

export function getDiscountForDays(days: number): number {
  let discount = 0;
  for (const tier of rentalDiscountTiers) {
    if (days >= tier.minDays) discount = tier.discountPct;
  }
  return discount;
}

export const categories: Category[] = [
  {
    slug: 'drums',
    name: 'Drum Kits & Cymbals',
    description: 'Professional acoustic drum kits and premium cymbal packs for every stage.',
    icon: '🥁',
  },
  {
    slug: 'drum-accessories',
    name: 'Drum Accessories',
    description: 'Hardware sets and boom stands — rented separately from the kit.',
    icon: '🔧',
  },
  {
    slug: 'amplifiers',
    name: 'Amplifiers & Cabinets',
    description: 'Guitar, bass, and keyboard amplifier heads and matching cabinets.',
    icon: '🔊',
  },
  {
    slug: 'keyboards',
    name: 'Pianos & Keyboards',
    description: 'Digital grand pianos, stage pianos, and synthesizers — our signature backline.',
    icon: '🎹',
  },
  {
    slug: 'percussion',
    name: 'Percussion',
    description: 'Congas, bongos, timbales, cajons, and djembes for events and studio sessions.',
    icon: '🪘',
  },
  {
    slug: 'miscellaneous',
    name: 'Miscellaneous',
    description: 'Stage accessories, stands, drum shields, and rugs that round out your setup.',
    icon: '🎛️',
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find(cat => cat.slug === slug);
}
