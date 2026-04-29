'use client';

import { useTranslations } from 'next-intl';

import StepHeader from '@/components/parte/wizard/StepHeader';
import { cn } from '@/lib/utils';
import { ParteWizardAnswers } from '@/types/parte';

const FIELD_LABEL = 'text-primary/55 text-[11px] tracking-[0.1em] uppercase';
const TEXT_INPUT =
  'bg-white p-3 text-[15px] text-primary focus:ring-2 focus:ring-primary/30 focus:outline-none transition';

/* eslint-disable no-unused-vars */
interface IdentityStepProps {
  firstName: string;
  lastName: string;
  birthDate: string;
  deathDate: string;
  onChange: (patch: Partial<ParteWizardAnswers>) => void;
}
/* eslint-enable no-unused-vars */

const IdentityStep = ({
  firstName,
  lastName,
  birthDate,
  deathDate,
  onChange,
}: IdentityStepProps) => {
  const t = useTranslations('parte.wizard.steps.identity');
  const today = new Date().toISOString().slice(0, 10);
  const birthMax = deathDate && deathDate < today ? deathDate : today;
  const deathMin = birthDate || '1900-01-01';
  const datesInvalid = Boolean(birthDate && deathDate && deathDate < birthDate);

  return (
    <div className='flex flex-col gap-6'>
      <StepHeader title={t('title')} />

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        <label className='flex flex-col gap-1.5'>
          <span className={FIELD_LABEL}>{t('first-name')}</span>
          <input
            type='text'
            value={firstName}
            placeholder={t('first-name-placeholder')}
            onChange={(event) => onChange({ firstName: event.target.value })}
            className={cn(TEXT_INPUT, 'w-full')}
          />
        </label>
        <label className='flex flex-col gap-1.5'>
          <span className={FIELD_LABEL}>{t('last-name')}</span>
          <input
            type='text'
            value={lastName}
            placeholder={t('last-name-placeholder')}
            onChange={(event) => onChange({ lastName: event.target.value })}
            className={cn(TEXT_INPUT, 'w-full')}
          />
        </label>
        <label className='flex flex-col gap-1.5'>
          <span className={FIELD_LABEL}>{t('birth')}</span>
          <input
            type='date'
            value={birthDate}
            min='1900-01-01'
            max={birthMax}
            onChange={(event) => onChange({ birthDate: event.target.value })}
            className={cn(TEXT_INPUT, 'w-full')}
          />
        </label>
        <label className='flex flex-col gap-1.5'>
          <span className={FIELD_LABEL}>{t('death')}</span>
          <input
            type='date'
            value={deathDate}
            min={deathMin}
            max={today}
            aria-invalid={datesInvalid}
            onChange={(event) => onChange({ deathDate: event.target.value })}
            className={cn(
              TEXT_INPUT,
              'w-full',
              datesInvalid && 'ring-2 ring-red-500 focus:ring-red-500'
            )}
          />
        </label>
      </div>

      {datesInvalid && (
        <p className='font-text text-sm text-red-600'>{t('date-order-error')}</p>
      )}
    </div>
  );
};

export default IdentityStep;
