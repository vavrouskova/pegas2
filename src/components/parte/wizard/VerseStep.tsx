'use client';

import { Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import StepHeader from '@/components/parte/wizard/StepHeader';
import { ParteQuote, ParteQuoteCategory, parteQuotes } from '@/data/parte-quotes';
import { cn } from '@/lib/utils';
import { ParteGender, ParteVerseChoice, ParteWizardAnswers } from '@/types/parte';

const CHOICES: { value: ParteVerseChoice; key: 'religious' | 'secular' | 'custom' | 'none' }[] = [
  { value: 'religious', key: 'religious' },
  { value: 'secular', key: 'secular' },
  { value: 'custom', key: 'custom' },
  { value: 'none', key: 'none' },
];

const secularCategoriesForGender = (gender: ParteGender): ParteQuoteCategory[] => {
  if (gender === 'male') return ['father', 'literary', 'universal'];
  return ['mother', 'literary', 'universal'];
};

/* eslint-disable no-unused-vars */
interface VerseStepProps {
  gender: ParteGender;
  verseChoice: ParteVerseChoice;
  verseId?: string;
  verseText?: string;
  onChange: (patch: Partial<ParteWizardAnswers>) => void;
}
/* eslint-enable no-unused-vars */

const VerseStep = ({
  gender,
  verseChoice,
  verseId,
  verseText,
  onChange,
}: VerseStepProps) => {
  const t = useTranslations('parte.wizard.steps.verse');

  const visibleQuotes = useMemo(() => {
    if (verseChoice === 'religious') {
      return parteQuotes.filter((quote) => quote.category === 'religious');
    }
    if (verseChoice === 'secular') {
      const categories = secularCategoriesForGender(gender);
      return parteQuotes.filter((quote) => categories.includes(quote.category));
    }
    return [];
  }, [verseChoice, gender]);

  const handleSelectQuote = (quote: ParteQuote) => {
    onChange({ verseId: quote.id, verseText: quote.text });
  };

  return (
    <div className='flex flex-col gap-6'>
      <StepHeader title={t('title')} />

      <div className='grid grid-cols-2 gap-2 sm:grid-cols-4'>
        {CHOICES.map((choice) => {
          const active = verseChoice === choice.value;
          return (
            <button
              key={choice.value}
              type='button'
              onClick={() =>
                onChange({
                  verseChoice: choice.value,
                  verseId: undefined,
                  verseText: choice.value === 'custom' ? verseText : undefined,
                })
              }
              className={cn(
                'text-primary flex h-12 items-center justify-center px-3 text-sm transition',
                active ? 'bg-primary/[0.06]' : 'bg-white hover:bg-white-smoke'
              )}
            >
              {t(choice.key)}
            </button>
          );
        })}
      </div>

      {(verseChoice === 'religious' || verseChoice === 'secular') && (
        <div
          data-lenis-prevent
          className='flex max-h-[420px] flex-col gap-1 overflow-y-auto bg-white p-3'
        >
          {visibleQuotes.map((quote) => {
            const active = verseId === quote.id;
            return (
              <button
                key={quote.id}
                type='button'
                onClick={() => handleSelectQuote(quote)}
                className={cn(
                  'flex items-start gap-3 p-4 text-left transition',
                  active ? 'bg-primary/[0.06]' : 'hover:bg-white-smoke'
                )}
              >
                <span
                  className={cn(
                    'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center transition',
                    active ? 'bg-primary' : 'bg-white-smoke'
                  )}
                >
                  {active && <Check className='text-white-smoke h-3 w-3' />}
                </span>
                <span className='flex flex-col gap-1'>
                  <span
                    className='font-italic text-primary text-sm leading-snug'
                    dangerouslySetInnerHTML={{ __html: quote.text }}
                  />
                  {quote.author && (
                    <span className='text-primary/60 text-xs'>— {quote.author}</span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {verseChoice === 'custom' && (
        <textarea
          value={verseText ?? ''}
          onChange={(event) => onChange({ verseText: event.target.value })}
          placeholder={t('placeholder')}
          rows={5}
          className='text-primary focus:ring-primary/30 min-h-32 w-full resize-y bg-white p-3 text-base transition focus:ring-2 focus:outline-none'
        />
      )}
    </div>
  );
};

export default VerseStep;
