import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import React from 'react';

const FoundationSection = async () => {
  const t = await getTranslations('about-us');
  return (
    <section className='relative flex h-[60rem] items-end justify-end overflow-hidden px-0 sm:px-14 '>
      <Image
        src='/images/brand-wing.webp'
        alt='Foundation'
        width={1732}
        height={1400}
        className='absolute top-1/2 left-0 z-0 -translate-x-40 -translate-y-[40%] rotate-[39.027deg]'
      />
      <div className='bg-primary z-10 flex h-[28.3125rem] max-w-[43.25rem] items-center justify-center'>
        <div className='flex max-w-[28.375rem] flex-col gap-7 px-12 py-20'>
          <h2 className='text-3xl text-white'>{t('foundation.title')}</h2>
          <p className='text-white'>{t('foundation.description')}</p>
        </div>
      </div>
    </section>
  );
};

export default FoundationSection;
