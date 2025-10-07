import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const data = [
  {
    id: 1,
    title: 'Převoz zesnulých',
    image: '/images/car.webp',
    alt: 'Převoz zesnulých',
    link: 'sluzby',
  },
  {
    id: 2,
    title: 'Převoz zesnulých',
    image: '/images/car.webp',
    alt: 'Převoz zesnulých',
    link: 'sluzby',
  },
  {
    id: 3,
    title: 'Převoz zesnulých',
    image: '/images/car.webp',
    alt: 'Převoz zesnulých',
    link: 'sluzby',
  },
];

const ServicesSection = async () => {
  const t = await getTranslations('');
  return (
    <section>
      <h2 className='mb-9 text-3xl md:mb-40 md:text-center'>{t('home.services-nav.title')}</h2>
      <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:flex'>
        {data.map((item) => (
          <Link
            href={item.link}
            key={item.id}
            className='group flex flex-col gap-4 lg:flex-1'
          >
            <Image
              src={item.image}
              alt={item.alt}
              width={400}
              height={400}
              className='h-auto w-full'
            />
            <h3 className='text-2xl transition-opacity duration-300 group-hover:opacity-70'>{item.title}</h3>
          </Link>
        ))}
        <Link
          href={t('routes.services')}
          className='group flex flex-col gap-4 lg:flex-1'
        >
          <div className='bg-primary flex aspect-square w-full items-center gap-2.5 self-stretch p-12' />
          <h3 className='text-2xl transition-opacity duration-300 group-hover:opacity-70'>
            {t('home.services-nav.all-services')}
          </h3>
        </Link>
      </div>
    </section>
  );
};

export default ServicesSection;
