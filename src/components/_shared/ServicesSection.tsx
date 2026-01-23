import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import FadeInOnScroll from '@/components/_shared/FadeInOnScroll';
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
      <FadeInOnScroll>
        <FormattedText
          text={t('home.services-nav.title')}
          as='h2'
          className='mb-12 text-center md:mb-25'
        />
      </FadeInOnScroll>
      <FadeInOnScroll delay={0.15}>
        <div className='grid grid-cols-1 gap-7.5 md:grid-cols-2 lg:flex'>
          {services.map((service, index) => (
            <ServiceCard
              key={getUniqueId()}
              id={service.id}
              title={service.title}
              slug={service.slug}
              featuredImage={service.featuredImage}
              className='lg:flex-1'
              sectionTitle={t('tracking.section-our-services')}
              type='service'
              itemCategory2={t('tracking.category-services')}
              index={index}
            />
          ))}
          <Link
            href={`/${t('routes.services')}`}
            className='flex flex-col gap-2.5 transition-opacity duration-300 hover:opacity-80 lg:flex-1'
          >
            <div className='bg-grey-warm p-[13%]'>
              <div className='relative aspect-square w-full overflow-hidden'>
                <Image
                  src='/images/heart.webp'
                  alt={t('home.services-nav.all-services')}
                  fill
                  sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
                  className='object-cover'
                />
              </div>
            </div>
            <FormattedText
              text={t('home.services-nav.all-services')}
              as='h3'
              className='text-lg'
            />
          </Link>
        </div>
      </FadeInOnScroll>
    </section>
  );
};

export default ServicesSection;
