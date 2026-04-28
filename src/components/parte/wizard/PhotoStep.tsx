'use client';

import { Trash2, Upload } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ChangeEvent, useRef } from 'react';

import StepHeader from '@/components/parte/wizard/StepHeader';
import { cn } from '@/lib/utils';
import { ParteWizardAnswers } from '@/types/parte';

/* eslint-disable no-unused-vars */
interface PhotoStepProps {
  hasPhoto: boolean;
  photoDataUrl?: string;
  onChange: (patch: Partial<ParteWizardAnswers>) => void;
}
/* eslint-enable no-unused-vars */

const PhotoStep = ({ hasPhoto, photoDataUrl, onChange }: PhotoStepProps) => {
  const t = useTranslations('parte.wizard.steps.photo');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      if (typeof reader.result === 'string') {
        onChange({ hasPhoto: true, photoDataUrl: reader.result });
      }
    });
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  return (
    <div className='flex flex-col gap-6'>
      <StepHeader title={t('title')} />

      <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
        <button
          type='button'
          onClick={() => onChange({ hasPhoto: true })}
          className={cn(
            'text-primary flex h-24 items-center justify-center px-4 text-[15px] transition',
            hasPhoto ? 'bg-primary/[0.06]' : 'bg-white hover:bg-white-smoke'
          )}
        >
          {t('yes')}
        </button>
        <button
          type='button'
          onClick={() => onChange({ hasPhoto: false, photoDataUrl: undefined })}
          className={cn(
            'text-primary flex h-24 items-center justify-center px-4 text-[15px] transition',
            !hasPhoto ? 'bg-primary/[0.06]' : 'bg-white hover:bg-white-smoke'
          )}
        >
          {t('no')}
        </button>
      </div>

      {hasPhoto && (
        <div className='flex flex-col gap-4 bg-white p-6'>
          {photoDataUrl && (
            <div className='bg-white-smoke ring-primary/10 mx-auto aspect-square w-40 overflow-hidden ring-1'>
              <img
                src={photoDataUrl}
                alt='Náhled fotografie'
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
          <div className='flex flex-col gap-2 sm:flex-row'>
            <button
              type='button'
              onClick={() => fileInputRef.current?.click()}
              className='bg-primary text-white-smoke flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm transition-opacity hover:opacity-90'
            >
              <Upload className='h-4 w-4' />
              {photoDataUrl ? t('replace') : t('upload')}
            </button>
            {photoDataUrl && (
              <button
                type='button'
                onClick={() => onChange({ photoDataUrl: undefined })}
                className='ring-primary/15 text-primary hover:ring-primary/40 flex items-center justify-center gap-2 bg-white px-4 py-3 text-sm ring-1 transition'
              >
                <Trash2 className='h-4 w-4' />
                {t('remove')}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoStep;
