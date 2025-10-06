import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import React from 'react';

import { DirectorateInformation, Email, PhoneNumber, SecondaryPhoneNumber } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { ClassNameProps } from '@/utils/types';

const DirectorateInfo = async ({ className }: ClassNameProps) => {
  const t = await getTranslations();

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <span className='font-heading text-white-smoke text-lg text-balance'>{t('footer.directorate')}</span>
      <div className='flex flex-col gap-4'>
        <span className='text-tertiary text-sm'>{DirectorateInformation.name}</span>
        <span className='text-tertiary text-sm'>{DirectorateInformation.address}</span>
        <span className='text-tertiary text-sm'>{DirectorateInformation.openingHours}</span>
        <span className='text-tertiary text-sm'>{DirectorateInformation.openingHoursWeekend}</span>
      </div>
      <div className='mt-3 flex flex-col gap-4 md:mt-6'>
        <Link
          className='text-sm text-white'
          href={`mailto:${Email}`}
        >
          {Email}
        </Link>
        <div className='flex flex-wrap items-center gap-2 text-white'>
          <Link
            className='text-sm text-white'
            href={`tel:${PhoneNumber}`}
          >
            +420 {PhoneNumber}
          </Link>
          |
          <Link
            className='text-sm text-white'
            href={`tel:${SecondaryPhoneNumber}`}
          >
            +420 {SecondaryPhoneNumber}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DirectorateInfo;
