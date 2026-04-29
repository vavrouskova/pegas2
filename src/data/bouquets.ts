export interface Bouquet {
  id: string;
  nameKey: string;
  descKey: string;
  price: number;
  image: string;
}

export const BOUQUETS: Bouquet[] = [
  {
    id: 'white-roses',
    nameKey: 'white-roses.name',
    descKey: 'white-roses.desc',
    price: 290,
    image: '/images/flowers.webp',
  },
  {
    id: 'pastel',
    nameKey: 'pastel.name',
    descKey: 'pastel.desc',
    price: 390,
    image: '/images/flowers.webp',
  },
  {
    id: 'white-lilies',
    nameKey: 'white-lilies.name',
    descKey: 'white-lilies.desc',
    price: 590,
    image: '/images/flowers.webp',
  },
  {
    id: 'hortenzie',
    nameKey: 'hortenzie.name',
    descKey: 'hortenzie.desc',
    price: 1290,
    image: '/images/flowers.webp',
  },
  {
    id: 'anturie',
    nameKey: 'anturie.name',
    descKey: 'anturie.desc',
    price: 3490,
    image: '/images/flowers.webp',
  },
];

export const RIBBON_COLORS = [
  { id: 'purple', hex: '#5B1F4D' },
  { id: 'cream', hex: '#F5EBD8' },
  { id: 'gray', hex: '#9A9A9A' },
  { id: 'black', hex: '#1F1F1F' },
] as const;

export type RibbonColorId = (typeof RIBBON_COLORS)[number]['id'];

export const RIBBON_PRESETS: Array<{ id: string; labelKey: string }> = [
  { id: 'none', labelKey: 'ribbon-text.none' },
  { id: 'love-family', labelKey: 'ribbon-text.love-family' },
  { id: 'never-forget', labelKey: 'ribbon-text.never-forget' },
  { id: 'custom', labelKey: 'ribbon-text.custom' },
];

export type RibbonPresetId = 'none' | 'love-family' | 'never-forget' | 'custom';
