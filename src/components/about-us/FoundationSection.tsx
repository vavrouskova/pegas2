import { getTranslations } from 'next-intl/server';
import Image from 'next/image';

import { czechTypography } from '@/lib/utils';

const FoundationSection = async () => {
  const t = await getTranslations('about-us');
  return (
    <section className='relative flex h-[40rem] items-end justify-end overflow-hidden px-0 sm:px-14 lg:h-[60rem] '>
      <Image
        src='/images/brand-wing.webp'
        alt='Foundation'
        width={1732}
        height={1400}
        className='absolute top-1/2 left-0 z-0 min-w-[600px] -translate-x-72 -translate-y-1/2 rotate-[39.027deg] sm:-translate-x-80 md:-translate-y-[40%]'
      />
      <div className='bg-primary z-10 flex w-full max-w-[43.25rem] items-center justify-center lg:h-[28.3125rem] lg:min-w-[43.25rem]'>
        <div className='flex max-w-[28.375rem] flex-col gap-7 px-12 py-20'>
          <h2 className='text-white-smoke text-3xl'>{czechTypography(t('foundation.title'))}</h2>
          <p className='text-white-smoke'>{czechTypography(t('foundation.description'))}</p>
        </div>
      </div>
    </section>
  );
};

export default FoundationSection;
