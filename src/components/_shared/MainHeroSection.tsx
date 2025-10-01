import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { PhoneNumber } from '@/lib/constants';

interface MainHeroSectionProps {
  title: string;
  description: string;
  className?: string;
}

const MainHeroSection = async ({ title, description, className }: MainHeroSectionProps) => {
  const t = await getTranslations('home.hero');

  return (
    <section className={className}>
      <div className='mt-[29.57rem] flex max-w-[36rem] flex-col justify-center gap-8'>
        <h1 className='whitespace-pre-line'>{title}</h1>
        <p className='text-xl whitespace-pre-line'>{description}</p>
        <div className='flex justify-between gap-4 text-lg'>
          <div className='flex flex-col'>
            <span className='leading-9'>{t('contact-us')}</span>
            <Link
              className='link'
              href={`tel:${PhoneNumber}`}
            >
              {PhoneNumber}
            </Link>
          </div>
          <div className='flex flex-col'>
            <span className='leading-9'>{t('prepare')}</span>
            <Link
              className='link'
              href='/'
            >
              {t('needed-documents')}
            </Link>
          </div>
          <div className='flex flex-col'>
            <span className='leading-9'>{t('visit-us')}</span>
            <Link
              className='link'
              href='/'
            >
              X {t('branches')}
            </Link>
          </div>
        </div>
      </div>
      <Image
        src='/images/wing.webp'
        alt='Background Image'
        width={2000}
        height={2000}
        className='absolute top-12 right-0 z-[-1] w-[81rem]'
      />
    </section>
  );
};

export default MainHeroSection;
