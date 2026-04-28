export interface ParteFontDefinition {
  id: string;
  name: string;
  cssFamily: string;
  category: 'serif' | 'sans' | 'script';
  sample: string;
}

export const parteFonts: ParteFontDefinition[] = [
  {
    id: 'garamond',
    name: 'Garamond (tradiční)',
    cssFamily: '"EB Garamond", Garamond, Georgia, "Times New Roman", serif',
    category: 'serif',
    sample: 'Rodina · Vzpomínáme',
  },
  {
    id: 'georgia',
    name: 'Georgia',
    cssFamily: 'Georgia, "Times New Roman", serif',
    category: 'serif',
    sample: 'Rodina · Vzpomínáme',
  },
  {
    id: 'playfair',
    name: 'Playfair (elegantní)',
    cssFamily: '"Playfair Display", Georgia, serif',
    category: 'serif',
    sample: 'Rodina · Vzpomínáme',
  },
  {
    id: 'times',
    name: 'Times New Roman',
    cssFamily: '"Times New Roman", Times, serif',
    category: 'serif',
    sample: 'Rodina · Vzpomínáme',
  },
  {
    id: 'latino-gothic',
    name: 'Latino Gothic (Pegas)',
    cssFamily: 'latino-gothic-variable, Inter, Helvetica, Arial, sans-serif',
    category: 'sans',
    sample: 'Rodina · Vzpomínáme',
  },
  {
    id: 'inter',
    name: 'Inter',
    cssFamily: 'Inter, Helvetica, Arial, sans-serif',
    category: 'sans',
    sample: 'Rodina · Vzpomínáme',
  },
  {
    id: 'helvetica',
    name: 'Helvetica',
    cssFamily: 'Helvetica, Arial, sans-serif',
    category: 'sans',
    sample: 'Rodina · Vzpomínáme',
  },
  {
    id: 'brush-script',
    name: 'Psací (ozdobné)',
    cssFamily: '"Brush Script MT", "Snell Roundhand", cursive',
    category: 'script',
    sample: 'Rodina · Vzpomínáme',
  },
];

export const getFontById = (id: string): ParteFontDefinition | undefined =>
  parteFonts.find((font) => font.id === id);
