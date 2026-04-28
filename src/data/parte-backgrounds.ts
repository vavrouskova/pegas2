export type ParteBackgroundCategory = 'solid' | 'gradient' | 'motif';

export interface ParteBackground {
  id: string;
  name: string;
  category: ParteBackgroundCategory;
  fill: string;
  solidFallback: string;
  preview: string;
}

const PRIMARY = 'oklch(0.3529 0.0868 326.35)';
const SECONDARY = 'oklch(0.489 0.0618 318.12)';
const TERTIARY = 'oklch(0.8109 0.0484 310.4)';
const WHITE_SMOKE = 'oklch(0.9682 0.0017 325.59)';
const GREY_WARM = 'oklch(0.9361 0.0034 325.6)';
const PLUM_LIGHT = 'oklch(0.95 0.02 320)';
const CREAM = '#fefcf7';

const gradientSvg = (color1: string, color2: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${color1}"/><stop offset="100%" stop-color="${color2}"/></linearGradient></defs><rect width="60" height="60" fill="url(#g)"/></svg>`
  )}`;

const solidSvg = (color: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"><rect width="60" height="60" fill="${color}"/></svg>`
  )}`;

const motifSvg = (color: string, accent: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"><rect width="60" height="60" fill="${color}"/><path d="M0 55 Q 30 20 60 55" stroke="${accent}" stroke-width="0.5" fill="none" opacity="0.35"/><path d="M0 45 Q 30 10 60 45" stroke="${accent}" stroke-width="0.5" fill="none" opacity="0.2"/></svg>`
  )}`;

export const parteBackgrounds: ParteBackground[] = [
  {
    id: 'bg-cream',
    name: 'Krémová',
    category: 'solid',
    fill: CREAM,
    solidFallback: CREAM,
    preview: solidSvg(CREAM),
  },
  {
    id: 'bg-white',
    name: 'Čistá bílá',
    category: 'solid',
    fill: '#ffffff',
    solidFallback: '#ffffff',
    preview: solidSvg('#ffffff'),
  },
  {
    id: 'bg-white-smoke',
    name: 'White Smoke',
    category: 'solid',
    fill: WHITE_SMOKE,
    solidFallback: WHITE_SMOKE,
    preview: solidSvg(WHITE_SMOKE),
  },
  {
    id: 'bg-grey-warm',
    name: 'Teplá šedá',
    category: 'solid',
    fill: GREY_WARM,
    solidFallback: GREY_WARM,
    preview: solidSvg(GREY_WARM),
  },
  {
    id: 'bg-plum-light',
    name: 'Světle slivková',
    category: 'solid',
    fill: PLUM_LIGHT,
    solidFallback: PLUM_LIGHT,
    preview: solidSvg(PLUM_LIGHT),
  },
  {
    id: 'bg-gradient-plum',
    name: 'Přechod – slivková',
    category: 'gradient',
    fill: `linear-gradient(135deg, ${WHITE_SMOKE}, ${TERTIARY})`,
    solidFallback: PLUM_LIGHT,
    preview: gradientSvg(WHITE_SMOKE, TERTIARY),
  },
  {
    id: 'bg-gradient-deep',
    name: 'Přechod – hluboká',
    category: 'gradient',
    fill: `linear-gradient(135deg, ${CREAM}, ${SECONDARY})`,
    solidFallback: CREAM,
    preview: gradientSvg(CREAM, SECONDARY),
  },
  {
    id: 'bg-motif-wave',
    name: 'Motiv – vlna',
    category: 'motif',
    fill: CREAM,
    solidFallback: CREAM,
    preview: motifSvg(CREAM, PRIMARY),
  },
  {
    id: 'bg-motif-grey',
    name: 'Motiv – šedá',
    category: 'motif',
    fill: GREY_WARM,
    solidFallback: GREY_WARM,
    preview: motifSvg(GREY_WARM, PRIMARY),
  },
];

export const parteBackgroundCategoryLabels: Record<ParteBackgroundCategory, string> = {
  solid: 'Barvy',
  gradient: 'Přechody',
  motif: 'Motivy',
};

export const getBackgroundById = (id: string): ParteBackground | undefined =>
  parteBackgrounds.find((bg) => bg.id === id);
