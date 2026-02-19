'use client';

import Image from 'next/image';
import React from 'react';

import { FormattedText } from '@/components/_shared/FormattedText';
import GenericCarouselSection from '@/components/_shared/GenericCarouselSection';
import ArrowRight from '@/components/icons/ArrowRight';
import type { SliderSlide } from '@/utils/wordpress-types';

interface SliderCarouselItemData {
  id: number;
  title: string;
  description?: string;
  image: string;
  link: string;
  linkTarget?: string;
  linkTitle?: string;
}

interface HomepageSliderSectionProps {
  slides?: SliderSlide[];
}

function convertToCarouselData(slides: SliderSlide[]): SliderCarouselItemData[] {
  return slides.map((slide, index) => ({
    id: index,
    title: slide.slideTitle || '',
    description: slide.slideDescription,
    image: slide.slideImage?.node?.sourceUrl || '/images/placeholder.webp',
    link: slide.slideLink?.url || '#',
    linkTarget: slide.slideLink?.target,
    linkTitle: slide.slideLink?.title,
  }));
}

const HomepageSliderSection = ({ slides }: HomepageSliderSectionProps) => {
  if (!slides || slides.length === 0) {
    return null;
  }

  const data = convertToCarouselData(slides);

  return (
    <GenericCarouselSection
      data={data}
      carouselMaxWidth='max-w-88 lg:max-w-[48.1875rem]'
      articleClassName='flex min-h-[10rem] mx-auto items-stretch max-lg:flex-col lg:max-h-[14.375rem]'
      imageFirst
      asLink
      renderImage={(item) => (
        <picture className='relative aspect-square h-auto w-full lg:max-h-57.5 lg:max-w-57.5'>
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes='(max-width: 768px) 160px, 256px'
            className='object-cover'
          />
        </picture>
      )}
      renderContent={(item, t) => (
        <div className='flex flex-1 flex-col justify-between space-y-2 px-4 py-5 max-lg:h-full lg:px-17.5 lg:py-7.5'>
          <div className='flex flex-col'>
            <FormattedText
              text={item.title}
              as='h3'
              className='text-white-smoke mb-2.5 text-xl'
            />
            {item.description && (
              <FormattedText
                text={item.description}
                as='p'
                className='font-text text-lg text-white'
              />
            )}
          </div>
          <div className='text-white-smoke flex items-center gap-3'>
            <span className='text-white-smoke font-heading text-lg'>{t('find-out-more')}</span>
            <ArrowRight className='size-5 shrink-0' />
          </div>
        </div>
      )}
    />
  );
};

export default HomepageSliderSection;
