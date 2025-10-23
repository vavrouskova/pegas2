import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { FormattedText } from '@/components/_shared/FormattedText';
import { SluzbyPost } from '@/utils/wordpress-types';

interface ServicesSectionProps {
  services?: SluzbyPost[];
}

const ServicesSection = async ({ services = [] }: ServicesSectionProps) => {
  const t = await getTranslations('');

  if (!services || services.length === 0) {
    return null;
  }
  return (
    <section className='section-container'>
      <FormattedText
        text={t('home.services-nav.title')}
        as='h2'
        className='mb-9 text-3xl md:mb-40 md:text-center'
      />
      <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:flex'>
        {services.map((service) => (
          <Link
            href={service.slug}
            key={service.id}
            className='group flex flex-col gap-4 lg:flex-1'
          >
            <Image
              src={service.featuredImage?.node.sourceUrl || '/images/car.webp'}
              alt={service.featuredImage?.node.altText || service.title}
              width={400}
              height={400}
              className='h-auto w-full'
            />
            <FormattedText
              text={service.title}
              as='h3'
              className='text-2xl transition-opacity duration-300 group-hover:opacity-70'
            />
          </Link>
        ))}
        <Link
          href={t('routes.services')}
          className='group flex flex-col gap-4 lg:flex-1'
        >
          <div className='bg-primary flex aspect-square w-full items-center gap-2.5 self-stretch p-12' />
          <FormattedText
            text={t('home.services-nav.all-services')}
            as='h3'
            className='text-2xl transition-opacity duration-300 group-hover:opacity-70'
          />
        </Link>
      </div>
    </section>
  );
};

export default ServicesSection;
