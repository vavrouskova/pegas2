import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import React from 'react';

import Phone from '@/components/icons/Phone';
import { PhoneNumber } from '@/lib/constants';

const StickyContact = async () => {
  const t = await getTranslations('common');

  return (
    <div className='bg-primary fixed right-0 bottom-20 flex gap-4 p-4 pr-12'>
      <div className='bg-white-smoke flex h-16 w-16 items-center justify-center'>
        <Phone className='text-primary h-7.5 w-7.5' />
      </div>
      <div className='flex flex-col justify-center gap-1 pr-2'>
        <span className='text-base text-white'>{t('nonstop')}</span>
        <Link
          className='text-2xl text-white'
          href={`tel:${PhoneNumber}`}
        >
          {PhoneNumber}
        </Link>
      </div>
    </div>
  );
};

export default StickyContact;
