import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import React from 'react';

import { FormattedText } from '@/components/_shared/FormattedText';
import ServiceCard from '@/components/_shared/ServiceCard';
import { getUniqueId } from '@/utils/helper';
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
    <section className='px-14 py-12.5 lg:py-35'>
      <FormattedText
        text={t('home.services-nav.title')}
        as='h2'
        className='mb-12 text-center md:mb-25'
      />
      <div className='grid grid-cols-1 gap-7.5 md:grid-cols-2 lg:flex'>
        {services.map((service) => (
          <ServiceCard
            key={getUniqueId()}
            id={service.id}
            title={service.title}
            slug={service.slug}
            featuredImage={service.featuredImage}
            className='lg:flex-1'
          />
        ))}
        <Link
          href={t('routes.services')}
          className='flex flex-col gap-2.5 transition-opacity duration-300 hover:opacity-70 lg:flex-1'
        >
          <div className='bg-primary flex aspect-square w-full items-center gap-2.5 self-stretch p-12' />
          <FormattedText
            text={t('home.services-nav.all-services')}
            as='h3'
            className='text-lg'
          />
        </Link>
      </div>
    </section>
  );
};

export default ServicesSection;
