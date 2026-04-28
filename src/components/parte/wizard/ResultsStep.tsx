'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import StaticParteSvg from '@/components/parte/StaticParteSvg';
import { useRouter } from '@/i18n/routing';
import { ParteTemplate, ParteWizardAnswers } from '@/types/parte';
import { buildDraftFromWizard } from '@/utils/parte/build-draft-from-wizard';
import { scoreParteTemplates } from '@/utils/parte/score-templates';

const storageKey = (id: string) => `parte-draft-${id}`;

/* eslint-disable no-unused-vars */
interface ResultsStepProps {
  answers: ParteWizardAnswers;
  onBack: () => void;
}
/* eslint-enable no-unused-vars */

const ResultsStep = ({ answers, onBack }: ResultsStepProps) => {
  const t = useTranslations('parte.wizard.results');
  const router = useRouter();

  const results = useMemo(() => {
    const templates = scoreParteTemplates(answers, 10);
    return templates.map((template) => ({
      template,
      draft: buildDraftFromWizard(template, answers),
    }));
  }, [answers]);

  const handlePick = (template: ParteTemplate) => {
    const draft = buildDraftFromWizard(template, answers);
    try {
      localStorage.setItem(storageKey(template.id), JSON.stringify(draft));
    } catch {
      /* ignore quota errors */
    }
    router.push({
      pathname: '/parte/editor/[templateId]',
      params: { templateId: template.id },
    });
  };

  return (
    <section className='flex flex-col gap-8 py-10 lg:px-30 lg:py-16'>
      <div className='flex flex-col gap-3'>
        <button
          type='button'
          onClick={onBack}
          className='text-primary/70 hover:text-primary flex w-fit items-center gap-2 text-sm transition'
        >
          <ArrowLeft className='h-4 w-4' />
          {t('back-to-form')}
        </button>
        <h2 className='text-primary'>{t('title')}</h2>
        <p className='text-primary/70 max-w-content text-base'>{t('description')}</p>
      </div>

      {results.length === 0 ? (
        <p className='text-primary/60 py-12 text-center text-base'>{t('empty')}</p>
      ) : (
        <div className='grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5'>
          {results.map(({ template, draft }) => (
            <button
              key={template.id}
              type='button'
              onClick={() => handlePick(template)}
              className='group flex flex-col gap-4 text-left'
            >
              <div className='ring-primary/10 group-hover:ring-primary/30 aspect-[210/297] overflow-hidden ring-1 transition'>
                <StaticParteSvg
                  template={template}
                  draft={draft}
                  className='h-full w-full'
                />
              </div>
              <div className='flex flex-col gap-2'>
                <h3 className='text-lg leading-tight tracking-wide'>{template.name}</h3>
                <span className='text-primary/80 flex items-center gap-1.5 text-xs transition-transform group-hover:translate-x-1'>
                  {t('use')}
                  <ArrowRight className='h-3 w-3' />
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
};

export default ResultsStep;
