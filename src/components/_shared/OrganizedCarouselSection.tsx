import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import React from 'react';

import Button from '@/components/_shared/Button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

const data = [
  {
    id: 1,
    title: 'Rozloučení s Jurajem Jakubiskem',
    where: 'Obřadní síň Strašnice, Praha',
    when: '10. 10. 2025',
    image: '/images/car.webp',
    link: '#',
  },
  {
    id: 2,
    title: 'Rozloučení s Jurajem Jakubiskem',
    where: 'Obřadní síň Strašnice, Praha',
    when: '10. 10. 2025',
    image: '/images/room.webp',
    link: '#',
  },
  {
    id: 3,
    title: 'Rozloučení s Jurajem Jakubiskem',
    where: 'Obřadní síň Strašnice, Praha',
    when: '10. 10. 2025',
    image: '/images/rose.webp',
    link: '#',
  },
];

const OrganizedCarouselSection = async () => {
  const t = await getTranslations('common');
  return (
    <section className='pt-16 pb-36'>
      <div className='relative'>
        <Carousel
          opts={{ align: 'start', loop: true }}
          className='mx-auto max-w-[52.125rem]'
        >
          <CarouselContent className='-ml-0'>
            {data.map((item) => (
              <CarouselItem
                key={item.id}
                className='basis-full pl-0'
              >
                <article className='group bg-primary overflow-hidden'>
                  <a
                    href={item.link}
                    className='flex items-center gap-4'
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={320}
                      height={320}
                      loading='lazy'
                      className='h-40 w-40 object-cover md:h-56 md:w-56'
                    />
                    <div className='flex-1 space-y-2 px-10 py-9'>
                      <h3 className='text-white-smoke text-lg font-semibold'>{item.title}</h3>
                      <p className='text-white-smoke text-sm'>{item.where}</p>
                      <p className='text-white-smoke text-sm'>{item.when}</p>
                      <Button
                        buttonText={t('find-out-more')}
                        className='-ml-8'
                      />
                    </div>
                  </a>
                </article>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className='left-2 hidden sm:inline-flex' />
          <CarouselNext className='right-2 hidden sm:inline-flex' />
        </Carousel>
      </div>
    </section>
  );
};

export default OrganizedCarouselSection;
