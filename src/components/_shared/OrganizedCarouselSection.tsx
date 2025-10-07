'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import Button from '@/components/_shared/Button';
import { CarouselNavigation } from '@/components/_shared/CarouselNavigation';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { useCarouselAutoplay } from '@/hooks/useCarouselAutoplay';

const data = [
  {
    id: 1,
    title: 'Rozloučení s Jurajem Jakubiskem',
    where: 'Obřadní síň Strašnice, Praha',
    when: 'Středa 10. 10. 2025 - 10:00',
    image: '/images/car.webp',
    link: '#',
  },
  {
    id: 2,
    title: 'Rozloučení s Jurajem Jakubiskem',
    where: 'Obřadní síň Strašnice, Praha',
    when: 'Středa 10. 10. 2025 - 10:00',
    image: '/images/room.webp',
    link: '#',
  },
  {
    id: 3,
    title: 'Rozloučení s Jurajem Jakubiskem',
    where: 'Obřadní síň Strašnice, Praha',
    when: 'Středa 10. 10. 2025 - 10:00',
    image: '/images/rose.webp',
    link: '#',
  },
];

const OrganizedCarouselSection = () => {
  const t = useTranslations('common');
  const { currentIndex, setApi, carouselRef, setIsHovering, goToSlide } = useCarouselAutoplay();
  return (
    <section className='pt-16 pb-36'>
      <div
        ref={carouselRef}
        className='relative'
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <Carousel
          opts={{ align: 'start', loop: true }}
          className='mx-auto max-w-80 md:max-w-[52.125rem]'
          setApi={setApi}
        >
          <CarouselContent className='-ml-0'>
            {data.map((item) => (
              <CarouselItem
                key={item.id}
                className='basis-full pl-0'
              >
                <article className='group bg-primary flex min-h-[10rem] items-stretch overflow-hidden max-md:flex-col md:min-h-[16rem]'>
                  <div className='relative aspect-square h-full flex-shrink-0 basis-[10rem] md:basis-[16rem]'>
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes='(max-width: 768px) 160px, 256px'
                      className='object-cover'
                    />
                  </div>
                  <div className='flex-1 space-y-2 px-4 py-5 md:px-10 md:py-9'>
                    <h3 className='text-white-smoke mb-6 text-2xl'>{item.title}</h3>
                    <p className='text-tertiary text-lg'>
                      <span className='font-heading text-white-smoke'>{t('where')}:</span> {item.where}
                    </p>
                    <p className='text-tertiary text-lg'>
                      <span className='font-heading text-white-smoke'>{t('when')}:</span> {item.when}
                    </p>
                    <Link href={item.link}>
                      <Button
                        buttonText={t('find-out-more')}
                        className='-ml-8'
                      />
                    </Link>
                  </div>
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

export default OrganizedCarouselSection;
