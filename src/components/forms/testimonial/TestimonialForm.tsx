'use client';

import { useTranslations } from 'next-intl';

import { FormattedText } from '@/components/_shared/FormattedText';
import BaseForm from '@/components/form-components/BaseForm';
import FormInput from '@/components/form-components/FormInput';
import FormTextarea from '@/components/form-components/FormTextarea';
import { useTestimonialForm } from '@/components/forms/testimonial/useForm';
import { cn } from '@/lib/utils';

interface TestimonialFormProps {
  className?: string;
}

const TestimonialForm = ({ className }: TestimonialFormProps) => {
  const { form, handleSubmit } = useTestimonialForm();
  const t = useTranslations('wrote-about-us.form');
  const tForms = useTranslations('forms');

  return (
    <section className={cn('section-container', className)}>
      <div className='max-w-dynamic-content mx-auto'>
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
          formName='testimonial-form'
        >
          <div className='flex flex-col gap-4'>
            <FormInput
              name='name'
              label={tForms('fields.name')}
              required
            />

            <FormInput
              name='email'
              label={tForms('fields.email')}
              type='email'
              required
            />

            <FormTextarea
              name='message'
              label={t('fields.message')}
              rows={6}
              required
            />
          </div>
        </BaseForm>
      </div>
    </section>
  );
};

export default TestimonialForm;
