'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { FormattedText } from '@/components/_shared/FormattedText';
import { cn } from '@/lib/utils';

interface ContactInfoCardProps {
  title: string;
  items: Array<{
    type: 'text' | 'link' | 'phone' | 'email';
    content: string;
    href?: string;
    marginTop?: string;
    large?: boolean;
    bold?: boolean;
  }>;
  className?: string;
}

const ContactInfoCard = ({ title, items, className }: Readonly<ContactInfoCardProps>) => {
  return (
    <div className={cn('flex w-full flex-col', className)}>
      <FormattedText
        text={title}
        as='h3'
        className='mb-4'
      />
      <div className='flex flex-col'>
        {items.map((item, index) => {
          if (item.type === 'link' && item.href) {
            return (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  'font-text text-sm underline hover:no-underline',
                  item.marginTop,
                  item.large && 'text-lg'
                )}
                target='_blank'
                rel='noopener noreferrer'
              >
                {item.content}
              </Link>
            );
          }

          if (item.type === 'phone' && item.href) {
            return (
              <Link
                key={index}
                href={`tel:${item.href}`}
                className={cn('text-sm underline hover:no-underline', item.marginTop, item.large && 'text-lg')}
              >
                {item.content}
              </Link>
            );
          }

          if (item.type === 'email' && item.href) {
            return (
              <Link
                key={index}
                href={`mailto:${item.href}`}
                className={cn('text-sm underline hover:no-underline', item.marginTop, item.large && 'text-lg')}
              >
                {item.content}
              </Link>
            );
          }

          return (
            <FormattedText
              key={index}
              text={item.content}
              as='p'
              className={cn('text-sm', item.bold && 'font-heading', item.marginTop, item.large && 'text-lg')}
            />
          );
        })}
      </div>
    </div>
  );
};

const ContactInfoSection = () => {
  const t = useTranslations('contacts.info-section');

  const billingAddress = {
    title: t('billing-address.title'),
    items: [
      { type: 'text' as const, content: t('billing-address.company') },
      { type: 'text' as const, content: t('billing-address.address') },
      { type: 'text' as const, content: t('billing-address.ico'), marginTop: 'mt-5' },
      { type: 'text' as const, content: t('billing-address.dic') },
      { type: 'text' as const, content: t('billing-address.account') },
      { type: 'text' as const, content: t('billing-address.registry') },
    ],
  };

  const correspondenceAddress = {
    title: t('correspondence-address.title'),
    items: [
      { type: 'text' as const, content: t('correspondence-address.company') },
      { type: 'text' as const, content: t('correspondence-address.address') },
      {
        type: 'link' as const,
        content: t('correspondence-address.map-link'),
        href: t('correspondence-address.map-url'),
        marginTop: 'mt-5',
      },
    ],
  };

  const contactInfo = {
    title: t('contact-info.title'),
    items: [
      { type: 'phone' as const, content: t('contact-info.phone'), href: '+420800176423' },
      { type: 'email' as const, content: t('contact-info.email'), href: t('contact-info.email') },
      { type: 'text' as const, content: t('contact-info.data-box'), marginTop: 'mt-5' },
    ],
  };

  const coolingFacility = {
    title: t('cooling-facility.title'),
    items: [
      { type: 'text' as const, content: t('cooling-facility.address') },
      { type: 'text' as const, content: t('cooling-facility.hours'), marginTop: 'mt-5' },
      { type: 'text' as const, content: t('cooling-facility.phone') },
      {
        type: 'link' as const,
        content: t('cooling-facility.map-link'),
        href: t('cooling-facility.map-url'),
        marginTop: 'mt-5',
      },
    ],
  };

  const repatriation = {
    title: t('repatriation.title'),
    items: [
      { type: 'text' as const, content: t('repatriation.address') },
      {
        type: 'text' as const,
        content: t('repatriation.coordinator-name'),
        marginTop: 'mt-5',
        bold: true,
        large: true,
      },
      { type: 'text' as const, content: t('repatriation.coordinator-title'), large: true },
      {
        type: 'phone' as const,
        content: t('repatriation.phone1'),
        href: t('repatriation.phone1-raw'),
        marginTop: 'mt-5',
        large: true,
      },
      {
        type: 'phone' as const,
        content: t('repatriation.phone2'),
        href: t('repatriation.phone2-raw'),
        marginTop: 'mt-2.5',
        large: true,
      },
      {
        type: 'email' as const,
        content: t('repatriation.email'),
        href: t('repatriation.email'),
        marginTop: 'mt-2.5',
        large: true,
      },
    ],
  };

  return (
    <section className='section-container pb-40'>
      <FormattedText
        text={t('title')}
        as='h2'
        className='mb-25 text-center'
      />
      <div className='grid grid-cols-1 gap-x-8 gap-y-12.5 lg:grid-cols-3 lg:gap-x-9 lg:gap-y-32'>
        <ContactInfoCard
          title={billingAddress.title}
          items={billingAddress.items}
        />
        <ContactInfoCard
          title={correspondenceAddress.title}
          items={correspondenceAddress.items}
        />
        <ContactInfoCard
          title={contactInfo.title}
          items={contactInfo.items}
        />
        <ContactInfoCard
          title={coolingFacility.title}
          items={coolingFacility.items}
        />
        <ContactInfoCard
          title={repatriation.title}
          items={repatriation.items}
          className='lg:col-span-2'
        />
      </div>
    </section>
  );
};

export default ContactInfoSection;
