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
    name: 'Drum Kits & Cymbals',
    description: 'Professional acoustic drum kits and premium cymbal packs for every stage.',
    icon: '🥁',
  },
  {
    slug: 'drum-accessories',
    name: 'Drum Accessories',
    description: 'Hardware sets, boom stands, drum shields, and rugs — rented separately from the kit.',
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
];

// NOTE ON PRICING: the source inventory list gives per-unit purchase/replacement
// values, not day-rental rates. Most day rates below are ~2.5%–3.0% of unit
// value, sliding on a log scale so cheap accessories sit near 3.0% and
// expensive items sit near 2.5%, then rounded to a clean number.
// EXCEPTION: Acoustic Drum Kits and Digital Grand Pianos use a flat ~3.75%
// instead — large/bulky gear costs more to transport, crew, and insure per
// rental than the sliding scale accounts for (client feedback, 2026-07-16).

export const equipment: EquipmentItem[] = [
  // ── Drum Kits ──
  {
    slug: 'pearl-reference-6pc-kit', // unit value ₹6,69,500
    name: "Pearl Reference Drum Kit — 6 Pc.",
    brand: 'Pearl',
    category: 'drums',
    subcategory: 'Acoustic Drum Kit',
    specs: {
      'Finish': 'Peacock Fade',
      'Configuration': '10"×7" & 12"×8" rack toms, 14"×14" & 16"×16" floor toms, 14"×5" snare, 22"×18" bass drum',
      'Kit': '6-piece',
    },
    pricePerDay: 25100,
    minDays: 1,
    included: [
      '10″×7″ Rack Tom (w/ mounting adaptor & L-rod)',
      '12″×8″ Rack Tom (w/ mounting adaptor & L-rod)',
      '14″×14″ Floor Tom',
      '16″×16″ Floor Tom',
      '14″×5″ Snare Drum',
      '22″×18″ Bass Drum',
    ],
    available: true,
    image: '/images/equipment/pearl-reference-6pc-kit.jpg',
    featured: true,
    relatedAccessorySlugs: ['pearl-hardware-set-hwp934', 'zildjian-a-sweet-cymbal-pack'],
  },
  {
    slug: 'dw-collectors-maple-5pc-kit', // unit value ₹5,78,000
    name: "DW Collector's Maple Drum Kit — 5 Pc.",
    brand: 'DW',
    category: 'drums',
    subcategory: 'Acoustic Drum Kit',
    specs: {
      'Finish': 'Ruby Glass',
      'Configuration': '10"×8" & 12"×9" rack toms, 16"×14" floor tom, 14"×5.5" snare, 22"×18" bass drum',
      'Kit': '5-piece',
    },
    pricePerDay: 21700,
    minDays: 1,
    included: [
      '10″×8″ Rack Tom',
      '12″×9″ Rack Tom',
      '16″×14″ Floor Tom',
      '14″×5.5″ Snare Drum',
      '22″×18″ Bass Drum',
    ],
    available: true,
    image: '/images/equipment/dw-collectors-maple-5pc-kit.jpg',
    featured: true,
    relatedAccessorySlugs: ['dw-hardware-set', 'zildjian-a-sweet-cymbal-pack'],
  },

  // ── Cymbals ──
  {
    slug: 'zildjian-a-sweet-cymbal-pack',
    name: 'Zildjian A Sweet Cymbal Pack — A391',
    brand: 'Zildjian',
    category: 'drums',
    subcategory: 'Cymbals',
    specs: {
      'Hi-hats': '14" New Beat',
      'Crash': '16" & 18" Medium Thin',
      'Ride': '21" Sweet',
    },
    pricePerDay: 3100,
    minDays: 1,
    included: ['14" New Beat Hi-Hats', '16" Medium Thin Crash', '18" Medium Thin Crash', '21" Sweet Ride'],
    available: true,
    image: '/images/equipment/zildjian-a-sweet-cymbal-pack.jpg',
    featured: true,
  },
  {
    slug: 'zildjian-k-custom-dark-cymbal-pack',
    name: 'Zildjian K Custom Dark Cymbal Pack — KCD900',
    brand: 'Zildjian',
    category: 'drums',
    subcategory: 'Cymbals',
    specs: {
      'Hi-hats': '14"',
      'Crash': '16" & 18" Dark',
      'Ride': '20"',
    },
    pricePerDay: 4150,
    minDays: 1,
    included: ['14" Hi-Hats', '16" Dark Crash', '18" Dark Crash', '20" Ride'],
    available: false,
    image: '/images/equipment/zildjian-k-custom-dark-cymbal-pack.jpg',
    featured: false,
  },
  {
    slug: 'zildjian-k-custom-hybrid-cymbal-pack',
    name: 'Zildjian K Custom Hybrid Cymbal Pack — K1250',
    brand: 'Zildjian',
    category: 'drums',
    subcategory: 'Cymbals',
    specs: {
      'Hi-hats': '14.5" Custom',
      'Crash': '16" & 18" Custom Hybrid',
      'Ride': '20" Custom Hybrid',
    },
    pricePerDay: 4150,
    minDays: 1,
    included: ['14.5" Custom Hi-Hats', '16" Custom Hybrid Crash', '18" Custom Hybrid Crash', '20" Custom Hybrid Ride'],
    available: false,
    image: '/images/equipment/zildjian-k-custom-hybrid-cymbal-pack.jpg',
    featured: false,
  },
  {
    slug: 'zildjian-k-custom-dark-splash',
    name: 'Zildjian K Custom Dark Splash — K0932',
    brand: 'Zildjian',
    category: 'drums',
    subcategory: 'Cymbals',
    specs: { 'Size': '10"' },
    pricePerDay: 650,
    minDays: 1,
    included: ['10" K Custom Dark Splash'],
    available: true,
    image: '/images/equipment/zildjian-k-custom-dark-splash.jpg',
    featured: false,
  },
  {
    slug: 'zildjian-k-custom-china',
    name: 'Zildjian K Custom Special Dry Trash China — K1420',
    brand: 'Zildjian',
    category: 'drums',
    subcategory: 'Cymbals',
    specs: { 'Size': '18"' },
    pricePerDay: 1350,
    minDays: 1,
    included: ['18" K Custom Special Dry Trash China'],
    available: true,
    image: '/images/equipment/zildjian-k-custom-china.jpg',
    featured: false,
  },

  // ── Drum Accessories ──
  {
    slug: 'pearl-hardware-set-hwp934',
    name: 'Pearl Hardware Set — HWP-934',
    brand: 'Pearl',
    category: 'drum-accessories',
    subcategory: 'Hardware Set',
    specs: { 'Includes': 'Hi-hat stand, snare stand, bass pedal, 2× boom cymbal stands' },
    pricePerDay: 2000,
    minDays: 1,
    included: ['H-930 Hi-Hat Stand', 'S-930 Snare Stand', 'P-930 Bass Drum Pedal', '2× BC-930 Boom Cymbal Stand'],
    available: true,
    image: '/images/equipment/pearl-hardware-set-hwp934.jpg',
    featured: true,
  },
  {
    slug: 'dw-hardware-set',
    name: 'DW Hardware Set',
    brand: 'DW',
    category: 'drum-accessories',
    subcategory: 'Hardware Set',
    specs: { 'Includes': '2× tom/cymbal stand w/ DogBone, hi-hat stand, boom cymbal stand, snare stand' },
    pricePerDay: 2950,
    minDays: 1,
    included: [
      '2× 9000 Series Tom & Cymbal Stand w/DogBone — DWCP9999',
      '3000 Series 3-Leg Hi-Hat Stand — DWCP3500',
      '3000 Series Boom Cymbal Stand — DWCP3700',
      '3000 Series Snare Stand — DWCP3300',
    ],
    available: true,
    image: '/images/equipment/dw-hardware-set.jpg',
    featured: true,
  },
  {
    slug: 'pearl-boom-cymbal-stands-x4',
    name: 'Pearl Boom Cymbal Stands (×4)',
    brand: 'Pearl',
    category: 'drum-accessories',
    subcategory: 'Hardware & Spares',
    specs: { 'Model': 'BC-930 / BC-830' },
    pricePerDay: 275,
    minDays: 1,
    included: ['4× BC-930/BC-830 Boom Cymbal Stands'],
    available: false,
    image: '/images/equipment/pearl-boom-cymbal-stands-x4.jpg',
    featured: false,
  },
  {
    slug: 'pearl-hw-series-pack',
    name: 'Pearl HWP-934/HWP-930 Series Hardware Pack',
    brand: 'Pearl',
    category: 'drum-accessories',
    subcategory: 'Hardware & Spares',
    specs: { 'Model': 'HWP-934 / HWP-930' },
    pricePerDay: 2000,
    minDays: 1,
    included: ['1× HWP-934/HWP-930 Series Hardware Pack'],
    available: false,
    image: '/images/equipment/pearl-hw-series-pack.jpg',
    featured: false,
  },
  {
    slug: 'pearl-double-bass-pedal',
    name: 'Pearl Eliminator Redline Double Bass Pedal — P-2052C',
    brand: 'Pearl',
    category: 'drum-accessories',
    subcategory: 'Hardware & Spares',
    specs: { 'Type': 'Double bass drum pedal' },
    pricePerDay: 1500,
    minDays: 1,
    included: ['Eliminator Redline Double Bass Pedal P-2052C'],
    available: false,
    image: '/images/equipment/pearl-double-bass-pedal.png',
    featured: false,
  },
  {
    slug: 'pearl-drum-throne',
    name: 'Pearl Drum Throne — D-1500/D-3500',
    brand: 'Pearl',
    category: 'drum-accessories',
    subcategory: 'Hardware & Spares',
    specs: { 'Type': 'Drum throne' },
    pricePerDay: 600,
    minDays: 1,
    included: ['Drum Throne D-1500/D-3500'],
    available: false,
    image: '/images/equipment/pearl-drum-throne.jpg',
    featured: false,
  },
  {
    slug: 'dw-boom-cymbal-stand-x4',
    name: 'DW Boom Cymbal Stands (×4) — DWCP3700',
    brand: 'DW',
    category: 'drum-accessories',
    subcategory: 'Hardware & Spares',
    specs: { 'Model': 'DWCP3700' },
    pricePerDay: 300,
    minDays: 1,
    included: ['4× DWCP3700 Boom Cymbal Stand'],
    available: false,
    image: '/images/equipment/dw-boom-cymbal-stand-x4.jpg',
    featured: false,
  },
  {
    slug: 'dw-double-pedal',
    name: 'DW 5000 Series Double Pedal — DWCP5002AD4',
    brand: 'DW',
    category: 'drum-accessories',
    subcategory: 'Hardware & Spares',
    specs: { 'Type': 'Double bass drum pedal' },
    pricePerDay: 1650,
    minDays: 1,
    included: ['5000 Series Double Pedal — DWCP5002AD4'],
    available: false,
    image: '/images/equipment/dw-double-pedal.jpg',
    featured: false,
  },
  {
    slug: 'dw-tractor-throne',
    name: 'DW 5000 Series Tractor Top Throne — DWCP5120',
    brand: 'DW',
    category: 'drum-accessories',
    subcategory: 'Hardware & Spares',
    specs: { 'Type': 'Drum throne' },
    pricePerDay: 675,
    minDays: 1,
    included: ['5000 Series Tractor Top Throne — DWCP5120'],
    available: false,
    image: '/images/equipment/dw-tractor-throne.jpg',
    featured: false,
  },
  {
    slug: 'drum-shield-6pc',
    name: 'Drum Shield (5/6 Pc.)',
    brand: 'Generic',
    category: 'drum-accessories',
    subcategory: 'Drum Shield',
    specs: { 'Panels': '5–6 acrylic panels' },
    pricePerDay: 1350,
    minDays: 1,
    included: ['5–6 panel acoustic drum shield'],
    available: false,
    image: '/images/equipment/drum-shield-6pc.jpg',
    featured: false,
  },
  {
    slug: 'drum-rug',
    name: 'Drum Rug',
    brand: 'Generic',
    category: 'drum-accessories',
    subcategory: 'Drum Rug',
    specs: { 'Type': 'Carpet-style drum rug' },
    pricePerDay: 375,
    minDays: 1,
    included: ['Drum rug'],
    available: false,
    image: '/images/equipment/drum-rug.png',
    featured: false,
  },

  // ── Amplifiers & Cabinets — Guitar ──
  {
    slug: 'fender-65-twin-reverb-tonemaster',
    name: "Fender '65 Twin Reverb Combo Tone Master Amp",
    brand: 'Fender',
    category: 'amplifiers',
    subcategory: 'Guitar Amplifiers & Cabinets',
    specs: { 'Power': '200W', 'Type': 'Combo' },
    pricePerDay: 3500,
    minDays: 1,
    included: ['Power cable', 'Footswitch'],
    available: false,
    image: '/images/equipment/fender-65-twin-reverb-tonemaster.jpg',
    featured: true,
  },
  {
    slug: 'laney-ironheart-irt-sls-cabinet',
    name: 'Laney Ironheart IRT-SLS Head & GS412IA Cabinet',
    brand: 'Laney',
    category: 'amplifiers',
    subcategory: 'Guitar Amplifiers & Cabinets',
    specs: { 'Power': '300W', 'Type': 'Head + 4×12 cabinet' },
    pricePerDay: 4100,
    minDays: 1,
    included: ['Power cable', 'Speaker cable', 'Footswitch'],
    available: false,
    image: '/images/equipment/laney-ironheart-irt-sls-cabinet.jpg',
    featured: false,
  },

  // ── Amplifiers & Cabinets — Bass ──
  {
    slug: 'markbass-little-mark-tube-800',
    name: 'Markbass Little Mark Tube 800 Head & Standard 104HF Cabinet',
    brand: 'Markbass',
    category: 'amplifiers',
    subcategory: 'Bass Amplifiers & Cabinets',
    specs: { 'Power': '800W', 'Type': 'Head + 4×10 cabinet' },
    pricePerDay: 5300,
    minDays: 1,
    included: ['Power cable', 'Speaker cable'],
    available: false,
    image: '/images/equipment/markbass-little-mark-tube-800.jpg',
    featured: false,
  },
  {
    slug: 'hartke-lh1000-hydrive-hd410',
    name: 'Hartke LH1000 Head & HyDrive HD410 Cabinet',
    brand: 'Hartke',
    category: 'amplifiers',
    subcategory: 'Bass Amplifiers & Cabinets',
    specs: { 'Power': '1000W', 'Type': 'Head + 4×10 cabinet' },
    pricePerDay: 5500,
    minDays: 1,
    included: ['Power cable', 'Speaker cable'],
    available: false,
    image: '/images/equipment/hartke-lh1000-hydrive-hd410.jpg',
    featured: false,
  },

  // ── Amplifiers & Cabinets — Keyboard ──
  {
    slug: 'roland-kc600-keyboard-amp',
    name: 'Roland KC-600 Stereo Mixing Keyboard Amp (×2 available)',
    brand: 'Roland',
    category: 'amplifiers',
    subcategory: 'Keyboard Amplifiers & Cabinets',
    specs: { 'Power': '200W', 'Type': 'Stereo mixing keyboard amp' },
    pricePerDay: 3100,
    minDays: 1,
    included: ['Power cable', 'TRS cable'],
    available: false,
    image: '/images/equipment/roland-kc600-keyboard-amp.jpg',
    featured: false,
  },

  // ── Pianos & Keyboards ──
  {
    slug: 'nord-stage-4-88',
    name: 'Nord Stage 4 — 88-Keys',
    brand: 'Nord',
    category: 'keyboards',
    subcategory: 'Stage Piano',
    specs: { 'Keys': '88 fully weighted', 'Sections': 'Piano + Organ + Synth' },
    pricePerDay: 13300,
    minDays: 1,
    included: ['Power supply', 'Sustain pedal'],
    available: true,
    image: '/images/equipment/nord-stage-4-88.jpg',
    featured: true,
    relatedAccessorySlugs: ['km-spider-pro-stand'],
  },
  {
    slug: 'yamaha-montage-m6',
    name: 'Yamaha Montage M6 — 61-Keys',
    brand: 'Yamaha',
    category: 'keyboards',
    subcategory: 'Synthesizer',
    specs: { 'Keys': '61 semi-weighted' },
    pricePerDay: 8900,
    minDays: 1,
    included: ['Power supply', 'Sustain pedal'],
    available: true,
    image: '/images/equipment/yamaha-montage-m6.jpg',
    featured: false,
    relatedAccessorySlugs: ['km-spider-pro-stand'],
  },
  {
    slug: 'korg-kronos-3',
    name: 'Korg Kronos 3 — 61-Keys',
    brand: 'Korg',
    category: 'keyboards',
    subcategory: 'Synthesizer',
    specs: { 'Keys': '61 semi-weighted' },
    pricePerDay: 8800,
    minDays: 1,
    included: ['Power supply', 'Sustain pedal'],
    available: true,
    image: '/images/equipment/korg-kronos-3.jpg',
    featured: false,
    relatedAccessorySlugs: ['km-spider-pro-stand'],
  },
  {
    slug: 'novation-launchkey-61-mk4',
    name: 'Novation Launchkey 61 MK4 MIDI Controller',
    brand: 'Novation',
    category: 'keyboards',
    subcategory: 'MIDI Controller',
    specs: { 'Keys': '61' },
    pricePerDay: 1050,
    minDays: 1,
    included: ['USB cable'],
    available: false,
    image: '/images/equipment/novation-launchkey-61-mk4.png',
    featured: false,
  },
  {
    slug: 'roland-rd-700nx',
    name: 'Roland RD-700NX Stage Piano',
    brand: 'Roland',
    category: 'keyboards',
    subcategory: 'Stage Piano',
    specs: { 'Keys': '88 weighted' },
    pricePerDay: 6800,
    minDays: 1,
    included: ['Power cable', 'Sustain pedal'],
    available: true,
    image: '/images/equipment/roland-rd-700nx.jpg',
    featured: false,
    relatedAccessorySlugs: ['km-spider-pro-stand'],
  },
  {
    slug: 'korg-grandstage-x',
    name: 'Korg Grandstage-X Stage Piano',
    brand: 'Korg',
    category: 'keyboards',
    subcategory: 'Stage Piano',
    specs: { 'Keys': '88 weighted' },
    pricePerDay: 7400,
    minDays: 1,
    included: ['Power cable', 'Sustain pedal'],
    available: true,
    image: '/images/equipment/korg-grandstage-x.jpg',
    featured: false,
    relatedAccessorySlugs: ['km-spider-pro-stand'],
  },
  {
    slug: 'yamaha-clavinova-clp765gp',
    name: 'Yamaha Clavinova CLP-765GP — Black',
    brand: 'Yamaha',
    category: 'keyboards',
    subcategory: 'Digital Grand Piano',
    specs: { 'Finish': 'Black', 'Keys': '88 fully weighted with GrandTouch action' },
    pricePerDay: 16500,
    minDays: 1,
    included: ['Piano bench', 'Power cable'],
    available: true,
    image: '/images/equipment/yamaha-clavinova-clp765gp.jpg',
    featured: true,
    relatedAccessorySlugs: ['km-spider-pro-stand'],
  },
  {
    slug: 'yamaha-clavinova-clp865gp',
    name: 'Yamaha Clavinova CLP-865GP — White',
    brand: 'Yamaha',
    category: 'keyboards',
    subcategory: 'Digital Grand Piano',
    specs: { 'Finish': 'White', 'Keys': '88 fully weighted with GrandTouch action' },
    pricePerDay: 20250,
    minDays: 1,
    included: ['Piano bench', 'Power cable'],
    available: false,
    image: '/images/equipment/yamaha-clavinova-clp865gp.jpg',
    featured: true,
    relatedAccessorySlugs: ['km-spider-pro-stand'],
  },
  {
    slug: 'roland-gp9',
    name: 'Roland GP-9 — White',
    brand: 'Roland',
    category: 'keyboards',
    subcategory: 'Digital Grand Piano',
    specs: { 'Finish': 'White', 'Keys': '88 fully weighted' },
    pricePerDay: 36400,
    minDays: 1,
    included: ['Piano bench', 'Power cable'],
    available: true,
    image: '/images/equipment/roland-gp9.jpg',
    featured: true,
    relatedAccessorySlugs: ['km-spider-pro-stand'],
  },

  // ── Stage Accessories (Pianos & Keyboards) ──
  {
    slug: 'km-spider-pro-stand',
    name: 'K&M Spider Pro Dual Tier Keyboard Stand — Silver',
    brand: 'K&M',
    category: 'keyboards',
    subcategory: 'Stage Accessory',
    specs: { 'Tiers': 'Dual tier' },
    pricePerDay: 1200,
    minDays: 1,
    included: ['K&M Spider Pro dual-tier keyboard stand'],
    available: true,
    image: '/images/equipment/km-spider-pro-stand.jpg',
    featured: false,
  },
  {
    slug: 'notation-stand',
    name: 'Notation Stand',
    brand: 'Generic',
    category: 'keyboards',
    subcategory: 'Stage Accessory',
    specs: { 'Type': 'Sheet music stand' },
    pricePerDay: 50,
    minDays: 1,
    included: ['Notation stand'],
    available: true,
    image: '/images/equipment/notation-stand.jpg',
    featured: false,
  },
  {
    slug: 'x-stand-single-tier',
    name: 'Single Tier X-Stand',
    brand: 'Generic',
    category: 'keyboards',
    subcategory: 'Stage Accessory',
    specs: { 'Tiers': 'Single tier' },
    pricePerDay: 75,
    minDays: 1,
    included: ['Single tier X-stand'],
    available: true,
    image: '/images/equipment/x-stand-single-tier.jpg',
    featured: false,
  },
  {
    slug: 'guitar-stand',
    name: 'Guitar Stand',
    brand: 'Generic',
    category: 'keyboards',
    subcategory: 'Stage Accessory',
    specs: { 'Type': 'Single guitar stand' },
    pricePerDay: 50,
    minDays: 1,
    included: ['Guitar stand'],
    available: true,
    featured: false,
  },

  // ── Percussion ──
  {
    slug: 'lp-matador-conga-tumba-set',
    name: 'LP Matador Custom Series Quinto, Conga & Tumba Set — Vintage Sunburst',
    brand: 'LP',
    category: 'percussion',
    subcategory: 'Congas',
    specs: { 'Configuration': 'Quinto, conga & tumba with stands', 'Finish': 'Vintage Sunburst' },
    pricePerDay: 4750,
    minDays: 1,
    included: ['Quinto conga', 'Conga', 'Tumba (bass conga)', 'Conga stands ×3'],
    available: false,
    featured: false,
  },
  {
    slug: 'lp-matador-bongos',
    name: 'LP Matador Series Bongos — Blaze Red with Gold',
    brand: 'LP',
    category: 'percussion',
    subcategory: 'Bongos',
    specs: { 'Finish': 'Blaze Red with Gold hardware' },
    pricePerDay: 950,
    minDays: 1,
    included: ['Bongo pair'],
    available: false,
    featured: false,
  },
  {
    slug: 'lp-matador-timbales',
    name: 'LP Matador Series Steel Timbales',
    brand: 'LP',
    category: 'percussion',
    subcategory: 'Timbales',
    specs: { 'Material': 'Steel' },
    pricePerDay: 1950,
    minDays: 1,
    included: ['Steel timbale pair', 'Stand', 'Cowbell mount', 'Cowbell'],
    available: false,
    featured: false,
  },
  {
    slug: 'lp-matador-whiskey-barrel-cajon',
    name: 'LP Matador Series Whiskey Barrel Cajon — Large',
    brand: 'LP',
    category: 'percussion',
    subcategory: 'Cajon',
    specs: { 'Material': 'NZ Pine', 'Size': 'Large' },
    pricePerDay: 750,
    minDays: 1,
    included: ['Whiskey barrel cajon (large, NZ pine)'],
    available: true,
    featured: true,
  },
  {
    slug: 'remo-mondo-djembe-14',
    name: 'Remo Mondo Series Djembe — 14"',
    brand: 'Remo',
    category: 'percussion',
    subcategory: 'Djembe',
    specs: { 'Size': '14"' },
    pricePerDay: 1550,
    minDays: 1,
    included: ['14" Remo Mondo djembe'],
    available: false,
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
