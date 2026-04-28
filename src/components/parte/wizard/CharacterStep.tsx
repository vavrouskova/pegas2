'use client';

import { useTranslations } from 'next-intl';

import StepHeader from '@/components/parte/wizard/StepHeader';
import { cn } from '@/lib/utils';
import { ParteCharacter, ParteMotif } from '@/types/parte';

const OPTIONS: { value: ParteCharacter; preview: { bg: string; border?: string; text: string } }[] = [
  { value: 'classic', preview: { bg: '#fefcf7', border: '#1a1a1a', text: '#111' } },
  { value: 'soft', preview: { bg: '#f7f1e5', border: '#a07a4a', text: '#3a2a1e' } },
  { value: 'dark', preview: { bg: '#1d1a22', border: '#c8b68a', text: '#f5ecd7' } },
  { value: 'minimal', preview: { bg: '#f5f2ec', text: '#111' } },
  { value: 'modern', preview: { bg: '#f2ecf0', border: '#5b3280', text: '#5b3280' } },
];

const MOTIF_OPTIONS: { value: ParteMotif; swatch: string; emoji: string }[] = [
  { value: 'none', swatch: '#e8e4dc', emoji: '—' },
  { value: 'garden', swatch: '#dde7d4', emoji: '🌿' },
  { value: 'architecture', swatch: '#e0dfd7', emoji: '🏛' },
  { value: 'flowers', swatch: '#f1dee2', emoji: '🌸' },
  { value: 'cookbook', swatch: '#ecdcc4', emoji: '🍞' },
];

/* eslint-disable no-unused-vars */
interface CharacterStepProps {
  value: ParteCharacter;
  motif: ParteMotif;
  onChange: (character: ParteCharacter) => void;
  onMotifChange: (motif: ParteMotif) => void;
}
/* eslint-enable no-unused-vars */

const CharacterStep = ({ value, motif, onChange, onMotifChange }: CharacterStepProps) => {
  const t = useTranslations('parte.wizard.steps.character');

  return (
    <div className='flex flex-col gap-10'>
      <div className='flex flex-col gap-6'>
        <StepHeader title={t('title')} />

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'>
          {OPTIONS.map((option) => {
            const active = value === option.value;
            const optionT = t.raw(`options.${option.value}`) as { title: string; description: string };
            return (
              <button
                key={option.value}
                type='button'
                onClick={() => onChange(option.value)}
                className={cn(
                  'flex flex-col gap-3 p-5 text-left transition',
                  active ? 'bg-primary/[0.06]' : 'bg-white hover:bg-white-smoke'
                )}
              >
                <div
                  className='aspect-[210/297] w-full'
                  style={{
                    backgroundColor: option.preview.bg,
                    border: option.preview.border
                      ? `2px solid ${option.preview.border}`
                      : undefined,
                  }}
                >
                  <div className='flex h-full items-center justify-center'>
                    <span
                      className='text-xl font-medium'
                      style={{ color: option.preview.text }}
                    >
                      Aa
                    </span>
                  </div>
                </div>
                <div className='flex flex-col gap-1'>
                  <span className='text-primary text-base font-medium'>{optionT.title}</span>
                  <span className='text-primary/60 text-xs'>{optionT.description}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className='flex flex-col gap-4'>
        <div className='flex flex-col gap-1'>
          <span className='text-primary text-base font-medium'>{t('motifs.title')}</span>
          <span className='text-primary/60 text-xs'>{t('motifs.description')}</span>
        </div>
        <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5'>
          {MOTIF_OPTIONS.map((option) => {
            const active = motif === option.value;
            const optionT = t.raw(`motifs.options.${option.value}`) as { title: string };
            return (
              <button
                key={option.value}
                type='button'
                onClick={() => onMotifChange(option.value)}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 text-center transition',
                  active ? 'bg-primary/[0.06]' : 'bg-white hover:bg-white-smoke'
                )}
              >
                <div
                  className='flex aspect-square w-full items-center justify-center text-2xl'
                  style={{ backgroundColor: option.swatch }}
                >
                  <span>{option.emoji}</span>
                </div>
                <span className='text-primary text-sm'>{optionT.title}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CharacterStep;
