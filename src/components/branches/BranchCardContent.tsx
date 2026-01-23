'use client';

import Link from 'next/link';

import { FormattedText } from '@/components/_shared/FormattedText';
import LinkWithArrow from '@/components/_shared/LinkWithArrow';
import { cn } from '@/lib/utils';
import { pushBranchSelectItem, pushContactClick } from '@/utils/datalayer';

interface BranchCardContentProps {
  city?: string;
  title?: string;
  openDaysWorking?: string;
  openDaysWeekend?: string;
  phoneNumber?: string;
  slug: string;
  detailButtonText: string;
  layout: 'vertical' | 'horizontal';
  // Tracking props
  branchId?: string;
  branchTitle?: string;
  index?: number;
}

const BranchCardContent = ({
  city,
  title,
  openDaysWorking,
  openDaysWeekend,
  phoneNumber,
  slug,
  detailButtonText,
  layout,
  branchId,
  branchTitle,
  index,
}: BranchCardContentProps) => {
  const containerClasses = cn('flex flex-1 justify-between flex-col', layout === 'vertical' ? 'py-5 px-4' : 'py-1');

  const handleDetailClick = () => {
    if (branchId && branchTitle) {
      pushBranchSelectItem({
        item_id: branchId,
        item_name: branchTitle,
        item_category: 'Pobočky',
        item_list_name: 'Pobočky',
        index,
      });
    }
  };

  const handlePhoneClick = () => {
    if (phoneNumber) {
      pushContactClick(phoneNumber, 'Pobočky');
    }
  };

  return (
    <div className={containerClasses}>
      <Link
        href={`/${slug}`}
        onClick={handleDetailClick}
      >
        {city && (
          <FormattedText
            text={city}
            as='p'
            className='font-heading text-lg'
          />
        )}
        {title && (
          <FormattedText
            text={title}
            as='h3'
            className='mb-2 text-lg'
          />
        )}
      </Link>

      {openDaysWorking && (
        <FormattedText
          text={openDaysWorking}
          as='p'
          className={cn('text-sm', !openDaysWeekend && 'mb-12')}
        />
      )}

      {openDaysWeekend && (
        <FormattedText
          text={openDaysWeekend}
          as='p'
          className='mb-12 text-sm'
        />
      )}

      <div>
        {phoneNumber && (
          <Link
            href={`tel:${phoneNumber}`}
            className='text-lg underline hover:no-underline'
            onClick={handlePhoneClick}
          >
            {phoneNumber}
          </Link>
        )}
        <LinkWithArrow
          href={`/${slug}`}
          title={detailButtonText}
          onClick={handleDetailClick}
          className='mt-4'
        />
      </div>
    </div>
  );
};

export default BranchCardContent;
