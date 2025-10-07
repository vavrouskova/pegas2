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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [isHovering, setIsHovering] = useState(false);
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

  React.useEffect(() => {
    if (!api) return;
    const interval = setInterval(() => {
      if (isHovering) return;
      api.scrollNext();
    }, 6000);
    return () => clearInterval(interval);
  }, [api, isHovering]);
  return (
    <section className='pt-16 pb-36'>
      <div
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
          <CarouselPrevious
            variant='ghost'
            className='top-full left-1/2 mt-2 -translate-x-[6.75rem] translate-y-0'
          />
          <CarouselNext
            variant='ghost'
            className='top-full left-1/2 mt-2 translate-x-[4.75rem] translate-y-0'
          />

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

export default BlogCarouselSection;
