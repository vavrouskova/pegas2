'use client';

import { AlignCenter, AlignLeft, AlignRight, Quote, Trash2, Upload } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ChangeEvent, useRef, useState } from 'react';

import { parteFonts } from '@/data/parte-fonts';
import { cn } from '@/lib/utils';
import { ParteOverlay, ParteSlot, ParteTemplate, ParteTextAlign } from '@/types/parte';

/* eslint-disable no-unused-vars */
interface PropertiesPanelProps {
  template: ParteTemplate;
  selectedSlotId: string | null;
  texts: Record<string, string>;
  photos: Record<string, string>;
  portraitOverlay?: ParteOverlay;
  crossOverlay?: ParteOverlay;
  onTextChange: (slotId: string, value: string) => void;
  onTextStyleChange: (slotId: string, key: 'fontSize' | 'color' | 'align' | 'fontId', value: string | number) => void;
  onPhotoChange: (slotId: string, value: string | null) => void;
  onOpenPhotoLibrary: () => void;
  onOpenQuotes: () => void;
  onOverlayZoomChange: (kind: 'portrait' | 'cross', zoom: number) => void;
  onOverlayRemove: (kind: 'portrait' | 'cross') => void;
}
/* eslint-enable no-unused-vars */

const ALIGN_OPTIONS: { value: ParteTextAlign; Icon: typeof AlignLeft }[] = [
  { value: 'left', Icon: AlignLeft },
  { value: 'center', Icon: AlignCenter },
  { value: 'right', Icon: AlignRight },
];

const FIELD_LABEL = 'text-primary/60 text-xs font-medium tracking-wide uppercase';
const TEXT_INPUT = 'border border-primary/20 bg-white p-2.5 text-base text-primary focus:border-primary/50 focus:outline-none';

const CZECH_MONTHS_GENITIVE = [
  'ledna',
  'února',
  'března',
  'dubna',
  'května',
  'června',
  'července',
  'srpna',
  'září',
  'října',
  'listopadu',
  'prosince',
];

const formatCzechDate = (iso: string): string | null => {
  if (!iso) return null;
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return null;
  return `${d}. ${CZECH_MONTHS_GENITIVE[m - 1]} ${y}`;
};

const buildDatesString = (birthIso: string, deathIso: string): string => {
  const birth = formatCzechDate(birthIso);
  const death = formatCzechDate(deathIso);
  if (birth && death) return `* ${birth}    † ${death}`;
  if (birth) return `* ${birth}`;
  if (death) return `† ${death}`;
  return '';
};

// eslint-disable-next-line no-unused-vars
function DatesAssist({ onApply }: { onApply: (formatted: string) => void }) {
  const [birth, setBirth] = useState('');
  const [death, setDeath] = useState('');
  const today = new Date().toISOString().slice(0, 10);

  const update = (nextBirth: string, nextDeath: string) => {
    setBirth(nextBirth);
    setDeath(nextDeath);
    const formatted = buildDatesString(nextBirth, nextDeath);
    if (formatted) onApply(formatted);
  };

  return (
    <div className='bg-primary/5 flex flex-col gap-2 p-3'>
      <p className='text-primary/60 text-[11px] font-medium tracking-[0.08em] uppercase'>
        Vložit z kalendáře
      </p>
      <div className='flex gap-2'>
        <label className='flex flex-1 flex-col gap-1'>
          <span className='text-primary/70 text-xs'>Narození</span>
          <input
            type='date'
            value={birth}
            min='1900-01-01'
            max={today}
            onChange={(event) => update(event.target.value, death)}
            className='border-primary/20 text-primary w-full border bg-white px-2 py-1.5 text-sm focus:outline-none'
          />
        </label>
        <label className='flex flex-1 flex-col gap-1'>
          <span className='text-primary/70 text-xs'>Úmrtí</span>
          <input
            type='date'
            value={death}
            min='1900-01-01'
            max={today}
            onChange={(event) => update(birth, event.target.value)}
            className='border-primary/20 text-primary w-full border bg-white px-2 py-1.5 text-sm focus:outline-none'
          />
        </label>
      </div>
      <p className='text-primary/50 text-xs leading-relaxed'>
        Po výběru se datum zapíše do textu výše. Text můžeš dál ručně upravit.
      </p>
    </div>
  );
}

