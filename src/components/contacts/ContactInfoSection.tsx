'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { FormattedText } from '@/components/_shared/FormattedText';

interface ContactInfoCardProps {
  title: string;
  items: Array<{
    type: 'text' | 'link' | 'phone' | 'email';
    content: string;
    href?: string;
  }>;
}

const ContactInfoCard = ({ title, items }: Readonly<ContactInfoCardProps>) => {
  return (
    <div className='flex w-full max-w-[22.8125rem] flex-col'>
      <FormattedText
        text={title}
        as='h3'
        className='text-primary mb-12 text-[1.375rem] font-black leading-[1.5] tracking-[0.04375rem]'
      />
      <div className='flex flex-col gap-2'>
        {items.map((item, index) => {
          if (item.type === 'link' && item.href) {
            return (
              <Link
                key={index}
                href={item.href}
                className='text-primary text-[0.9375rem] leading-[1.8] tracking-[0.04375rem] underline decoration-from-font transition-opacity hover:opacity-70'
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
                className='text-primary text-[0.9375rem] font-black leading-[1.5] tracking-[0.04375rem] underline decoration-from-font transition-opacity hover:opacity-70'
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
                className='text-primary text-[0.9375rem] font-black leading-[1.5] tracking-[0.04375rem] underline decoration-from-font transition-opacity hover:opacity-70'
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
              className='text-primary text-[0.9375rem] leading-[1.8] tracking-[0.04375rem]'
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
      { type: 'text' as const, content: t('billing-address.ico') },
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
      },
    ],
  };

  const contactInfo = {
    title: t('contact-info.title'),
    items: [
      { type: 'text' as const, content: t('contact-info.phone') },
      { type: 'text' as const, content: t('contact-info.email') },
      { type: 'text' as const, content: t('contact-info.data-box') },
    ],
  };

  const coolingFacility = {
    title: t('cooling-facility.title'),
    items: [
      { type: 'text' as const, content: t('cooling-facility.address') },
      { type: 'text' as const, content: t('cooling-facility.hours') },
      { type: 'text' as const, content: t('cooling-facility.phone') },
      {
        type: 'link' as const,
        content: t('cooling-facility.map-link'),
        href: t('cooling-facility.map-url'),
      },
    ],
  };

  const repatriation = {
    title: t('repatriation.title'),
    items: [
      { type: 'text' as const, content: t('repatriation.address') },
      { type: 'text' as const, content: t('repatriation.coordinator-name') },
      { type: 'text' as const, content: t('repatriation.coordinator-title') },
      {
        type: 'phone' as const,
        content: t('repatriation.phone1'),
        href: t('repatriation.phone1-raw'),
      },
      {
        type: 'phone' as const,
        content: t('repatriation.phone2'),
        href: t('repatriation.phone2-raw'),
      },
      {
        type: 'email' as const,
        content: t('repatriation.email'),
        href: t('repatriation.email'),
      },
    ],
  };

  return (
    <section className='section-container pb-40'>
      <div className='flex flex-wrap gap-y-16 gap-x-8 lg:gap-y-32 lg:gap-x-9'>
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
        />
      </div>
    </section>
  );
};

export default ContactInfoSection;
