import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import React from 'react';

const FooterClaim = async () => {
  const t = await getTranslations('home.footer-bg');
  return (
    <section className='relative h-[36.3rem] w-full'>
      <Image
        src='/images/feather-bg.webp'
        alt='Footer background'
        fill
        className='absolute bottom-0 left-0 h-full w-full object-contain object-bottom-left'
      />
      <div className='absolute bottom-0 left-0 flex h-full w-full items-center justify-end px-36'>
        <h2 className='text-4xl font-thin'>{t('claim')}</h2>
      </div>
    </section>
  );
};

export default FooterClaim;
