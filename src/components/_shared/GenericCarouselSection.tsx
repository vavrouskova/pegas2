'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React, { ReactNode } from 'react';

import { CarouselNavigation } from '@/components/_shared/CarouselNavigation';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { useCarouselAutoplay } from '@/hooks/useCarouselAutoplay';
import { cn } from '@/lib/utils';

interface CarouselItemData {
  id: number;
  title: string;
  image: string;
  link: string;
}

interface GenericCarouselSectionProps<T extends CarouselItemData> {
  data: T[];
  carouselMaxWidth?: string;
  articleClassName?: string;
  renderContent: (item: T, t: (key: string) => string) => ReactNode;
  renderImage?: (item: T) => ReactNode;
  sectionClassName?: string;
  imageFirst?: boolean;
}

const GenericCarouselSection = <T extends CarouselItemData>({
  data,
  carouselMaxWidth = 'max-w-80 md:max-w-[52.125rem]',
  articleClassName,
  renderContent,
  renderImage,
  sectionClassName,
  imageFirst = false,
}: GenericCarouselSectionProps<T>) => {
  const t = useTranslations('common');
  const { currentIndex, setApi, carouselRef, setIsHovering, goToSlide } = useCarouselAutoplay();

  const defaultRenderImage = (item: T) => (
    <div className='relative aspect-square h-full w-full'>
      <Image
        src={item.image}
        alt={item.title}
        fill
        sizes='(max-width: 768px) 160px, 256px'
        className='object-cover'
      />
    </div>
  );

  return (
    <section className={cn('py-16', sectionClassName)}>
      <div
        ref={carouselRef}
        className='relative'
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <Carousel
          opts={{ align: 'start', loop: true }}
          className={cn('mx-auto', carouselMaxWidth)}
          setApi={setApi}
        >
          <CarouselContent className='-ml-0'>
            {data.map((item) => (
              <CarouselItem
                key={item.id}
                className='basis-full pl-0'
              >
                <article className={cn('bg-primary group overflow-hidden', articleClassName)}>
                  {imageFirst ? (
                    <>
                      {renderImage ? renderImage(item) : defaultRenderImage(item)}
                      {renderContent(item, t)}
                    </>
                  ) : (
                    <>
                      {renderContent(item, t)}
                      {renderImage ? renderImage(item) : defaultRenderImage(item)}
                    </>
                  )}
                </article>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselNavigation
            itemsCount={data.length}
            currentIndex={currentIndex}
            onDotClick={goToSlide}
          />
        </Carousel>
      </div>
    </section>
  );
};

export default GenericCarouselSection;
