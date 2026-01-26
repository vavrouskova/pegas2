'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
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
  /* eslint-disable no-unused-vars */
  renderContent: (dataItem: T, translateFunction: (translateKey: string) => string) => ReactNode;
  renderImage?: (dataItem: T) => ReactNode;
  /* eslint-enable no-unused-vars */
  sectionClassName?: string;
  imageFirst?: boolean;
  asLink?: boolean;
}

const GenericCarouselSection = <T extends CarouselItemData>({
  data,
  carouselMaxWidth = 'max-w-80 md:max-w-[52.125rem]',
  articleClassName,
  renderContent,
  renderImage,
  sectionClassName,
  imageFirst = false,
  asLink = false,
}: GenericCarouselSectionProps<T>) => {
  const t = useTranslations('common');
  const { currentIndex, setApi, carouselRef, setIsHovering, goToSlide } = useCarouselAutoplay();

  const defaultRenderImage = (item: T) => (
    <picture className='relative aspect-square h-auto w-full'>
      <Image
        src={item.image}
        alt={item.title}
        fill
        sizes='(max-width: 768px) 160px, 256px'
        className='object-cover'
      />
    </picture>
  );

  return (
    <section className={cn('pt-12.5 pb-20.5 lg:pt-35 lg:pb-43', sectionClassName)}>
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
                {(() => {
                  const children = imageFirst ? (
                    <>
                      {renderImage ? renderImage(item) : defaultRenderImage(item)}
                      {renderContent(item, t)}
                    </>
                  ) : (
                    <>
                      {renderContent(item, t)}
                      {renderImage ? renderImage(item) : defaultRenderImage(item)}
                    </>
                  );
                  const className = cn('bg-primary group h-full overflow-hidden', articleClassName);

                  return asLink ? (
                    <Link href={item.link} className={cn(className, 'block')}>
                      {children}
                    </Link>
                  ) : (
                    <article className={className}>
                      {children}
                    </article>
                  );
                })()}
              </CarouselItem>
            ))}
          </CarouselContent>
          {data.length > 1 && (
            <CarouselNavigation
              itemsCount={data.length}
              currentIndex={currentIndex}
              onDotClick={goToSlide}
            />
          )}
        </Carousel>
      </div>
    </section>
  );
};

export default GenericCarouselSection;
