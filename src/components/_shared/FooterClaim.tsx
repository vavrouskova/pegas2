import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import React from 'react';

import FadeInOnScroll from '@/components/_shared/FadeInOnScroll';
import { FormattedText } from '@/components/_shared/FormattedText';
import { cn } from '@/lib/utils';
import { ClassNameProps } from '@/utils/types';

const FooterClaim = async ({ className }: ClassNameProps) => {
  const t = await getTranslations('home.footer-bg');
  return (
    <section
      className={cn('max-w-container relative z-5 -mx-4 h-[25rem] w-screen overflow-hidden sm:-mx-14', className)}
    >
      <FadeInOnScroll
        translateY={0}
        duration={0.8}
      >
        <Image
          src='/images/feather-bg.webp'
          alt={t('alt')}
          className='absolute bottom-0 left-1/2 z-0 h-auto w-full max-w-[900px] min-w-[900px] translate-x-[-60%] lg:max-w-[1400px] lg:-translate-x-1/2'
          width={1400}
          height={1400}
        />
      </FadeInOnScroll>
      <div className='absolute right-8 bottom-0 flex h-full w-fit items-center justify-end max-md:mb-24 sm:right-14 lg:right-[10%]'>
        <FadeInOnScroll delay={0.2}>
          <FormattedText
            text={t('claim')}
            as='h2'
            className='font-text text-3xl'
          />
        </FadeInOnScroll>
      </div>
    </section>
  );
};

export default FooterClaim;
