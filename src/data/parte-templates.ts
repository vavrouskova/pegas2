import { ParteSlot, ParteTemplate, ParteTextSlot, ParteTextStyle } from '@/types/parte';

const A4_WIDTH = 420;
const A4_HEIGHT = 594;

const DEFAULT_INTRO = 'S hlubokým zármutkem oznamujeme,\nže nás navždy opustil(a)';
const DEFAULT_DATES = '* 12. března 1942    † 18. dubna 2026';
const DEFAULT_QUOTE = '„Kdo v srdcích žije, neumírá."';
const DEFAULT_FAREWELL =
  'Poslední rozloučení se zesnulým se uskuteční\nv pátek 25. dubna 2026 ve 14.00 hodin\nv obřadní síni v Pardubicích.';
const DEFAULT_SIGNATURE = 'S láskou vzpomíná rodina';

interface TextSlotOptions {
  x?: number;
  width?: number;
  multiline?: boolean;
}

const textSlot = (
  id: string,
  label: string,
  y: number,
  height: number,
  defaultText: string,
  style: ParteTextStyle,
  options: TextSlotOptions = {}
): ParteTextSlot => ({
  id,
  type: 'text',
  label,
  x: options.x ?? 50,
  y,
  width: options.width ?? 320,
  height,
  defaultText,
  style,
  multiline: options.multiline,
});

interface StandardSlotsInput {
  nameText: string;
  nameSize?: number;
  nameStyle?: 'normal' | 'italic' | 'bold';
  nameFamily?: ParteTextStyle['fontFamily'];
  nameColor?: string;
  bodyFamily: ParteTextStyle['fontFamily'];
  bodyColor: string;
  introText?: string;
  datesText?: string;
  quoteText?: string;
  farewellText?: string;
  signatureText?: string | null;
  topOffset?: number;
  compact?: boolean;
}

const buildStandardSlots = (input: StandardSlotsInput): ParteSlot[] => {
  const {
    nameText,
    nameSize = 32,
    nameStyle = 'bold',
    nameFamily,
    nameColor,
    bodyFamily,
    bodyColor,
    introText = DEFAULT_INTRO,
    datesText = DEFAULT_DATES,
    quoteText = DEFAULT_QUOTE,
    farewellText = DEFAULT_FAREWELL,
    signatureText = DEFAULT_SIGNATURE,
    topOffset = 0,
    compact = false,
  } = input;

  const introY = 60 + topOffset;
  const nameY = introY + (compact ? 60 : 70);
  const datesY = nameY + (compact ? 55 : 65);
  const quoteY = datesY + (compact ? 40 : 60);
  const farewellY = quoteY + (compact ? 70 : 95);
  const signatureY = farewellY + (compact ? 80 : 125);

  const slots: ParteSlot[] = [
    textSlot('introduction', 'Úvodní věta', introY, 48, introText, {
      fontFamily: bodyFamily,
      fontSize: 13,
      color: bodyColor,
      align: 'center',
      fontStyle: 'italic',
    }, { multiline: true }),
    textSlot('name', 'Jméno a příjmení', nameY, nameSize + 18, nameText, {
      fontFamily: nameFamily ?? bodyFamily,
      fontSize: nameSize,
      color: nameColor ?? bodyColor,
      align: 'center',
      fontStyle: nameStyle,
    }, { x: 40, width: A4_WIDTH - 80 }),
    textSlot('dates', 'Data narození a úmrtí', datesY, 28, datesText, {
      fontFamily: bodyFamily,
      fontSize: 15,
      color: bodyColor,
      align: 'center',
    }, { x: 40, width: A4_WIDTH - 80 }),
    textSlot('quote', 'Citát', quoteY, compact ? 55 : 70, quoteText, {
      fontFamily: bodyFamily,
      fontSize: 14,
      color: bodyColor,
      align: 'center',
      fontStyle: 'italic',
    }, { multiline: true }),
    textSlot('farewell', 'Rozloučení', farewellY, compact ? 95 : 110, farewellText, {
      fontFamily: bodyFamily,
      fontSize: 13,
      color: bodyColor,
      align: 'center',
    }, { multiline: true }),
  ];

  if (signatureText !== null) {
    slots.push(
      textSlot('signature', 'Podpis / rodina', signatureY, 35, signatureText, {
        fontFamily: bodyFamily,
        fontSize: 13,
        color: bodyColor,
        align: 'center',
        fontStyle: 'italic',
      }, { multiline: true })
    );
  }

  return slots;
};

const previewOf = (id: string) => `/images/parte/preview-${id}.svg`;

