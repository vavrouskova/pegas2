'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

import Button from '@/components/_shared/Button';
import { sendGTMEventFunction } from '@/components/gtm/GoogleTagManagerComponent';
import { Form } from '@/components/ui/form';
import { useRouter } from '@/i18n/routing';
import { storeFormLeadData } from '@/utils/datalayer';
import { useEvents } from '@/utils/events';

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
  redirectUrl?: string;
}

const BaseForm = (props: BaseFormProps) => {
  const { onSubmit, children, form, className, successText, showGdprConsent = true, redirectUrl, formName } = props;

  const router = useRouter();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { submitEvent } = useEvents(formName);
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
    if (!executeRecaptcha) {
      console.log('ReCaptcha not ready');
      return;
    }

    try {
      const gRecaptchaToken = await executeRecaptcha('inquirySubmit');
      const recaptchaResponse = await fetch('/api/v1/recaptcha-submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gRecaptchaToken }),
      }).then((response) => response.json());

      if (recaptchaResponse?.success === true) {
        console.log(`ReCaptcha succeeded with score: ${recaptchaResponse?.score}`);
      } else {
        console.log(`ReCaptcha failed with score: ${recaptchaResponse?.score}`);
        throw new Error('ReCaptcha validation failed');
      }

      if (values.website) {
        toast.error(t('flash.bot_detected'));
        return;
      }

      setIsSending(true);
      const response = await onSubmit({ ...values, pageUrl: window.location.href });

      if (response?.errors) {
        toast.warning(t('flash.form_error'));
      } else {
        if (redirectUrl) {
          storeFormLeadData(values.email || '', values.phone || '');
          router.push(redirectUrl as any);
        } else {
          setIsSubmitted(true);
        }
        submitEvent();
      }
    } catch {
      toast.error(t('flash.error'));
    } finally {
      sendGTMEventFunction({
        event: 'app_form_submit',
        form_name: formName,
        type: values.type || 'offer',
      });
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
