import { ParteTemplateMeta } from '@/types/parte';

export const parteTemplateMeta: Record<string, ParteTemplateMeta> = {
  // Family A: Classical, no photo
  classic: { tags: ['classic'], hasPhoto: false, mood: 'light', accent: 'none', nameStyle: 'serif' },
  'classic-ornate': { tags: ['classic'], hasPhoto: false, mood: 'light', accent: 'none', nameStyle: 'serif' },
  'classic-cream': { tags: ['classic'], hasPhoto: false, mood: 'cream', accent: 'warm', nameStyle: 'serif' },
  'classic-thin': { tags: ['classic', 'minimal'], hasPhoto: false, mood: 'light', accent: 'subtle', nameStyle: 'serif' },
  'classic-italic': { tags: ['classic'], hasPhoto: false, mood: 'light', accent: 'none', nameStyle: 'italic' },
  'classic-no-border': { tags: ['classic', 'minimal'], hasPhoto: false, mood: 'light', accent: 'none', nameStyle: 'serif' },
  'classic-dark': { tags: ['classic'], hasPhoto: false, mood: 'dark', accent: 'warm', nameStyle: 'serif' },
  'classic-grey': { tags: ['classic'], hasPhoto: false, mood: 'grey', accent: 'none', nameStyle: 'serif' },
  'classic-sans': { tags: ['classic', 'modern'], hasPhoto: false, mood: 'light', accent: 'none', nameStyle: 'sans' },

  // Family B: Circle photo
  'with-photo': { tags: ['classic'], hasPhoto: true, mood: 'light', accent: 'warm', nameStyle: 'serif' },
  'photo-large-circle': { tags: ['classic'], hasPhoto: true, mood: 'light', accent: 'none', nameStyle: 'serif' },
  'photo-small-circle': { tags: ['classic'], hasPhoto: true, mood: 'light', accent: 'warm', nameStyle: 'serif' },
  'photo-circle-dark': { tags: ['classic'], hasPhoto: true, mood: 'dark', accent: 'warm', nameStyle: 'serif' },
  'photo-circle-cream': { tags: ['classic'], hasPhoto: true, mood: 'cream', accent: 'warm', nameStyle: 'serif' },
  'photo-circle-sans': { tags: ['modern'], hasPhoto: true, mood: 'light', accent: 'none', nameStyle: 'sans' },

  // Family C: Rectangle photo
  'photo-rectangle': { tags: ['classic'], hasPhoto: true, mood: 'light', accent: 'warm', nameStyle: 'serif' },
  'photo-rect-banner': { tags: ['modern'], hasPhoto: true, mood: 'light', accent: 'none', nameStyle: 'serif' },
  'photo-rect-small': { tags: ['classic'], hasPhoto: true, mood: 'light', accent: 'none', nameStyle: 'serif' },
  'photo-rect-dark': { tags: ['modern'], hasPhoto: true, mood: 'dark', accent: 'warm', nameStyle: 'serif' },

  // Family D: Photo side / bottom
  'photo-bottom': { tags: ['classic'], hasPhoto: true, mood: 'light', accent: 'none', nameStyle: 'serif' },
  'photo-side-left': { tags: ['modern'], hasPhoto: true, mood: 'light', accent: 'warm', nameStyle: 'serif' },
  'photo-side-right': { tags: ['modern'], hasPhoto: true, mood: 'light', accent: 'warm', nameStyle: 'serif' },

  // Family E: Minimalistic
  minimal: { tags: ['minimal'], hasPhoto: false, mood: 'cream', accent: 'none', nameStyle: 'sans' },
  'minimal-dark': { tags: ['minimal'], hasPhoto: false, mood: 'dark', accent: 'warm', nameStyle: 'sans' },
  'minimal-large-name': { tags: ['minimal', 'modern'], hasPhoto: false, mood: 'cream', accent: 'none', nameStyle: 'sans' },
  'minimal-italic': { tags: ['minimal'], hasPhoto: false, mood: 'light', accent: 'none', nameStyle: 'italic' },
  'minimal-centered': { tags: ['minimal'], hasPhoto: false, mood: 'light', accent: 'none', nameStyle: 'sans' },

  // Family F: Modern / accents
  'modern-plum': { tags: ['modern'], hasPhoto: false, mood: 'light', accent: 'plum', nameStyle: 'sans' },
  'modern-grey': { tags: ['modern'], hasPhoto: false, mood: 'grey', accent: 'none', nameStyle: 'sans' },
  'modern-warm': { tags: ['modern'], hasPhoto: false, mood: 'cream', accent: 'warm', nameStyle: 'sans' },
  'modern-script': { tags: ['modern'], hasPhoto: false, mood: 'light', accent: 'plum', nameStyle: 'script' },
  'modern-subtle': { tags: ['modern', 'minimal'], hasPhoto: false, mood: 'light', accent: 'subtle', nameStyle: 'sans' },
};

const FALLBACK_META: ParteTemplateMeta = {
  tags: ['classic'],
  hasPhoto: false,
  mood: 'light',
  accent: 'none',
  nameStyle: 'serif',
};

export const getTemplateMeta = (id: string): ParteTemplateMeta =>
  parteTemplateMeta[id] ?? FALLBACK_META;