export const parteTemplates: ParteTemplate[] = [
  // ─── Family A: Classical centered, no photo ────────────────────────
  {
    id: 'classic',
    name: 'Klasická · I',
    description: 'Tradiční parte s vlysem a serifovým písmem.',
    preview: previewOf('classic'),
    width: A4_WIDTH,
    height: A4_HEIGHT,
    background: { color: '#fefcf7' },
    border: { color: '#1a1a1a', width: 2, inset: 24 },
    slots: [
      textSlot('introduction', 'Úvodní věta', 60, 48, DEFAULT_INTRO, {
        fontFamily: 'serif', fontSize: 13, color: '#2a2a2a', align: 'center', fontStyle: 'italic',
      }, { multiline: true }),
      textSlot('name', 'Jméno a příjmení', 135, 50, 'Jan Novák', {
        fontFamily: 'serif', fontSize: 32, color: '#111', align: 'center', fontStyle: 'bold',
      }, { x: 40, width: 340 }),
      textSlot('dates', 'Data narození a úmrtí', 200, 28, DEFAULT_DATES, {
        fontFamily: 'serif', fontSize: 16, color: '#2a2a2a', align: 'center',
      }, { x: 60, width: 300 }),
      textSlot('quote', 'Citát', 260, 80, DEFAULT_QUOTE, {
        fontFamily: 'serif', fontSize: 15, color: '#3a3a3a', align: 'center', fontStyle: 'italic',
      }, { multiline: true }),
      textSlot('farewell', 'Rozloučení', 360, 120, DEFAULT_FAREWELL, {
        fontFamily: 'serif', fontSize: 14, color: '#2a2a2a', align: 'center',
      }, { multiline: true }),
      textSlot('signature', 'Podpis / rodina', 510, 40, DEFAULT_SIGNATURE, {
        fontFamily: 'serif', fontSize: 13, color: '#2a2a2a', align: 'center', fontStyle: 'italic',
      }, { multiline: true }),
    ],
  },
  {
    id: 'classic-ornate',
    name: 'Klasická · II',
    description: 'Silnější dvojitý rámeček a důstojné serifové písmo.',
    preview: previewOf('classic-ornate'),
    width: A4_WIDTH, height: A4_HEIGHT,
    background: { color: '#fefcf7' },
    border: { color: '#1a1a1a', width: 3.5, inset: 18 },
    slots: buildStandardSlots({
      nameText: 'Karel Procházka',
      nameSize: 30,
      bodyFamily: 'serif',
      bodyColor: '#1a1a1a',
    }),
  },
  {
    id: 'classic-cream',
    name: 'Klasická · III',
    description: 'Teplé krémové pozadí s tenkým rámečkem.',
    preview: previewOf('classic-cream'),
    width: A4_WIDTH, height: A4_HEIGHT,
    background: { color: '#f7f1e5' },
    border: { color: '#6b4a2b', width: 1, inset: 26 },
    slots: buildStandardSlots({
      nameText: 'Marie Svobodová',
      nameSize: 30,
      bodyFamily: 'serif',
      bodyColor: '#3a2a1e',
    }),
  },
  {
    id: 'classic-thin',
    name: 'Klasická · IV',
    description: 'Subtilní tenká linka, čisté provedení.',
    preview: previewOf('classic-thin'),
    width: A4_WIDTH, height: A4_HEIGHT,
    background: { color: '#ffffff' },
    border: { color: '#8a8a8a', width: 0.5, inset: 30 },
    slots: buildStandardSlots({
      nameText: 'Josef Dvořák',
      nameSize: 30,
      bodyFamily: 'serif',
      bodyColor: '#2a2a2a',
    }),
  },
  {
    id: 'classic-italic',
    name: 'Klasická · V',
    description: 'Jméno vysazené elegantní kurzívou.',
    preview: previewOf('classic-italic'),
    width: A4_WIDTH, height: A4_HEIGHT,
    background: { color: '#fefcf7' },
    border: { color: '#1a1a1a', width: 1.5, inset: 24 },
    slots: buildStandardSlots({
      nameText: 'Anna Procházková',
      nameSize: 34,
      nameStyle: 'italic',
      bodyFamily: 'serif',
      bodyColor: '#2a2a2a',
    }),
  },
  {
    id: 'classic-no-border',
    name: 'Klasická · VI',
    description: 'Jednoduchá klasika bez zdobení.',
    preview: previewOf('classic-no-border'),
    width: A4_WIDTH, height: A4_HEIGHT,
    background: { color: '#fefcf7' },
    slots: buildStandardSlots({
      nameText: 'Petr Horák',
      nameSize: 32,
      bodyFamily: 'serif',
      bodyColor: '#1a1a1a',
    }),
  },
  {
    id: 'classic-dark',
    name: 'Klasická · VII',
    description: 'Tmavé pozadí se světlým serifovým písmem.',
    preview: previewOf('classic-dark'),
    width: A4_WIDTH, height: A4_HEIGHT,
    background: { color: '#1d1a22' },
    border: { color: '#c8b68a', width: 1, inset: 22 },
    slots: buildStandardSlots({
      nameText: 'Miroslav Toman',
      nameSize: 32,
      bodyFamily: 'serif',
      bodyColor: '#e8e2d5',
      nameColor: '#f5ecd7',
    }),
  },
  {
    id: 'classic-grey',
    name: 'Klasická · VIII',
    description: 'Decentní šedé pozadí s tenkým kontrastním rámem.',
    preview: previewOf('classic-grey'),
    width: A4_WIDTH, height: A4_HEIGHT,
    background: { color: '#eeece8' },
    border: { color: '#4a4a4a', width: 1, inset: 24 },
    slots: buildStandardSlots({
      nameText: 'Václav Beneš',
      nameSize: 30,
      bodyFamily: 'serif',
      bodyColor: '#2a2a2a',
    }),
  },
  {
    id: 'classic-sans',
    name: 'Klasická · IX',
    description: 'Klasická kompozice s moderním bezpatkovým písmem.',
    preview: previewOf('classic-sans'),
    width: A4_WIDTH, height: A4_HEIGHT,
    background: { color: '#fefcf7' },
    border: { color: '#1a1a1a', width: 1.5, inset: 24 },
    slots: buildStandardSlots({
      nameText: 'Eliška Hrušková',
      nameSize: 32,
      bodyFamily: 'sans',
      bodyColor: '#1a1a1a',
    }),
  },

  // ─── Family B: With circle photo ─────────────────────────────────
  {
    id: 'with-photo',
    name: 'Fotografie · I',
    description: 'Elegantní parte s kruhovou fotografií v horní části.',
    preview: previewOf('with-photo'),
    width: A4_WIDTH, height: A4_HEIGHT,
    background: { color: '#ffffff' },
    border: { color: '#8a7c6a', width: 1, inset: 20 },
    slots: [
      { id: 'photo', type: 'photo', label: 'Fotografie', x: 160, y: 50, width: 100, height: 100, shape: 'circle' },
      textSlot('introduction', 'Úvodní věta', 170, 48, 'S hlubokou bolestí oznamujeme,\nže nás opustil(a)', {
        fontFamily: 'serif', fontSize: 13, color: '#3a3a3a', align: 'center', fontStyle: 'italic',
      }, { multiline: true }),
      textSlot('name', 'Jméno a příjmení', 215, 45, 'Marie Svobodová', {
        fontFamily: 'serif', fontSize: 28, color: '#111', align: 'center', fontStyle: 'bold',
      }, { x: 40, width: 340 }),
      textSlot('dates', 'Data', 275, 26, '* 3. června 1938    † 14. dubna 2026', {
        fontFamily: 'serif', fontSize: 15, color: '#2a2a2a', align: 'center',
      }, { x: 60, width: 300 }),
      textSlot('quote', 'Citát', 325, 60, '„Tichá vzpomínka je ten nejkrásnější dar."', {
        fontFamily: 'serif', fontSize: 14, color: '#3a3a3a', align: 'center', fontStyle: 'italic',
      }, { multiline: true }),
      textSlot('farewell', 'Rozloučení', 400, 100,
        'Poslední rozloučení se uskuteční\nv sobotu 26. dubna 2026 v 11.00 hodin\nv obřadní síni krematoria v Pardubicích.', {
        fontFamily: 'serif', fontSize: 13, color: '#2a2a2a', align: 'center',
      }, { multiline: true }),
      textSlot('signature', 'Podpis', 520, 35, 'Zarmoucená rodina', {
        fontFamily: 'serif', fontSize: 13, color: '#2a2a2a', align: 'center', fontStyle: 'italic',
      }, { multiline: true }),
    ],
  },
  {
    id: 'photo-large-circle',
    name: 'Fotografie · II',
    description: 'Výraznější fotografie, text níže.',
    preview: previewOf('photo-large-circle'),
    width: A4_WIDTH, height: A4_HEIGHT,
    background: { color: '#fefcf7' },
    border: { color: '#1a1a1a', width: 1, inset: 20 },
    slots: [
      { id: 'photo', type: 'photo', label: 'Fotografie', x: 140, y: 50, width: 140, height: 140, shape: 'circle' },
      ...buildStandardSlots({
        nameText: 'Božena Kratochvílová',
        nameSize: 26,
        bodyFamily: 'serif',
        bodyColor: '#2a2a2a',
        topOffset: 150,
        compact: true,
        signatureText: null,
      }),
    ],
  },
  {
    id: 'photo-small-circle',
    name: 'Fotografie · III',
    description: 'Nenápadná kruhová fotografie.',
    preview: previewOf('photo-small-circle'),
    width: A4_WIDTH, height: A4_HEIGHT,
    background: { color: '#ffffff' },
    border: { color: '#8a7c6a', width: 1, inset: 22 },
    slots: [
      { id: 'photo', type: 'photo', label: 'Fotografie', x: 180, y: 48, width: 60, height: 60, shape: 'circle' },
      ...buildStandardSlots({
        nameText: 'Jiřina Čermáková',
        nameSize: 28,
        bodyFamily: 'serif',
        bodyColor: '#2a2a2a',
        topOffset: 70,
      }),
    ],
  },
  {
    id: 'photo-circle-dark',
    name: 'Fotografie · IV',
    description: 'Tmavé pozadí, kruhová fotografie nahoře.',
    preview: previewOf('photo-circle-dark'),
    width: A4_WIDTH, height: A4_HEIGHT,
    background: { color: '#1d1a22' },
    border: { color: '#c8b68a', width: 1, inset: 20 },
    slots: [
      { id: 'photo', type: 'photo', label: 'Fotografie', x: 160, y: 50, width: 100, height: 100, shape: 'circle' },
      ...buildStandardSlots({
        nameText: 'Alois Krejčí',
        nameSize: 28,
        bodyFamily: 'serif',
        bodyColor: '#e8e2d5',
        nameColor: '#f5ecd7',
        topOffset: 110,
        compact: true,
      }),
    ],
  },
  {
    id: 'photo-circle-cream',
    name: 'Fotografie · V',
    description: 'Krémové pozadí s kruhovou fotografií.',
    preview: previewOf('photo-circle-cream'),
    width: A4_WIDTH, height: A4_HEIGHT,
    background: { color: '#f7f1e5' },
    border: { color: '#6b4a2b', width: 1, inset: 22 },
    slots: [
      { id: 'photo', type: 'photo', label: 'Fotografie', x: 160, y: 50, width: 100, height: 100, shape: 'circle' },
      ...buildStandardSlots({
        nameText: 'Libuše Malá',
        nameSize: 28,
        bodyFamily: 'serif',
        bodyColor: '#3a2a1e',
        topOffset: 110,
      }),
    ],
  },
  {
    id: 'photo-circle-sans',
    name: 'Fotografie · VI',
    description: 'Kruhová fotografie s bezpatkovým textem.',
    preview: previewOf('photo-circle-sans'),
    width: A4_WIDTH, height: A4_HEIGHT,
    background: { color: '#ffffff' },
    slots: [
      { id: 'photo', type: 'photo', label: 'Fotografie', x: 160, y: 50, width: 100, height: 100, shape: 'circle' },
      ...buildStandardSlots({
        nameText: 'Tomáš Vávra',
        nameSize: 28,
        bodyFamily: 'sans',
        bodyColor: '#1a1a1a',
        topOffset: 110,
      }),
    ],
  },

  // ─── Family C: Rectangle photo ────────────────────────────────────
  {
    id: 'photo-rectangle',
    name: 'Fotografie · VII',
    description: 'Fotografie v obdélníkovém rámu nahoře.',
    preview: previewOf('photo-rectangle'),
    width: A4_WIDTH, height: A4_HEIGHT,
    background: { color: '#ffffff' },
    border: { color: '#8a7c6a', width: 1, inset: 20 },
    slots: [
      { id: 'photo', type: 'photo', label: 'Fotografie', x: 140, y: 45, width: 140, height: 165, shape: 'rectangle' },
      ...buildStandardSlots({
        nameText: 'Helena Nováková',
        nameSize: 26,
        bodyFamily: 'serif',
        bodyColor: '#2a2a2a',
        topOffset: 170,
        compact: true,
        signatureText: null,
      }),
    ],
  },
  {
    id: 'photo-rect-banner',
    name: 'Fotografie · VIII',
    description: 'Fotografie přes celou šířku jako hlavička.',
    preview: previewOf('photo-rect-banner'),
    width: A4_WIDTH, height: A4_HEIGHT,
    background: { color: '#fefcf7' },
    slots: [
      { id: 'photo', type: 'photo', label: 'Fotografie', x: 0, y: 0, width: A4_WIDTH, height: 200, shape: 'rectangle' },
      ...buildStandardSlots({
        nameText: 'Oldřich Baran',
        nameSize: 28,
        bodyFamily: 'serif',
        bodyColor: '#1a1a1a',
        topOffset: 160,
        compact: true,
      }),
    ],
  },
  {
    id: 'photo-rect-small',
    name: 'Fotografie · IX',
    description: 'Obdélníková fotografie menšího formátu.',
    preview: previewOf('photo-rect-small'),
    width: A4_WIDTH, height: A4_HEIGHT,
    background: { color: '#fefcf7' },
    border: { color: '#1a1a1a', width: 1, inset: 22 },
    slots: [
      { id: 'photo', type: 'photo', label: 'Fotografie', x: 160, y: 45, width: 100, height: 130, shape: 'rectangle' },
      ...buildStandardSlots({
        nameText: 'Zdeněk Průša',
        nameSize: 26,
        bodyFamily: 'serif',
        bodyColor: '#2a2a2a',
        topOffset: 130,
        compact: true,
      }),
    ],
  },
  {
    id: 'photo-rect-dark',
    name: 'Fotografie · X',
    description: 'Obdélníková fotografie na tmavém pozadí.',
    preview: previewOf('photo-rect-dark'),
    width: A4_WIDTH, height: A4_HEIGHT,
    background: { color: '#1d1a22' },
    slots: [
      { id: 'photo', type: 'photo', label: 'Fotografie', x: 0, y: 0, width: A4_WIDTH, height: 220, shape: 'rectangle' },
      ...buildStandardSlots({
        nameText: 'Ludmila Sedláková',
        nameSize: 28,
        bodyFamily: 'serif',
        bodyColor: '#e8e2d5',
        nameColor: '#f5ecd7',
        topOffset: 180,
        compact: true,
      }),
    ],
  },

  // ─── Family D: Photo side / bottom ────────────────────────────────
  {
    id: 'photo-bottom',
    name: 'Fotografie · XI',
    description: 'Text nahoře, fotografie pod ním.',
    preview: previewOf('photo-bottom'),
    width: A4_WIDTH, height: A4_HEIGHT,
    background: { color: '#fefcf7' },
    border: { color: '#1a1a1a', width: 1, inset: 22 },
    slots: [
      textSlot('introduction', 'Úvodní věta', 50, 40, DEFAULT_INTRO, {
        fontFamily: 'serif', fontSize: 12, color: '#2a2a2a', align: 'center', fontStyle: 'italic',
      }, { multiline: true }),
      textSlot('name', 'Jméno a příjmení', 105, 46, 'František Pospíšil', {
        fontFamily: 'serif', fontSize: 28, color: '#111', align: 'center', fontStyle: 'bold',
      }, { x: 40, width: 340 }),
      textSlot('dates', 'Data', 160, 24, DEFAULT_DATES, {
        fontFamily: 'serif', fontSize: 14, color: '#2a2a2a', align: 'center',
      }, { x: 60, width: 300 }),
      textSlot('quote', 'Citát', 200, 60, DEFAULT_QUOTE, {
        fontFamily: 'serif', fontSize: 13, color: '#3a3a3a', align: 'center', fontStyle: 'italic',
      }, { multiline: true }),
      textSlot('farewell', 'Rozloučení', 275, 80, DEFAULT_FAREWELL, {
        fontFamily: 'serif', fontSize: 12, color: '#2a2a2a', align: 'center',
      }, { multiline: true }),
      { id: 'photo', type: 'photo', label: 'Fotografie', x: 160, y: 390, width: 100, height: 100, shape: 'circle' },
      textSlot('signature', 'Podpis', 510, 35, DEFAULT_SIGNATURE, {
        fontFamily: 'serif', fontSize: 12, color: '#2a2a2a', align: 'center', fontStyle: 'italic',
      }, { multiline: true }),
    ],
  },
  {
    id: 'photo-side-left',
    name: 'Fotografie · XII',
    description: 'Fotografie při levém okraji, text vpravo.',
    preview: previewOf('photo-side-left'),
    width: A4_WIDTH, height: A4_HEIGHT,
    background: { color: '#ffffff' },
    border: { color: '#8a7c6a', width: 1, inset: 20 },
    slots: [
      { id: 'photo', type: 'photo', label: 'Fotografie', x: 40, y: 50, width: 130, height: 160, shape: 'rectangle' },
      textSlot('introduction', 'Úvodní věta', 55, 36, DEFAULT_INTRO, {
        fontFamily: 'serif', fontSize: 11, color: '#2a2a2a', align: 'left', fontStyle: 'italic',
      }, { x: 190, width: 200, multiline: true }),
      textSlot('name', 'Jméno a příjmení', 100, 50, 'Růžena Dlouhá', {
        fontFamily: 'serif', fontSize: 22, color: '#111', align: 'left', fontStyle: 'bold',
      }, { x: 190, width: 200 }),
      textSlot('dates', 'Data', 160, 22, DEFAULT_DATES, {
        fontFamily: 'serif', fontSize: 12, color: '#2a2a2a', align: 'left',
      }, { x: 190, width: 200 }),
      textSlot('quote', 'Citát', 240, 60, DEFAULT_QUOTE, {
        fontFamily: 'serif', fontSize: 13, color: '#3a3a3a', align: 'center', fontStyle: 'italic',
      }, { multiline: true }),
      textSlot('farewell', 'Rozloučení', 330, 100, DEFAULT_FAREWELL, {
        fontFamily: 'serif', fontSize: 12, color: '#2a2a2a', align: 'center',
      }, { multiline: true }),
      textSlot('signature', 'Podpis', 460, 35, DEFAULT_SIGNATURE, {
        fontFamily: 'serif', fontSize: 12, color: '#2a2a2a', align: 'center', fontStyle: 'italic',
      }, { multiline: true }),
    ],
  },
  {
    id: 'photo-side-right',
    name: 'Fotografie · XIII',
    description: 'Text při levé straně, fotografie vpravo.',
    preview: previewOf('photo-side-right'),
    width: A4_WIDTH, height: A4_HEIGHT,
    background: { color: '#ffffff' },
    border: { color: '#8a7c6a', width: 1, inset: 20 },
    slots: [
      { id: 'photo', type: 'photo', label: 'Fotografie', x: 250, y: 50, width: 130, height: 160, shape: 'rectangle' },
      textSlot('introduction', 'Úvodní věta', 55, 36, DEFAULT_INTRO, {
        fontFamily: 'serif', fontSize: 11, color: '#2a2a2a', align: 'left', fontStyle: 'italic',
      }, { x: 40, width: 200, multiline: true }),
      textSlot('name', 'Jméno a příjmení', 100, 50, 'Radek Jelínek', {
        fontFamily: 'serif', fontSize: 22, color: '#111', align: 'left', fontStyle: 'bold',
      }, { x: 40, width: 200 }),
      textSlot('dates', 'Data', 160, 22, DEFAULT_DATES, {
        fontFamily: 'serif', fontSize: 12, color: '#2a2a2a', align: 'left',
      }, { x: 40, width: 200 }),
      textSlot('quote', 'Citát', 240, 60, DEFAULT_QUOTE, {
        fontFamily: 'serif', fontSize: 13, color: '#3a3a3a', align: 'center', fontStyle: 'italic',
      }, { multiline: true }),
      textSlot('farewell', 'Rozloučení', 330, 100, DEFAULT_FAREWELL, {
        fontFamily: 'serif', fontSize: 12, color: '#2a2a2a', align: 'center',
      }, { multiline: true }),
      textSlot('signature', 'Podpis', 460, 35, DEFAULT_SIGNATURE, {
        fontFamily: 'serif', fontSize: 12, color: '#2a2a2a', align: 'center', fontStyle: 'italic',
      }, { multiline: true }),
    ],
  },

  // ─── Family E: Minimalistic ───────────────────────────────────────
  {
    id: 'minimal',
    name: 'Minimalistické',
    description: 'Čistý a moderní design bez zdobení.',
    preview: previewOf('minimal'),
    width: A4_WIDTH, height: A4_HEIGHT,
    background: { color: '#f5f2ec' },
    slots: [
      textSlot('introduction', 'Úvodní věta', 130, 26, 'opustil nás', {
        fontFamily: 'sans', fontSize: 13, color: '#6a6a6a', align: 'center',
      }),
      textSlot('name', 'Jméno a příjmení', 170, 60, 'Josef Dvořák', {
        fontFamily: 'sans', fontSize: 34, color: '#111', align: 'center', fontStyle: 'bold',
      }, { x: 40, width: 340 }),
      textSlot('dates', 'Data', 250, 26, '1945 — 2026', {
        fontFamily: 'sans', fontSize: 18, color: '#111', align: 'center',
      }, { x: 60, width: 300 }),
      textSlot('quote', 'Citát', 320, 60, '„Život je to, co se děje, když jsme zaneprázdněni jinými plány."', {
        fontFamily: 'sans', fontSize: 13, color: '#4a4a4a', align: 'center', fontStyle: 'italic',
      }, { multiline: true }),
      textSlot('farewell', 'Rozloučení', 420, 100,
        'Rozloučení proběhne v úzkém rodinném kruhu.\nDěkujeme za tichou vzpomínku.', {
        fontFamily: 'sans', fontSize: 13, color: '#3a3a3a', align: 'center',
      }, { multiline: true }),
    ],
  },
  {
    id: 'minimal-dark',
    name: 'Minimalistické tmavé',
    description: 'Minimalismus na tmavém pozadí.',
    preview: previewOf('minimal-dark'),
    width: A4_WIDTH, height: A4_HEIGHT,
    background: { color: '#1d1a22' },
    slots: [
      textSlot('introduction', 'Úvodní věta', 130, 26, 'opustil nás', {
        fontFamily: 'sans', fontSize: 13, color: '#a89ab3', align: 'center',
      }),
      textSlot('name', 'Jméno a příjmení', 170, 60, 'Ondřej Kovář', {
        fontFamily: 'sans', fontSize: 34, color: '#f5ecd7', align: 'center', fontStyle: 'bold',
      }, { x: 40, width: 340 }),
      textSlot('dates', 'Data', 250, 26, '1945 — 2026', {
        fontFamily: 'sans', fontSize: 18, color: '#e8e2d5', align: 'center',
      }, { x: 60, width: 300 }),
      textSlot('quote', 'Citát', 320, 60, '„Tichá vzpomínka je ten nejkrásnější dar."', {
        fontFamily: 'sans', fontSize: 13, color: '#c8b68a', align: 'center', fontStyle: 'italic',
      }, { multiline: true }),
      textSlot('farewell', 'Rozloučení', 420, 100,
        'Rozloučení proběhne v úzkém rodinném kruhu.\nDěkujeme za tichou vzpomínku.', {
        fontFamily: 'sans', fontSize: 13, color: '#d8d0c0', align: 'center',
      }, { multiline: true }),
    ],
  },
  {
    id: 'minimal-large-name',
    name: 'Dominantní jméno',
    description: 'Velké jméno přes půl stránky.',
    preview: previewOf('minimal-large-name'),
    width: A4_WIDTH, height: A4_HEIGHT,
    background: { color: '#f5f2ec' },
    slots: [
      textSlot('introduction', 'Úvodní věta', 100, 24, 'S láskou vzpomíná rodina na', {
        fontFamily: 'sans', fontSize: 12, color: '#6a6a6a', align: 'center',
      }),
      textSlot('name', 'Jméno a příjmení', 150, 100, 'Blanka\nSvobodová', {
        fontFamily: 'sans', fontSize: 42, color: '#111', align: 'center', fontStyle: 'bold',
      }, { x: 20, width: A4_WIDTH - 40 }),
      textSlot('dates', 'Data', 290, 26, '1940 — 2026', {
        fontFamily: 'sans', fontSize: 20, color: '#111', align: 'center',
      }, { x: 60, width: 300 }),
      textSlot('quote', 'Citát', 360, 60, DEFAULT_QUOTE, {
        fontFamily: 'sans', fontSize: 13, color: '#4a4a4a', align: 'center', fontStyle: 'italic',
      }, { multiline: true }),
      textSlot('farewell', 'Rozloučení', 440, 100, DEFAULT_FAREWELL, {
        fontFamily: 'sans', fontSize: 12, color: '#3a3a3a', align: 'center',
      }, { multiline: true }),
    ],
  },
  {
    id: 'minimal-italic',
    name: 'Minimalistické s kurzívou',
    description: 'Kurzívní detaily a decentní pauzy.',
    preview: previewOf('minimal-italic'),
    width: A4_WIDTH, height: A4_HEIGHT,
    background: { color: '#fefcf7' },
    slots: [
      textSlot('introduction', 'Úvodní věta', 130, 30, 'navždy odešel', {
        fontFamily: 'serif', fontSize: 14, color: '#8a8070', align: 'center', fontStyle: 'italic',
      }),
      textSlot('name', 'Jméno a příjmení', 175, 56, 'Jaromír Holub', {
        fontFamily: 'serif', fontSize: 30, color: '#1a1a1a', align: 'center',
      }, { x: 40, width: 340 }),
      textSlot('dates', 'Data', 250, 26, '13. 4. 1951 — 18. 4. 2026', {
        fontFamily: 'serif', fontSize: 14, color: '#2a2a2a', align: 'center',
      }, { x: 60, width: 300 }),
      textSlot('quote', 'Citát', 320, 70, DEFAULT_QUOTE, {
        fontFamily: 'serif', fontSize: 14, color: '#3a3a3a', align: 'center', fontStyle: 'italic',
      }, { multiline: true }),
      textSlot('farewell', 'Rozloučení', 420, 100, DEFAULT_FAREWELL, {
        fontFamily: 'serif', fontSize: 12, color: '#2a2a2a', align: 'center',
      }, { multiline: true }),
    ],
  },
  {
    id: 'minimal-centered',
    name: 'Minimalistické – centrované',
    description: 'Strohé centrované uspořádání bez pozadí.',
    preview: previewOf('minimal-centered'),
    width: A4_WIDTH, height: A4_HEIGHT,
    background: { color: '#ffffff' },
    slots: [
      textSlot('name', 'Jméno a příjmení', 220, 60, 'Věra Krásná', {
        fontFamily: 'sans', fontSize: 36, color: '#111', align: 'center', fontStyle: 'bold',
      }, { x: 40, width: 340 }),
      textSlot('dates', 'Data', 295, 26, '1942  —  2026', {
        fontFamily: 'sans', fontSize: 16, color: '#6a6a6a', align: 'center',
      }, { x: 60, width: 300 }),
      textSlot('quote', 'Citát', 340, 60, DEFAULT_QUOTE, {
        fontFamily: 'sans', fontSize: 13, color: '#4a4a4a', align: 'center', fontStyle: 'italic',
      }, { multiline: true }),
      textSlot('farewell', 'Rozloučení', 420, 100, DEFAULT_FAREWELL, {
        fontFamily: 'sans', fontSize: 12, color: '#3a3a3a', align: 'center',
      }, { multiline: true }),
    ],
  },

  // ─── Family F: Modern / color accents ─────────────────────────────
  {
    id: 'modern-plum',
    name: 'Slivková',
    description: 'Jemný slivkový akcent, moderní typografie.',
    preview: previewOf('modern-plum'),
    width: A4_WIDTH, height: A4_HEIGHT,
    background: { color: '#f2ecf0' },
    border: { color: '#5b3280', width: 0.8, inset: 22 },
    slots: buildStandardSlots({
      nameText: 'Ivana Beránková',
      nameSize: 30,
      bodyFamily: 'sans',
      bodyColor: '#3a2640',
      nameColor: '#5b3280',
    }),
  },
  {
    id: 'modern-grey',
    name: 'Moderní šedá',
    description: 'Chladná šedá paleta, sans-serif.',
    preview: previewOf('modern-grey'),
    width: A4_WIDTH, height: A4_HEIGHT,
    background: { color: '#ededeb' },
    slots: buildStandardSlots({
      nameText: 'Jakub Fiala',
      nameSize: 32,
      bodyFamily: 'sans',
      bodyColor: '#2a2a2a',
      nameColor: '#111',
    }),
  },
  {
    id: 'modern-warm',
    name: 'Teplé moderní',
    description: 'Teplé pískové pozadí, sans-serif.',
    preview: previewOf('modern-warm'),
    width: A4_WIDTH, height: A4_HEIGHT,
    background: { color: '#f4ede3' },
    border: { color: '#a07a4a', width: 0.8, inset: 26 },
    slots: buildStandardSlots({
      nameText: 'Kateřina Matušková',
      nameSize: 30,
      bodyFamily: 'sans',
      bodyColor: '#3a2a1e',
      nameColor: '#6b4a2b',
    }),
  },
  {
    id: 'modern-script',
    name: 'Psací jméno',
    description: 'Jméno vysazené ozdobným psacím písmem.',
    preview: previewOf('modern-script'),
    width: A4_WIDTH, height: A4_HEIGHT,
    background: { color: '#fefcf7' },
    border: { color: '#5b3280', width: 0.6, inset: 22 },
    slots: buildStandardSlots({
      nameText: 'Štěpán Dvořáček',
      nameSize: 42,
      nameStyle: 'italic',
      nameFamily: 'script',
      bodyFamily: 'serif',
      bodyColor: '#2a2a2a',
      nameColor: '#5b3280',
    }),
  },
  {
    id: 'modern-subtle',
    name: 'Subtilní moderní',
    description: 'Tenké linky, světlé barvy, vzdušná kompozice.',
    preview: previewOf('modern-subtle'),
    width: A4_WIDTH, height: A4_HEIGHT,
    background: { color: '#ffffff' },
    border: { color: '#d8d0c0', width: 0.5, inset: 30 },
    slots: buildStandardSlots({
      nameText: 'Pavla Hájková',
      nameSize: 28,
      bodyFamily: 'sans',
      bodyColor: '#4a4a4a',
      nameColor: '#111',
    }),
  },
];

export const getParteTemplateById = (id: string): ParteTemplate | undefined =>
  parteTemplates.find((template) => template.id === id);
