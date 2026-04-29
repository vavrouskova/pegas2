'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCallback, useMemo, useState } from 'react';

import CeremonyStep from '@/components/parte/wizard/CeremonyStep';
import CharacterStep from '@/components/parte/wizard/CharacterStep';
import GenderStep from '@/components/parte/wizard/GenderStep';
import IdentityStep from '@/components/parte/wizard/IdentityStep';
import PhotoStep from '@/components/parte/wizard/PhotoStep';
import ResultsStep from '@/components/parte/wizard/ResultsStep';
import VerseStep from '@/components/parte/wizard/VerseStep';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { ParteWizardAnswers } from '@/types/parte';

const TOTAL_STEPS = 6;

const initialAnswers: ParteWizardAnswers = {
  familyRoles: [],
  firstName: '',
  lastName: '',
  birthDate: '',
  deathDate: '',
  hasPhoto: false,
  character: 'classic',
  motif: 'none',
  verseChoice: 'none',
  ceremonyScope: 'public',
  ceremonyPlace: '',
  ceremonyDate: '',
  ceremonyTime: '',
  signature: '',
};

const ParteWizard = () => {
  const t = useTranslations('parte.wizard');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<ParteWizardAnswers>(initialAnswers);
  const [showResults, setShowResults] = useState(false);

  const updateAnswers = useCallback((patch: Partial<ParteWizardAnswers>) => {
    setAnswers((previous) => ({ ...previous, ...patch }));
  }, []);

  const canProceed = useMemo(() => {
    switch (step) {
      case 0:
        return Boolean(answers.gender);
      case 1: {
        const namesOk =
          answers.firstName.trim().length > 0 && answers.lastName.trim().length > 0;
        const datesOk =
          !answers.birthDate || !answers.deathDate || answers.deathDate >= answers.birthDate;
        return namesOk && datesOk;
      }
      case 2:
        return !answers.hasPhoto || Boolean(answers.photoDataUrl);
      case 3:
        return Boolean(answers.character);
      case 4:
        if (answers.verseChoice === 'custom') {
          return Boolean(answers.verseText && answers.verseText.trim());
        }
        if (answers.verseChoice === 'religious' || answers.verseChoice === 'secular') {
          return Boolean(answers.verseId);
        }
        return true;
      case 5:
        return true;
      default:
        return true;
    }
  }, [step, answers]);

  const handleNext = useCallback(() => {
    if (step < TOTAL_STEPS - 1) {
      setStep((s) => s + 1);
      return;
    }
    setShowResults(true);
  }, [step]);

  const handleBack = useCallback(() => {
    if (showResults) {
      setShowResults(false);
      return;
    }
    if (step > 0) setStep((s) => s - 1);
  }, [step, showResults]);

  if (showResults) {
    return (
      <ResultsStep
        answers={answers}
        onBack={handleBack}
      />
    );
  }

  return (
    <section className='flex flex-col gap-10 py-12 lg:px-30 lg:py-20'>
      <div className='flex flex-col gap-4'>
        <div className='flex items-center justify-between gap-4'>
          <span className='text-primary/50 text-[11px] tracking-[0.12em] uppercase'>
            {t('progress', { step: step + 1, total: TOTAL_STEPS })}
          </span>
          <Link
            href='/parte'
            className='text-primary/50 hover:text-primary text-xs underline-offset-4 transition hover:underline'
          >
            {t('intro.back-to-gallery')}
          </Link>
        </div>
      </div>

      <div className='flex min-h-[360px] flex-col gap-6 lg:min-h-[420px]'>
        {step === 0 && (
          <GenderStep
            gender={answers.gender}
            familyRoles={answers.familyRoles}
            onGenderChange={(gender) => updateAnswers({ gender, familyRoles: [] })}
            onFamilyRolesChange={(familyRoles) => updateAnswers({ familyRoles })}
          />
        )}
        {step === 1 && (
          <IdentityStep
            firstName={answers.firstName}
            lastName={answers.lastName}
            birthDate={answers.birthDate}
            deathDate={answers.deathDate}
            onChange={updateAnswers}
          />
        )}
        {step === 2 && (
          <PhotoStep
            hasPhoto={answers.hasPhoto}
            photoDataUrl={answers.photoDataUrl}
            onChange={updateAnswers}
          />
        )}
        {step === 3 && (
          <CharacterStep
            value={answers.character}
            motif={answers.motif}
            onChange={(character) => updateAnswers({ character })}
            onMotifChange={(motif) => updateAnswers({ motif })}
          />
        )}
        {step === 4 && answers.gender && (
          <VerseStep
            gender={answers.gender}
            verseChoice={answers.verseChoice}
            verseId={answers.verseId}
            verseText={answers.verseText}
            onChange={updateAnswers}
          />
        )}
        {step === 5 && (
          <CeremonyStep
            ceremonyScope={answers.ceremonyScope}
            ceremonyPlace={answers.ceremonyPlace}
            ceremonyDate={answers.ceremonyDate}
            ceremonyTime={answers.ceremonyTime}
            signature={answers.signature}
            onChange={updateAnswers}
          />
        )}
      </div>

      <div className='-mt-2 flex items-center justify-between gap-3'>
        <button
          type='button'
          onClick={handleBack}
          disabled={step === 0}
          className={cn(
            'text-primary/70 flex items-center gap-2 px-2 py-2.5 text-sm transition',
            step === 0
              ? 'pointer-events-none opacity-0'
              : 'hover:text-primary'
          )}
        >
          <ArrowLeft className='h-4 w-4' />
          {t('back')}
        </button>
        <button
          type='button'
          onClick={handleNext}
          disabled={!canProceed}
          className={cn(
            'bg-primary text-white-smoke flex items-center gap-2 px-7 py-3 text-sm transition-opacity',
            canProceed ? 'hover:opacity-90' : 'pointer-events-none opacity-30'
          )}
        >
          {step === TOTAL_STEPS - 1 ? t('finish') : t('next')}
          <ArrowRight className='h-4 w-4' />
        </button>
      </div>
    </section>
  );
};

export default ParteWizard;
