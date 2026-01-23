'use client';

import { AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import React, { useRef, useState } from 'react';

import { FormattedText } from '@/components/_shared/FormattedText';
import { MotionDiv } from '@/components/animate-ui/MotionWrappers';
import BaseForm from '@/components/form-components/BaseForm';
import FormInput from '@/components/form-components/FormInput';
import FormTextarea from '@/components/form-components/FormTextarea';
import { useContactForm } from '@/components/forms/contact/useForm';
import Calendar from '@/components/icons/Calendar';
import ChevronDown from '@/components/icons/ChevronDown';
import { cn } from '@/lib/utils';

interface ContactFormProps {
  className?: string;
}

const ContactForm = (props: ContactFormProps) => {
  const { className } = props;
  const { form, handleSubmit } = useContactForm();
  const t = useTranslations('forms');
  const [isFarewellSectionOpen, setIsFarewellSectionOpen] = useState(false);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const handleCalendarClick = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker?.();
    }
  };

  return (
    <section className={cn('section-container', className)}>
      <div className='max-w-dynamic-content mx-auto'>
        {/* Title and Description */}
        <div className='mb-12 flex flex-col gap-2.5'>
          <FormattedText
            text={t('title')}
            as='h2'
          />
          <FormattedText
            text={t('description')}
            as='p'
          />
        </div>

        <BaseForm
          onSubmit={async (values) => {
            await handleSubmit(values);
          }}
          form={form}
          formName='contact-form'
          redirectUrl='/thank-you'
        >
          <div className='flex flex-col gap-4'>
            {/* Name - Full Width */}
            <FormInput
              name='name'
              label={t('fields.name')}
              required
            />

            {/* Phone and Email - Side by Side on Desktop */}
            <div className='grid grid-cols-1 gap-10 lg:grid-cols-2'>
              <FormInput
                name='phone'
                label={t('fields.phone')}
                type='tel'
              />
              <FormInput
                name='email'
                label={t('fields.email')}
                type='email'
                required
              />
            </div>

            {/* Message - Full Width */}
            <FormTextarea
              name='message'
              label={t('fields.message')}
              rows={4}
            />

            {/* Collapsible Farewell Section */}
            <div className='mt-7.5 bg-white'>
              <button
                type='button'
                onClick={() => setIsFarewellSectionOpen(!isFarewellSectionOpen)}
                className='hover:bg-grey-warm/30 border-grey-warm flex w-full items-center justify-between border-b p-5 text-left transition-colors'
              >
                <FormattedText
                  text={t('farewell-title')}
                  as='h3'
                  className='font-heading text-lg'
                />
                <MotionDiv
                  animate={{ rotate: isFarewellSectionOpen ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <ChevronDown className='text-primary' />
                </MotionDiv>
              </button>

              <AnimatePresence initial={false}>
                {isFarewellSectionOpen && (
                  <MotionDiv
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      height: { duration: 0.4, ease: 'easeInOut' },
                      opacity: { duration: 0.3, ease: 'easeInOut' },
                    }}
                    className='overflow-hidden'
                  >
                    <div className='bg-white p-5 lg:p-10'>
                      <MotionDiv
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.3 }}
                      >
                        <FormattedText
                          text={t('farewell-description')}
                          as='p'
                          className='mb-8'
                        />
                      </MotionDiv>

                      <MotionDiv
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                        className='flex flex-col gap-4'
                      >
                        <FormInput
                          name='deceasedName'
                          label={t('fields.deceased-name')}
                        />

                        <div className='relative'>
                          <div
                            onClick={handleCalendarClick}
                            className='absolute bottom-6 left-5.25 z-10 cursor-pointer'
                          >
                            <Calendar className='text-primary size-6' />
                          </div>
                          <FormInput
                            name='deceasedDate'
                            label={t('fields.deceased-date')}
                            type='date'
                            inputRef={dateInputRef}
                            inputClassName='pl-14 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-datetime-edit-fields-wrapper]:opacity-0 [&::-webkit-datetime-edit-text]:opacity-0 [&::-webkit-datetime-edit-month-field]:opacity-0 [&::-webkit-datetime-edit-day-field]:opacity-0 [&::-webkit-datetime-edit-year-field]:opacity-0 [&:not(:placeholder-shown)::-webkit-datetime-edit-fields-wrapper]:opacity-100 [&:not(:placeholder-shown)::-webkit-datetime-edit-text]:opacity-100 [&:not(:placeholder-shown)::-webkit-datetime-edit-month-field]:opacity-100 [&:not(:placeholder-shown)::-webkit-datetime-edit-day-field]:opacity-100 [&:not(:placeholder-shown)::-webkit-datetime-edit-year-field]:opacity-100'
                          />
                        </div>

                        <FormInput
                          name='deceasedPlace'
                          label={t('fields.deceased-place')}
                        />

                        <FormInput
                          name='note'
                          label={t('fields.note')}
                        />
                      </MotionDiv>
                    </div>
                  </MotionDiv>
                )}
              </AnimatePresence>
            </div>
          </div>
        </BaseForm>
      </div>
    </section>
  );
};

export default ContactForm;
