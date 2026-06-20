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
    name: 'Drums & Cymbals',
    description: 'Professional acoustic and electronic drum kits with cymbals for every stage.',
    icon: '🥁',
  },
  {
    slug: 'guitars',
    name: 'Guitars & Bass Guitars',
    description: 'Electric guitars and bass guitars for session and stage performance.',
    icon: '🎸',
  },
  {
    slug: 'amplifiers',
    name: 'Guitar Amplifiers & Cabinets',
    description: 'Guitar, bass, and keyboard amplifiers and speaker cabinets.',
    icon: '🔊',
  },
  {
    slug: 'keyboards',
    name: 'Keyboards, Synths & Accessories',
    description: 'Stage pianos, synthesizers, and keyboard accessories.',
    icon: '🎹',
  },
  {
    slug: 'percussion',
    name: 'Percussion',
    description: 'Congas, cajons, bongos, and hand percussion instruments.',
    icon: '🪘',
  },
  {
    slug: 'accessories',
    name: 'Miscellaneous Accessories',
    description: 'Cymbals, stands, cables, DI boxes, and add-on hardware.',
    icon: '🔧',
  },
];

export const equipment: EquipmentItem[] = [
  // ── Amplifiers ──
  {
    slug: 'marshall-jcm800-2203',
    name: 'Marshall JCM800 2203 Head',
    brand: 'Marshall',
    category: 'amplifiers',
    subcategory: 'Guitar Amp Head',
    specs: {
      'Power': '100W',
      'Channels': '2 (Hi & Lo gain)',
      'Speaker Out': '4 / 8 / 16Ω',
    },
    pricePerDay: 2500,
    minDays: 1,
    included: ['IEC power cable', 'Footswitch'],
    available: true,
    featured: true,
    relatedAccessorySlugs: ['marshall-1960a-cabinet', 'guitar-cable-pack', 'di-box'],
  },
  {
    slug: 'marshall-1960a-cabinet',
    name: 'Marshall 1960A Cabinet',
    brand: 'Marshall',
    category: 'amplifiers',
    subcategory: 'Guitar Amp Cabinet',
    specs: {
      'Speakers': '4× Celestion G12T-75',
      'Impedance': '4Ω (mono) / 8Ω (stereo)',
    },
    pricePerDay: 1200,
    minDays: 1,
    included: ['Speaker cable'],
    available: true,
    featured: true,
    relatedAccessorySlugs: ['guitar-cable-pack'],
  },
  {
    slug: 'fender-twin-reverb',
    name: 'Fender Twin Reverb (Silverface)',
    brand: 'Fender',
    category: 'amplifiers',
    subcategory: 'Guitar Amp Combo',
    specs: {
      'Speakers': '2× 12"',
      'Effects': 'Spring reverb, tremolo',
    },
    pricePerDay: 2000,
    minDays: 1,
    included: ['IEC power cable', 'Footswitch'],
    available: true,
    featured: false,
    relatedAccessorySlugs: ['guitar-cable-pack', 'di-box'],
  },
  {
    slug: 'mesa-boogie-dual-rectifier',
    name: 'Mesa Boogie Dual Rectifier Head',
    brand: 'Mesa Boogie',
    category: 'amplifiers',
    subcategory: 'Guitar Amp Head',
    specs: {
      'Channels': '3 (Clean, Pushed, Lead)',
      'Power': '100W (switchable to 50W)',
    },
    pricePerDay: 3000,
    minDays: 1,
    included: ['Power cable', 'MIDI footswitch', 'Footswitch'],
    available: true,
    featured: true,
    relatedAccessorySlugs: ['guitar-cable-pack', 'di-box'],
  },
  {
    slug: 'orange-rockerverb-50',
    name: 'Orange Rockerverb 50 MKIII',
    brand: 'Orange',
    category: 'amplifiers',
    subcategory: 'Guitar Amp Head',
    specs: {
      'Channels': '2 (Clean, Dirty)',
      'Reverb': 'Tube spring reverb',
      'Power': '50W',
    },
    pricePerDay: 2200,
    minDays: 1,
    included: ['Power cable', 'Footswitch'],
    available: true,
    featured: false,
    relatedAccessorySlugs: ['guitar-cable-pack', 'di-box'],
  },
  {
    slug: 'markbass-little-mark-250',
    name: 'Markbass Little Mark 250',
    brand: 'Markbass',
    category: 'amplifiers',
    subcategory: 'Bass Amp Head',
    specs: {
      'Power': '250W @ 4Ω',
      'DI Output': 'XLR balanced',
    },
    pricePerDay: 1500,
    minDays: 1,
    included: ['Power cable', 'Speaker cable'],
    available: true,
    featured: false,
    relatedAccessorySlugs: ['guitar-cable-pack', 'di-box'],
  },
  {
    slug: 'roland-keyboard-amp-kc-500',
    name: 'Roland KC-500 Keyboard Amp',
    brand: 'Roland',
    category: 'amplifiers',
    subcategory: 'Keyboard Amp',
    specs: {
      'Speaker': '12" woofer + horn tweeter',
      'Channels': '3',
      'Inputs': 'XLR, TRS, RCA',
    },
    pricePerDay: 1200,
    minDays: 1,
    included: ['Power cable', 'TRS cable'],
    available: true,
    featured: false,
    relatedAccessorySlugs: ['di-box'],
  },

  // ── Drums ──
  {
    slug: 'pearl-reference-drum-kit',
    name: 'Pearl Reference Series Drum Kit',
    brand: 'Pearl',
    category: 'drums',
    subcategory: 'Acoustic Drum Kit',
    specs: {
      'Configuration': '22" kick, 10", 12", 16" toms, 14" snare',
      'Kit': '5-piece',
      'Heads': 'Remo Ambassador (replaced fresh per rental)',
    },
    pricePerDay: 3500,
    minDays: 1,
    included: [
      '22″ Bass Drum',
      '10″ Rack Tom',
      '12″ Rack Tom',
      '16″ Floor Tom',
      '14″ × 5.5″ Snare Drum',
      'Hi-hat stand',
      'Snare stand',
      'Bass drum pedal',
      '3× Boom cymbal stands',
      'Drum throne',
      'Fresh Remo Ambassador heads',
    ],
    available: true,
    featured: true,
    relatedAccessorySlugs: ['zildjian-a-cymbal-pack', 'drum-hardware-pack'],
  },
  {
    slug: 'tama-imperialstar-kit',
    name: 'Tama Imperialstar Drum Kit',
    brand: 'Tama',
    category: 'drums',
    subcategory: 'Acoustic Drum Kit',
    specs: {
      'Configuration': '22" kick, 10", 12", 16" toms, 14" snare',
      'Kit': '5-piece',
    },
    pricePerDay: 2000,
    minDays: 1,
    included: [
      '22″ Bass Drum',
      '10″ Rack Tom',
      '12″ Rack Tom',
      '16″ Floor Tom',
      '14″ × 5.5″ Snare Drum',
      'Hi-hat stand',
      'Snare stand',
      'Bass drum pedal',
      '3× Cymbal stands',
      'Drum throne',
    ],
    available: true,
    featured: false,
    relatedAccessorySlugs: ['zildjian-a-cymbal-pack', 'drum-hardware-pack'],
  },
  {
    slug: 'roland-td-27-ekit',
    name: 'Roland TD-27KV Electronic Drum Kit',
    brand: 'Roland',
    category: 'drums',
    subcategory: 'Electronic Drum Kit',
    specs: {
      'Module': 'Roland TD-27',
      'Type': 'Mesh head pads (low noise)',
      'Connectivity': 'USB audio, MIDI, stereo out',
    },
    pricePerDay: 2800,
    minDays: 1,
    included: [
      'Bass drum pad (KD-A22)',
      '14″ Snare pad (mesh)',
      '10″ Rack Tom ×2',
      '12″ Floor Tom pad',
      'Hi-hat controller (VH-13)',
      '2× Crash cymbal pads',
      'Ride cymbal pad',
      'TD-27 drum module',
      'MDS-50KV rack',
      'Drum throne',
      'Power adapter',
      'Stereo output cable',
    ],
    available: true,
    featured: true,
    relatedAccessorySlugs: ['drum-hardware-pack'],
  },

  // ── Keyboards ──
  {
    slug: 'nord-stage-3-88',
    name: 'Nord Stage 3 88',
    brand: 'Nord',
    category: 'keyboards',
    subcategory: 'Stage Piano',
    specs: {
      'Keys': '88 fully weighted with escapement',
      'Sections': 'Piano + Organ + Synth (all simultaneously)',
    },
    pricePerDay: 4000,
    minDays: 1,
    included: ['Nord padded bag', 'Power supply', 'Sustain pedal', 'TRS cables ×2', 'XLR cables ×2'],
    available: true,
    featured: true,
    relatedAccessorySlugs: ['di-box', 'microphone-stand-pack'],
  },
  {
    slug: 'roland-rd-2000',
    name: 'Roland RD-2000 Stage Piano',
    brand: 'Roland',
    category: 'keyboards',
    subcategory: 'Stage Piano',
    specs: {
      'Keys': '88 fully weighted (PHA-50)',
      'Connectivity': 'USB audio, MIDI, TRS, XLR',
    },
    pricePerDay: 3500,
    minDays: 1,
    included: ['Power cable', 'Sustain pedal', 'Expression pedal', 'TRS cables ×2'],
    available: true,
    featured: false,
    relatedAccessorySlugs: ['di-box'],
  },
  {
    slug: 'korg-minilogue-xd',
    name: 'Korg Minilogue XD',
    brand: 'Korg',
    category: 'keyboards',
    subcategory: 'Synthesizer',
    specs: {
      'Keys': '37 mini keys (velocity sensitive)',
      'Voices': '4 analog + digital multi-engine',
      'Sequencer': '16-step built-in',
    },
    pricePerDay: 1200,
    minDays: 1,
    included: ['Power adapter', 'TRS cable', 'USB cable'],
    available: true,
    featured: false,
    relatedAccessorySlugs: ['di-box'],
  },
  {
    slug: 'yamaha-cp88',
    name: 'Yamaha CP88 Stage Piano',
    brand: 'Yamaha',
    category: 'keyboards',
    subcategory: 'Stage Piano',
    specs: {
      'Keys': '88 balanced hammer',
      'Sections': 'Acoustic Piano + Electric Piano + Organ',
    },
    pricePerDay: 3000,
    minDays: 1,
    included: ['Power cable', 'Sustain pedal', 'TRS cables ×2'],
    available: true,
    featured: false,
    relatedAccessorySlugs: ['di-box'],
  },

  // ── Guitars ──
  {
    slug: 'gibson-les-paul-standard',
    name: "Gibson Les Paul Standard '60s",
    brand: 'Gibson',
    category: 'guitars',
    subcategory: 'Electric Guitar',
    specs: {
      'Pickups': 'Humbuckers (neck + bridge)',
      'Scale': '24.75"',
    },
    pricePerDay: 1500,
    minDays: 1,
    included: ['Hard case', 'Guitar cable (6m)', 'Strap'],
    available: true,
    featured: false,
    relatedAccessorySlugs: ['guitar-cable-pack', 'di-box'],
  },
  {
    slug: 'fender-stratocaster-usa',
    name: 'Fender American Professional II Stratocaster',
    brand: 'Fender',
    category: 'guitars',
    subcategory: 'Electric Guitar',
    specs: {
      'Pickups': 'Single-coil SSS',
      'Scale': '25.5"',
      'Bridge': '2-point tremolo',
    },
    pricePerDay: 1500,
    minDays: 1,
    included: ['Deluxe molded case', 'Guitar cable (6m)', 'Strap'],
    available: true,
    featured: false,
    relatedAccessorySlugs: ['guitar-cable-pack', 'di-box'],
  },

  // ── Percussion ──
  {
    slug: 'latin-percussion-conga-set',
    name: 'Latin Percussion Aspire Conga Set',
    brand: 'Latin Percussion',
    category: 'percussion',
    subcategory: 'Congas',
    specs: {
      'Sizes': '11" Quinto + 12" Conga',
      'Material': 'Mahogany shell',
    },
    pricePerDay: 800,
    minDays: 1,
    included: ['11" Quinto conga', '12" Conga', 'Double conga stand'],
    available: true,
    featured: false,
    relatedAccessorySlugs: [],
  },
  {
    slug: 'meinl-cajon',
    name: 'Meinl Subcraft Series Cajon',
    brand: 'Meinl',
    category: 'percussion',
    subcategory: 'Cajon',
    specs: {
      'Shell': 'Birch',
      'Snare': 'Internal adjustable snare',
    },
    pricePerDay: 500,
    minDays: 1,
    included: ['Cajon', 'Cajon bag'],
    available: true,
    featured: false,
    relatedAccessorySlugs: [],
  },
  {
    slug: 'latin-percussion-bongo-set',
    name: 'Latin Percussion Aspire Bongo Set',
    brand: 'Latin Percussion',
    category: 'percussion',
    subcategory: 'Bongos',
    specs: {
      'Sizes': '6.75" Macho + 8" Hembra',
    },
    pricePerDay: 400,
    minDays: 1,
    included: ['6.75" Macho bongo', '8" Hembra bongo', 'Bongo stand'],
    available: true,
    featured: false,
    relatedAccessorySlugs: [],
  },
  {
    slug: 'remo-frame-drum-set',
    name: 'Remo Hand Percussion Pack',
    brand: 'Remo',
    category: 'percussion',
    subcategory: 'Hand Percussion',
    specs: {
      'Includes': 'Djembe, tambourine, shakers ×2',
    },
    pricePerDay: 600,
    minDays: 1,
    included: ['12" Djembe', '10" Tambourine', '2× Shakers'],
    available: true,
    featured: false,
    relatedAccessorySlugs: [],
  },

  // ── Accessories ──
  {
    slug: 'zildjian-a-cymbal-pack',
    name: 'Zildjian A-Series Cymbal Pack',
    brand: 'Zildjian',
    category: 'drums',
    subcategory: 'Cymbals',
    specs: {
      'Hi-hats': '14"',
      'Crash': '16"',
      'Ride': '20"',
    },
    pricePerDay: 800,
    minDays: 1,
    included: ['14" hi-hats', '16" crash cymbal', '20" ride cymbal', 'Cymbal bag'],
    available: true,
    featured: false,
  },
  {
    slug: 'sabian-aax-cymbal-pack',
    name: 'Sabian AAX Stage Pack',
    brand: 'Sabian',
    category: 'drums',
    subcategory: 'Cymbals',
    specs: {
      'Hi-hats': '14" AAX Stage',
      'Crash': '16" AAX Stage',
      'Ride': '20" AAX Stage',
    },
    pricePerDay: 900,
    minDays: 1,
    included: ['14" hi-hats', '16" crash cymbal', '20" ride cymbal', 'Cymbal bag'],
    available: true,
    featured: false,
  },
  {
    slug: 'zildjian-k-custom-dark-pack',
    name: 'Zildjian K Custom Dark Pack',
    brand: 'Zildjian',
    category: 'drums',
    subcategory: 'Cymbals',
    specs: {
      'Hi-hats': '14" K Custom Dark',
      'Crash': '16" K Custom Dark',
      'Ride': '20" K Custom Dark',
    },
    pricePerDay: 1200,
    minDays: 1,
    included: ['14" K Custom Dark hi-hats', '16" K Custom Dark crash', '20" K Custom Dark ride', 'Cymbal bag'],
    available: true,
    featured: false,
  },
  {
    slug: 'drum-hardware-pack',
    name: 'Drum Hardware Pack',
    brand: 'Pearl',
    category: 'accessories',
    subcategory: 'Hardware & Stands',
    specs: {
      'Includes': 'Snare stand, bass pedal, hi-hat stand, 3× cymbal boom stands, throne',
    },
    pricePerDay: 400,
    minDays: 1,
    included: ['Snare stand', 'Bass drum pedal', 'Hi-hat stand', '3× cymbal boom stands', 'Drum throne'],
    available: true,
    featured: false,
  },
  {
    slug: 'di-box',
    name: 'Radial J48 Active DI Box',
    brand: 'Radial',
    category: 'accessories',
    subcategory: 'DI Boxes',
    specs: {
      'Type': 'Active DI',
      'Input': 'Instrument or line level',
    },
    pricePerDay: 300,
    minDays: 1,
    included: ['XLR cable (3m)'],
    available: true,
    featured: false,
  },
  {
    slug: 'guitar-cable-pack',
    name: 'Guitar Cable Pack (×4)',
    brand: 'Mogami',
    category: 'accessories',
    subcategory: 'Cables',
    specs: {
      'Cables': '4× Mogami 6m instrument cables',
    },
    pricePerDay: 200,
    minDays: 1,
    included: ['4× Mogami TS instrument cables (6m)', 'Cable bag'],
    available: true,
    featured: false,
  },
  {
    slug: 'microphone-stand-pack',
    name: 'Microphone Stand Pack (×4)',
    brand: 'K&M',
    category: 'accessories',
    subcategory: 'Stands',
    specs: {
      'Quantity': '4× boom microphone stands',
    },
    pricePerDay: 300,
    minDays: 1,
    included: ['4× K&M boom microphone stands', '4× XLR cables (5m)'],
    available: true,
    featured: false,
  },
];

export function getEquipmentByCategory(categorySlug: string): EquipmentItem[] {
  return equipment.filter(item => item.category === categorySlug);
}

export function getEquipmentBySlug(slug: string): EquipmentItem | undefined {
  return equipment.find(item => item.slug === slug);
}

export function getEquipmentBySlugs(slugs: string[]): EquipmentItem[] {
  return slugs.map(s => equipment.find(i => i.slug === s)).filter(Boolean) as EquipmentItem[];
}

export function getFeaturedEquipment(): EquipmentItem[] {
  return equipment.filter(item => item.featured);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find(cat => cat.slug === slug);
}

export function formatPrice(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}
