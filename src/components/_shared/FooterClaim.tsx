import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import React from 'react';

import { FormattedText } from '@/components/_shared/FormattedText';
import { cn } from '@/lib/utils';
import { ClassNameProps } from '@/utils/types';

const FooterClaim = async ({ className }: ClassNameProps) => {
  const t = await getTranslations('home.footer-bg');
  return (
    <section
      className={cn(
        'max-w-container relative z-5 -mx-4 mt-28 h-[24.375rem] w-screen overflow-hidden sm:-mx-14 lg:mt-0 lg:h-[36.3rem]',
        className
      )}
    >
      <Image
        src='/images/feather-bg.webp'
        alt={t('alt')}
        className='absolute bottom-0 left-1/2 z-0 h-auto w-full max-w-[600px] min-w-[600px] -translate-x-1/2 lg:max-w-[1400px]'
        width={1400}
        height={1400}
      />
      <div className='absolute right-8 bottom-0 flex h-full w-fit items-center justify-end max-md:mb-4 sm:right-14 lg:right-[10%]'>
        <FormattedText
          text={t('claim')}
          as='h2'
          className='text-3xl font-text md:text-4xl'
        />
      </div>
    </section>
  );
};

export default FooterClaim;
