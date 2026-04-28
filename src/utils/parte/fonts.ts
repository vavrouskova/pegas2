import { getFontById } from '@/data/parte-fonts';
import { ParteFontFamily, ParteTextStyle } from '@/types/parte';

const familyFallback = (family: ParteFontFamily): string => {
  if (family === 'serif') return 'Georgia, "Times New Roman", serif';
  if (family === 'script') return '"Brush Script MT", "Snell Roundhand", cursive';
  return 'latino-gothic-variable, Inter, Helvetica, Arial, sans-serif';
};

export const fontFamilyToCss = (family: ParteFontFamily): string => familyFallback(family);

export const resolveFontCss = (style: Pick<ParteTextStyle, 'fontFamily' | 'fontId'>): string => {
  if (style.fontId) {
    const font = getFontById(style.fontId);
    if (font) return font.cssFamily;
  }
  return familyFallback(style.fontFamily);
};
