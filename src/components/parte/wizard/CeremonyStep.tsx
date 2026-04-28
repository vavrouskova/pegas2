'use client';

import { useTranslations } from 'next-intl';

import StepHeader from '@/components/parte/wizard/StepHeader';
import { cn } from '@/lib/utils';
import { ParteCeremonyScope, ParteWizardAnswers } from '@/types/parte';

const FIELD_LABEL = 'text-primary/55 text-[11px] tracking-[0.1em] uppercase';
const TEXT_INPUT =
  'bg-white p-3 text-[15px] text-primary focus:ring-2 focus:ring-primary/30 focus:outline-none transition';

const SCOPES: ParteCeremonyScope[] = ['public', 'family', 'private'];

/* eslint-disable no-unused-vars */
interface CeremonyStepProps {
  ceremonyScope: ParteCeremonyScope;
  ceremonyPlace: string;
  ceremonyDate: string;
  ceremonyTime: string;
  signature: string;
  onChange: (patch: Partial<ParteWizardAnswers>) => void;
}
/* eslint-enable no-unused-vars */

const CeremonyStep = ({
  ceremonyScope,
  ceremonyPlace,
  ceremonyDate,
  ceremonyTime,
  signature,
  onChange,
}: CeremonyStepProps) => {
  const t = useTranslations('parte.wizard.steps.ceremony');
  const now = new Date();
  const minDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  const maxDate = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate())
    .toISOString()
    .slice(0, 10);

  const showDetails = ceremonyScope === 'public';

  return (
    <div className='flex flex-col gap-6'>
      <StepHeader title={t('title')} />

      <div className='flex flex-col gap-3'>
        <span className={FIELD_LABEL}>{t('scope.title')}</span>
        <div className='grid grid-cols-1 gap-2 sm:grid-cols-3'>
          {SCOPES.map((scope) => {
            const active = ceremonyScope === scope;
            return (
              <button
                key={scope}
                type='button'
                onClick={() => onChange({ ceremonyScope: scope })}
                className={cn(
                  'text-primary flex flex-col items-start gap-1 p-4 text-left transition',
                  active ? 'bg-primary/[0.06]' : 'bg-white hover:bg-white-smoke'
                )}
              >
                <span className='text-sm font-medium'>{t(`scope.options.${scope}.title`)}</span>
                <span className='text-primary/60 text-xs'>
                  {t(`scope.options.${scope}.description`)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {showDetails && (
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <label className='flex flex-col gap-1.5 sm:col-span-2'>
            <span className={FIELD_LABEL}>{t('place')}</span>
            <input
              type='text'
              value={ceremonyPlace}
              placeholder={t('place-placeholder')}
              onChange={(event) => onChange({ ceremonyPlace: event.target.value })}
              className={cn(TEXT_INPUT, 'w-full')}
            />
          </label>
          <label className='flex flex-col gap-1.5'>
            <span className={FIELD_LABEL}>{t('date')}</span>
            <input
              type='date'
              value={ceremonyDate}
              min={minDate}
              max={maxDate}
              onChange={(event) => onChange({ ceremonyDate: event.target.value })}
              className={cn(TEXT_INPUT, 'w-full')}
            />
          </label>
          <label className='flex flex-col gap-1.5'>
            <span className={FIELD_LABEL}>{t('time')}</span>
            <input
              type='time'
              value={ceremonyTime}
              onChange={(event) => onChange({ ceremonyTime: event.target.value })}
              className={cn(TEXT_INPUT, 'w-full')}
            />
          </label>
        </div>
      )}

      <label className='flex flex-col gap-1.5'>
        <span className={FIELD_LABEL}>{t('signature')}</span>
        <input
          type='text'
          value={signature}
          placeholder={t('signature-placeholder')}
          onChange={(event) => onChange({ signature: event.target.value })}
          className={cn(TEXT_INPUT, 'w-full')}
        />
      </label>
    </div>
  );
};

export default CeremonyStep;
