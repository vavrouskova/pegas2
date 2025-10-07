'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import Button from '@/components/_shared/Button';
import GenericCarouselSection from '@/components/_shared/GenericCarouselSection';

interface OrganizedCarouselItemData {
  id: number;
  title: string;
  where: string;
  when: string;
  image: string;
  link: string;
}

const data: OrganizedCarouselItemData[] = [
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
  return (
    <GenericCarouselSection
      data={data}
      carouselMaxWidth='max-w-80 md:max-w-[52.125rem]'
      articleClassName='flex min-h-[10rem] items-stretch max-md:flex-col md:min-h-[16rem]'
      imageFirst
      renderImage={(item) => (
        <div className='relative aspect-square h-full flex-shrink-0 basis-[10rem] md:basis-[16rem]'>
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes='(max-width: 768px) 160px, 256px'
            className='object-cover'
          />
        </div>
      )}
      renderContent={(item, t) => (
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
      )}
    />
  );
};

export default OrganizedCarouselSection;
