import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import React from 'react';

import { DirectorateInformation, Email, PhoneNumber, SecondaryPhoneNumber } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { ClassNameProps } from '@/utils/types';

const DirectorateInfo = async ({ className }: ClassNameProps) => {
  const t = await getTranslations();

  return (
    <div className={cn('flex flex-col', className)}>
      <span className='font-heading text-white-smoke mb-5.5 text-lg text-balance'>{t('footer.directorate')}</span>
      <div className='flex flex-col gap-2'>
        <span className='text-tertiary text-base'>{DirectorateInformation.name}</span>
        <span className='text-tertiary text-base'>{DirectorateInformation.address}</span>
        <span className='text-tertiary text-base'>{DirectorateInformation.openingHours}</span>
        <span className='text-tertiary text-base'>{DirectorateInformation.openingHoursWeekend}</span>
      </div>
      <div className='mt-3 flex flex-col gap-2'>
        <Link
          className='text-base text-white transition-all duration-300 hover:opacity-70'
          href={`mailto:${Email}`}
        >
          {Email}
        </Link>
        <div className='flex flex-wrap items-center gap-2 text-white'>
          <Link
            className='text-base text-white transition-all duration-300 hover:opacity-70'
            href={`tel:${PhoneNumber}`}
          >
            {PhoneNumber}
          </Link>
          |
          <Link
            className='text-base text-white transition-all duration-300 hover:opacity-70'
            href={`tel:${SecondaryPhoneNumber}`}
          >
            {SecondaryPhoneNumber}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DirectorateInfo;
