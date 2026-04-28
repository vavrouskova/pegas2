'use client';

import { useTranslations } from 'next-intl';

import { useFlowerForm } from '@/components/ceremonies/flower-form/useFlowerForm';
import BaseForm from '@/components/form-components/BaseForm';
import FormInput from '@/components/form-components/FormInput';
import FormTextarea from '@/components/form-components/FormTextarea';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Ceremony } from '@/types/ceremony';
import { formatCeremonyDateLong, formatCeremonyTime } from '@/utils/ceremonies/format';

interface FlowerFormProps {
  ceremony: Ceremony;
}

const FlowerForm = ({ ceremony }: FlowerFormProps) => {
  const t = useTranslations('ceremonies.flower-form');
  const { form, handleSubmit } = useFlowerForm();

  const bouquetOptions: { value: string; labelKey: 'small' | 'medium' | 'large' | 'wreath' }[] = [
    { value: 'small', labelKey: 'small' },
    { value: 'medium', labelKey: 'medium' },
    { value: 'large', labelKey: 'large' },
    { value: 'wreath', labelKey: 'wreath' },
  ];

  return (
    <section className='section-container'>
      <div className='max-w-dynamic-content mx-auto'>
        <div className='mb-12 flex flex-col gap-2.5'>
          <h1 className='font-heading text-primary text-3xl lg:text-4xl'>{t('title')}</h1>
          <p className='font-text text-base'>{t('description')}</p>
        </div>

        <div className='bg-grey-warm mb-10 flex flex-col gap-2 p-6'>
          <span className='font-heading text-primary text-base'>{t('ceremony-label')}</span>
          <p className='font-text text-base'>
            {`${ceremony.person.firstName} ${ceremony.person.lastName}`}
            {' — '}
            {formatCeremonyDateLong(ceremony.startAt)}, {formatCeremonyTime(ceremony.startAt)}
            {', '}
            {ceremony.venue.name}
          </p>
          {ceremony.flowerOrderDeadline && (
            <p className='font-text text-primary/70 text-sm'>
              {t('deadline-label')}: {formatCeremonyDateLong(ceremony.flowerOrderDeadline)},{' '}
              {formatCeremonyTime(ceremony.flowerOrderDeadline)}
            </p>
          )}
        </div>

        <BaseForm
          onSubmit={async (values) => {
            await handleSubmit({ ...values, ceremonySlug: ceremony.slug });
          }}
          form={form}
          formName='flower-form'
        >
          <div className='flex flex-col gap-4'>
            <FormInput
              name='name'
              label={t('fields.name')}
              required
            />

            <div className='grid grid-cols-1 gap-10 lg:grid-cols-2'>
              <FormInput
                name='email'
                label={t('fields.email')}
                type='email'
                required
              />
              <FormInput
                name='phone'
                label={t('fields.phone')}
                type='tel'
                required
              />
            </div>

            <FormField
              name='bouquet'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel className='font-heading text-primary text-base'>
                    {t('fields.bouquet')}
                  </FormLabel>
                  <FormControl>
                    <div className='flex flex-col gap-2'>
                      {bouquetOptions.map((option) => (
                        <label
                          key={option.value}
                          className='flex cursor-pointer items-center gap-3 bg-white p-4 transition-opacity hover:opacity-80'
                        >
                          <input
                            type='radio'
                            value={option.value}
                            checked={field.value === option.value}
                            onChange={() => field.onChange(option.value)}
                            className='accent-primary'
                          />
                          <span className='font-text text-primary text-base'>
                            {t(`bouquets.${option.labelKey}`)}
                          </span>
                        </label>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage className='text-sm text-red-600' />
                </FormItem>
              )}
            />

            <FormInput
              name='ribbon'
              label={t('fields.ribbon')}
              placeholder={t('fields.ribbon-placeholder')}
            />

            <FormTextarea
              name='message'
              label={t('fields.message')}
              rows={4}
            />
          </div>
        </BaseForm>
      </div>
    </section>
  );
};

export default FlowerForm;
