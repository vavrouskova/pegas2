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
    title: 'Rozloučení s A. Švehlíkem',
    description:
      'Připomeňte si smuteční obřad věnovaný herci a umělci národního divadla, který se uskutečnil na prknech, která znamenají svět.',
    image: '/images/blog.webp',
    link: '#',
  },
  {
    id: 2,
    title: 'Rozloučení s Jurajem Jakubiskem',
    description:
      'Připomeňte si smuteční obřad věnovaný herci a umělci národního divadla, který se uskutečnil na prknech, která znamenají svět.',
    image: '/images/room.webp',
    link: '#',
  },
  {
    id: 3,
    title: 'Rozloučení s Jurajem Jakubiskem',
    description:
      'Připomeňte si smuteční obřad věnovaný herci a umělci národního divadla, který se uskutečnil na prknech, která znamenají svět.',
    image: '/images/rose.webp',
    link: '#',
  },
];

const BlogCarouselSection = () => {
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
          className='mx-auto max-lg:max-w-[28.375rem]'
          setApi={setApi}
        >
          <CarouselContent className='-ml-0'>
            {data.map((item) => (
              <CarouselItem
                key={item.id}
                className='basis-full pl-0'
              >
                <article className='group bg-primary flex flex-col-reverse items-center overflow-hidden lg:grid lg:grid-cols-2'>
                  <div className='mx-auto flex-1 space-y-2 px-4 py-8 lg:max-w-[28.375rem] lg:px-10'>
                    <h3 className='text-white-smoke mb-6 text-2xl'>{item.title}</h3>
                    <p className='text-tertiary text-lg'>{item.description}</p>
                    <Link href={item.link}>
                      <Button
                        buttonText={t('find-out-more')}
                        className='-ml-8'
                      />
                    </Link>
                  </div>
                  <div className='relative aspect-square h-full w-full'>
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes='(max-width: 768px) 160px, 256px'
                      className='object-cover'
                    />
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

export default BlogCarouselSection;
