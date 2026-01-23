import { useTranslations } from 'next-intl';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';

import Button from '@/components/_shared/Button';
import { Form } from '@/components/ui/form';

export interface BaseFormFieldProps {
  name: string;
  label?: string | React.ReactNode;
  placeholder?: string;
  validation?: any;
  disabled?: boolean;
  className?: string;
  tabIndex?: number;
}

interface BaseFormProps {
  // eslint-disable-next-line no-unused-vars
  onSubmit: (formValues: any) => Promise<any>;
  children?: React.ReactNode;
  form: UseFormReturn<any>;
  formName: string;
  className?: string;
  successText?: string;
  showGdprConsent?: boolean;
}

const BaseForm = (props: BaseFormProps) => {
  const { onSubmit, children, form, className, successText, showGdprConsent = true } = props;

  const [isSending, setIsSending] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [, forceUpdate] = useState(0);
  const successMessageRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('forms');

  useEffect(() => {
    if (isSubmitted && successMessageRef.current) {
      successMessageRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [isSubmitted]);

  const handleSubmit = async (values: any) => {
    try {
      setIsSending(true);
      await onSubmit(values);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSending(false);
    }
  };

  if (isSubmitted) {
    return (
      <div
        ref={successMessageRef}
        className={`mx-auto h-full w-full ${className ?? ''}`}
      >
        <div className='flex flex-col items-center justify-center py-12 text-center'>
          <h3 className='font-heading mb-4 text-2xl'>{successText || t('success.title')}</h3>
          <p className='font-text text-lg'>{t('success.description')}</p>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        autoComplete='off'
        className={`mx-auto w-full ${className}`}
        onSubmit={(event) => {
          form.handleSubmit(handleSubmit, () => {
            // eslint-disable-next-line sonarjs/no-nested-functions
            setTimeout(() => forceUpdate((n) => n + 1), 0);
          })(event);
        }}
      >
        {children}

        <div className='mt-8 flex flex-row items-center justify-between gap-4 lg:gap-8'>
          {showGdprConsent && (
            <p className='flex-1 text-right text-xs lg:text-base'>
              {t('gdpr-prefix')}{' '}
              <Link
                href='/zasady-ochrany-osobnich-udaju'
                className='font-text underline hover:no-underline'
                target='_blank'
              >
                {t('gdpr-link')}
              </Link>
              .
            </p>
          )}
          <Button
            buttonText={isSending ? 'Odesílám...' : t('button-text')}
            type='submit'
            className='bg-primary text-white-smoke hover:bg-primary/90 font-heading px-8 py-4 text-lg'
            disabled={isSending}
            aria-label={t('button-text')}
          ></Button>
        </div>
      </form>
    </Form>
  );
};

export default BaseForm;
