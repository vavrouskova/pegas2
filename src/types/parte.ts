export type ParteFontFamily = 'serif' | 'sans' | 'script';

export type ParteTextAlign = 'left' | 'center' | 'right';

export interface ParteTextStyle {
  fontFamily: ParteFontFamily;
  fontId?: string;
  fontSize: number;
  color: string;
  align: ParteTextAlign;
  fontStyle?: 'normal' | 'italic' | 'bold';
}

export interface ParteTextSlot {
  id: string;
  type: 'text';
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  defaultText: string;
  style: ParteTextStyle;
  multiline?: boolean;
}

export interface PartePhotoSlot {
  id: string;
  type: 'photo';
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  shape?: 'rectangle' | 'circle';
}

export type ParteSlot = ParteTextSlot | PartePhotoSlot;

export type ParteTag = 'classic' | 'minimal' | 'modern';
export type ParteMood = 'light' | 'cream' | 'grey' | 'dark';
export type ParteAccent = 'none' | 'subtle' | 'plum' | 'warm';
export type ParteNameStyle = 'serif' | 'sans' | 'script' | 'italic';

export interface ParteTemplateMeta {
  tags: ParteTag[];
  hasPhoto: boolean;
  mood: ParteMood;
  accent: ParteAccent;
  nameStyle: ParteNameStyle;
}

export type ParteGender = 'male' | 'female';

export type ParteFamilyRole =
  | 'father'
  | 'husband'
  | 'son'
  | 'grandfather'
  | 'brother'
  | 'uncle'
  | 'friend-male'
  | 'mother'
  | 'wife'
  | 'daughter'
  | 'grandmother'
  | 'sister'
  | 'aunt'
  | 'friend-female';

export type ParteCharacter = 'classic' | 'soft' | 'dark' | 'minimal' | 'modern';

export type ParteMotif = 'none' | 'garden' | 'architecture' | 'flowers' | 'cookbook';

export type ParteVerseChoice = 'religious' | 'secular' | 'custom' | 'none';

export type ParteCeremonyScope = 'public' | 'family' | 'private';

export interface ParteWizardAnswers {
  gender?: ParteGender;
  familyRoles: ParteFamilyRole[];
  firstName: string;
  lastName: string;
  birthDate: string;
  deathDate: string;
  hasPhoto: boolean;
  photoDataUrl?: string;
  character: ParteCharacter;
  motif: ParteMotif;
  verseChoice: ParteVerseChoice;
  verseId?: string;
  verseText?: string;
  ceremonyScope: ParteCeremonyScope;
  ceremonyPlace: string;
  ceremonyDate: string;
  ceremonyTime: string;
  signature: string;
}

export interface ParteTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
  background: {
    color: string;
    image?: string;
  };
  border?: {
    color: string;
    width: number;
    inset: number;
  };
  decoration?: {
    image: string;
    x: number;
    y: number;
    width: number;
    height: number;
  };
  width: number;
  height: number;
  slots: ParteSlot[];
}

export interface ParteOverlay {
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zoom?: number;
}

export interface ParteDraft {
  templateId: string;
  texts: Record<string, string>;
  photos: Record<string, string>;
  textStyles: Record<string, Partial<ParteTextStyle>>;
  backgroundId?: string;
  portraitOverlay?: ParteOverlay;
  crossOverlay?: ParteOverlay;
  version: 1;
}

export interface ParteLibraryPhoto {
  id: string;
  label: string;
  url: string;
  category: 'backgrounds' | 'symbols';
}
