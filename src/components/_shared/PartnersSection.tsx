import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import React from 'react';

const PartnersSection = async () => {
  const t = await getTranslations('about-us');

  return (
    <section className='section-container pt-44 lg:pt-72 lg:pb-30'>
      <h2 className='mb-24 text-3xl lg:text-center'>{t('partners.title')}</h2>
      <div className='mx-auto grid max-w-[1000px] grid-cols-2 gap-4 md:grid-cols-4'>
        <picture className='flex items-center justify-center'>
          <Image
            src='/images/effs.webp'
            alt='Effs'
            width={132}
            height={132}
            className='mix-blend-darken'
          />
        </picture>
        <picture className='flex items-center justify-center'>
          <Image
            src='/images/csups.webp'
            alt='Csup'
            width={132}
            height={132}
            className='mix-blend-darken'
          />
        </picture>
        <picture className='flex items-center justify-center'>
          <Image
            src='/images/pmu.webp'
            alt='PMU'
            width={132}
            height={132}
            className='mix-blend-darken'
          />
        </picture>
        <picture className='flex items-center justify-center'>
          <Image
            src='/images/sp.webp'
            alt='SP'
            width={132}
            height={132}
            className='mix-blend-darken'
          />
        </picture>
      </div>
    </section>
  );
};

export default PartnersSection;
