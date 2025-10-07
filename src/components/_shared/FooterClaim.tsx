import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import React from 'react';

const FooterClaim = async () => {
  const t = await getTranslations('home.footer-bg');
  return (
    <section className='relative -mx-[calc(50vw-50%)] h-[24.375rem] w-screen overflow-hidden lg:h-[36.3rem]'>
      <Image
        src='/images/feather-bg.webp'
        alt='Footer background'
        className='absolute right-1/2 bottom-0 z-10 h-auto min-w-[600px] translate-x-1/2 lg:min-w-[1400px]'
        width={1400}
        height={1400}
      />
      <div className='absolute right-0 bottom-0 flex h-full w-fit items-center justify-end px-8 max-md:mb-4 md:px-20 lg:px-36 2xl:right-[10%]'>
        <h2 className='text-3xl font-thin md:text-4xl'>{t('claim')}</h2>
      </div>
    </section>
  );
};

export default FooterClaim;
