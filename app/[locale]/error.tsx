'use client';

import { useTranslations } from 'next-intl';
import React, { useEffect } from 'react';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@radix-ui/react-collapsible';
import * as Sentry from '@sentry/nextjs';

interface ErrorProps {
  error: Error;
}

// eslint-disable-next-line sonarjs/no-globals-shadowing
const Error = (props: ErrorProps) => {
  const { error } = props;

  const t = useTranslations('error_page.500');

  useEffect(() => {
    console.error(error);
    Sentry.captureException(error);
  }, [error]);

  return (
    <section className='basic-px bg-secondary relative z-5 flex h-screen w-full flex-col items-center justify-center overflow-hidden'>
      <div className='flex h-full flex-col items-center justify-center'>
        <div className='relative z-10 flex flex-col items-center justify-center'>
          <h1 className='text-center text-[clamp(45px,5vw,80px)] leading-none font-bold text-white uppercase'>
            {t.rich('title', { span: (chunks) => <span className='text-primary'>{chunks}</span> })}
          </h1>
          <div
            className='font-primary text-center text-[clamp(20px,1.5vw,25px)] font-medium'
            dangerouslySetInnerHTML={{ __html: t('description') }}
          />
        </div>
      </div>

      {process.env.NODE_ENV === 'development' && (
        <div className='relative z-10 mt-12 w-full rounded-2xl border border-red-500 bg-white p-5'>
          <div className='max-h-96 w-full overflow-y-auto'>
            <p className='text-red-400'>{t('error_description')}</p>

            <Collapsible defaultOpen>
              <CollapsibleTrigger>
                <p className='text-left text-sm text-gray-500 underline'>{error.message}</p>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <p>{error.stack}</p>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      )}
    </section>
  );
};

export default Error;
