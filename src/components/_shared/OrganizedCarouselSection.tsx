'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

import Button from '@/components/_shared/Button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi | null>(null);
  const t = useTranslations('common');

  const goToSlide = (index: number) => {
    if (api) api.scrollTo(index);
  };

  React.useEffect(() => {
    if (!api) return;
    const handleSelect = () => setCurrentIndex(api.selectedScrollSnap());
    handleSelect();
    api.on('select', handleSelect);
    api.on('reInit', handleSelect);
    return () => {
      api.off('select', handleSelect);
      api.off('reInit', handleSelect);
    };
  }, [api]);
  return (
    <section className='pt-16 pb-36'>
      <div className='relative'>
        <Carousel
          opts={{ align: 'start', loop: true }}
          className='mx-auto max-w-[52.125rem]'
          setApi={setApi}
        >
          <CarouselContent className='-ml-0'>
            {data.map((item) => (
              <CarouselItem
                key={item.id}
                className='basis-full pl-0'
              >
                <article className='group bg-primary flex min-h-[10rem] items-stretch gap-4 overflow-hidden max-md:flex-col md:min-h-[16rem]'>
                  <div className='relative aspect-square h-full flex-shrink-0 basis-[10rem] md:basis-[16rem]'>
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes='(max-width: 768px) 160px, 256px'
                      loading='lazy'
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
          <CarouselPrevious className='top-full left-1/2 mt-2 -translate-x-[6.75rem] translate-y-0' />
          <CarouselNext className='top-full left-1/2 mt-2 translate-x-[4.75rem] translate-y-0' />

          {data.length > 1 && (
            <div className='absolute -bottom-7 left-1/2 flex -translate-x-1/2 space-x-2.5'>
              {data.map((_, index) => (
                <span
                  key={`slide n.${index + 1}`}
                  onClick={() => goToSlide(index)}
                  className={`h-1.5 w-3 cursor-pointer rounded-full transition-all duration-500 ${currentIndex === index ? 'bg-primary w-6' : 'bg-white'}`}
                />
              ))}
            </div>
          )}
        </Carousel>
      </div>
    </section>
  );
};

export default OrganizedCarouselSection;