const COLOR_SWATCHES: { name: string; value: string }[] = [
  { name: 'Černá', value: '#000000' },
  { name: 'Šedá tmavá', value: '#3a3a3a' },
  { name: 'Šedá světlá', value: '#9c9c9c' },
  { name: 'Bílá', value: '#ffffff' },
  { name: 'Béžová', value: '#e8ddc8' },
  { name: 'Hnědá', value: '#6b4a2b' },
  { name: 'Modrá tmavá', value: '#2e4a6b' },
  { name: 'Modrá světlá', value: '#8fa8c2' },
  { name: 'Pegas fialová', value: '#522953' },
];

const PropertiesPanel = ({
  template,
  selectedSlotId,
  texts,
  photos,
  portraitOverlay,
  crossOverlay,
  onTextChange,
  onTextStyleChange,
  onPhotoChange,
  onOpenPhotoLibrary,
  onOpenQuotes,
  onOverlayZoomChange,
  onOverlayRemove,
}: PropertiesPanelProps) => {
  const t = useTranslations('parte.editor.properties');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (selectedSlotId === '__portrait_overlay__' || selectedSlotId === '__cross_overlay__') {
    const kind = selectedSlotId === '__portrait_overlay__' ? 'portrait' : 'cross';
    const overlay = kind === 'portrait' ? portraitOverlay : crossOverlay;
    const label = kind === 'portrait' ? 'Portrét' : 'Symbol';
    if (!overlay) return null;
    const zoom = overlay.zoom ?? 1;

    return (
      <aside className='flex flex-col gap-4 p-5'>
        <h3 className='text-primary'>{label}</h3>
        <div className='flex flex-col gap-2'>
          <label className={FIELD_LABEL}>Přiblížení ({zoom.toFixed(2)}×)</label>
          <input
            type='range'
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(event) => onOverlayZoomChange(kind, Number(event.target.value))}
            className='accent-primary w-full'
          />
        </div>
        <p className='text-primary/60 text-xs leading-relaxed'>
          Táhnutím posunete umístění, posuvníkem zvětšíte fotku uvnitř {kind === 'portrait' ? 'kruhu' : 'rámečku'}.
        </p>
        <button
          type='button'
          onClick={() => onOverlayRemove(kind)}
          className='text-primary/70 hover:text-primary flex items-center justify-center gap-2 px-4 py-2.5 text-sm transition'
        >
          <Trash2 className='h-4 w-4' />
          Odebrat {label.toLowerCase()}
        </button>
      </aside>
    );
  }

  const slot: ParteSlot | undefined = template.slots.find((s) => s.id === selectedSlotId);

  if (!slot) {
    return (
      <aside className='flex flex-col gap-3 p-5'>
        <p className='text-primary/50 text-[11px] font-medium tracking-[0.08em] uppercase'>
          {t('title')}
        </p>
        <p className='text-primary text-base leading-normal'>
          Klikněte na libovolný text nebo fotografii v parte vlevo a otevře se úprava.
        </p>
      </aside>
    );
  }

  if (slot.type === 'photo') {
    const currentPhoto = photos[slot.id];
    const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        if (typeof reader.result === 'string') {
          onPhotoChange(slot.id, reader.result);
        }
      });
      reader.readAsDataURL(file);
      event.target.value = '';
    };

    return (
      <aside className='flex h-full flex-col gap-4 p-5'>
        <h3 className='text-primary'>{slot.label}</h3>
        {currentPhoto && (
          <div className='bg-white-smoke ring-primary/10 aspect-square w-full overflow-hidden ring-1'>
            <img
              src={currentPhoto}
              alt={slot.label}
              className='h-full w-full object-cover'
            />
          </div>
        )}
        <input
          ref={fileInputRef}
          type='file'
          accept='image/*'
          onChange={handleUpload}
          className='hidden'
        />
        <button
          type='button'
          onClick={() => fileInputRef.current?.click()}
          className='bg-primary text-white-smoke flex items-center justify-center gap-2 px-4 py-2.5 text-sm transition-opacity hover:opacity-90'
        >
          <Upload className='h-4 w-4' />
          {t('upload-photo')}
        </button>
        <button
          type='button'
          onClick={onOpenPhotoLibrary}
          className='border-primary/20 text-primary hover:bg-white-smoke flex items-center justify-center gap-2 border bg-white px-4 py-2.5 text-sm transition'
        >
          {t('choose-from-library')}
        </button>
        {currentPhoto && (
          <button
            type='button'
            onClick={() => onPhotoChange(slot.id, null)}
            className='text-primary/70 hover:text-primary flex items-center justify-center gap-2 px-4 py-2.5 text-sm transition'
          >
            <Trash2 className='h-4 w-4' />
            {t('remove-photo')}
          </button>
        )}
      </aside>
    );
  }

  const value = texts[slot.id] ?? slot.defaultText;
  const currentFontId = slot.style.fontId ?? '';

  return (
    <aside className='flex h-full flex-col gap-4 overflow-y-auto p-5'>
      <h3 className='text-primary'>{slot.label}</h3>

      <div className='flex flex-col gap-2'>
        <label className={FIELD_LABEL}>{t('text-content')}</label>
        {slot.multiline ? (
          <textarea
            value={value}
            onChange={(event) => onTextChange(slot.id, event.target.value)}
            className={cn(TEXT_INPUT, 'min-h-24 w-full resize-y')}
            rows={4}
          />
        ) : (
          <input
            type='text'
            value={value}
            onChange={(event) => onTextChange(slot.id, event.target.value)}
            className={cn(TEXT_INPUT, 'w-full')}
          />
        )}
      </div>

      {slot.id === 'quote' && (
        <button
          type='button'
          onClick={onOpenQuotes}
          className='border-primary/20 text-primary hover:bg-white-smoke flex items-center justify-center gap-2 border bg-white px-4 py-2.5 text-sm transition'
        >
          <Quote className='h-4 w-4' />
          Vybrat z citátů
        </button>
      )}

      {slot.id === 'dates' && (
        <DatesAssist onApply={(formatted) => onTextChange(slot.id, formatted)} />
      )}

      <div className='flex flex-col gap-2'>
        <label className={FIELD_LABEL}>Písmo</label>
        <select
          value={currentFontId}
          onChange={(event) => onTextStyleChange(slot.id, 'fontId', event.target.value)}
          className={cn(TEXT_INPUT, 'w-full')}
        >
          <option value=''>Výchozí</option>
          {parteFonts.map((font) => (
            <option
              key={font.id}
              value={font.id}
              style={{ fontFamily: font.cssFamily }}
            >
              {font.name}
            </option>
          ))}
        </select>
      </div>

      <div className='flex flex-col gap-2'>
        <label className={FIELD_LABEL}>
          {t('font-size')} ({slot.style.fontSize}px)
        </label>
        <input
          type='range'
          min={8}
          max={48}
          step={1}
          value={slot.style.fontSize}
          onChange={(event) => onTextStyleChange(slot.id, 'fontSize', Number(event.target.value))}
          className='accent-primary w-full'
        />
      </div>

      <div className='flex flex-col gap-2'>
        <label className={FIELD_LABEL}>{t('text-align')}</label>
        <div className='flex gap-2'>
          {ALIGN_OPTIONS.map(({ value: alignValue, Icon }) => (
            <button
              key={alignValue}
              type='button'
              onClick={() => onTextStyleChange(slot.id, 'align', alignValue)}
              className={cn(
                'flex h-10 flex-1 items-center justify-center border transition',
                slot.style.align === alignValue
                  ? 'border-primary bg-primary text-white-smoke'
                  : 'border-primary/20 text-primary hover:bg-white-smoke bg-white'
              )}
              aria-label={alignValue}
            >
              <Icon className='h-4 w-4' />
            </button>
          ))}
        </div>
      </div>

      <div className='flex flex-col gap-2'>
        <label className={FIELD_LABEL}>{t('text-color')}</label>
        <div className='flex flex-wrap gap-2'>
          {COLOR_SWATCHES.map((swatch) => {
            const isActive = slot.style.color.toLowerCase() === swatch.value.toLowerCase();
            return (
              <button
                key={swatch.value}
                type='button'
                onClick={() => onTextStyleChange(slot.id, 'color', swatch.value)}
                title={swatch.name}
                aria-label={swatch.name}
                className={cn(
                  'h-8 w-8 border transition',
                  isActive ? 'border-primary ring-primary/30 ring-2' : 'border-primary/20 hover:border-primary/60'
                )}
                style={{ backgroundColor: swatch.value }}
              />
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default PropertiesPanel;
