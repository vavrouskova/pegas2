import Image from 'next/image';
import Link from 'next/link';

import Button from '@/components/_shared/Button';
import { FormattedText } from '@/components/_shared/FormattedText';
import Parking from '@/components/icons/Parking';
import { cn } from '@/lib/utils';
import { formatDateRange } from '@/utils/helper';
import type { PobockaPost } from '@/utils/wordpress-types';

interface BranchCardProps {
  branch: PobockaPost;
  className?: string;
  layout?: 'vertical' | 'horizontal';
  showClosedInfo?: boolean;
  showParking?: boolean;
  translations: {
    noImage: string;
    closed: string;
    detailButton: string;
  };
}

const BranchCard = ({
  branch,
  className,
  layout = 'vertical',
  showClosedInfo = true,
  showParking = true,
  translations
}: Readonly<BranchCardProps>) => {
  const t = translations;
  const { pobockyACF, featuredImage } = branch;
  const imageUrl = featuredImage?.node?.sourceUrl;
  const imageAlt = featuredImage?.node?.altText || branch.title || 'Branch';
  const city = pobockyACF?.city;
  const phoneNumber = pobockyACF?.phoneNumber;
  const openDaysWorking = pobockyACF?.openDaysWorking;
  const openDaysWeekend = pobockyACF?.openDaysWeekend;
  const dateCloseFrom = pobockyACF?.dateCloseFrom;
  const dateCloseTo = pobockyACF?.dateCloseTo;
  const parking = pobockyACF?.parking;

  // Check if branch is currently closed
  const isClosed = showClosedInfo && dateCloseFrom && dateCloseTo;
  // Check if branch has parking
  const hasParking = showParking && parking && parking.trim() !== '';

  const formattedDateRange = formatDateRange(dateCloseFrom, dateCloseTo);

  if (layout === 'horizontal') {
    return (
      <article className={cn('flex gap-4 min-h-[120px]', className)}>
        <div className='relative max-lg:hidden size-[13.25rem] overflow-hidden'>
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              sizes='120px'
              className='object-cover'
            />
          ) : (
            <div className='flex h-full w-full items-center justify-center bg-gray-200'>
              <span className='text-gray-400 text-xs'>{t.noImage}</span>
            </div>
          )}
        </div>

        <div className='flex flex-1 flex-col py-1'>
          {city && (
            <FormattedText
              text={city}
              as='p'
              className='text-primary font-heading text-lg'
            />
          )}
          {branch.title && (
            <FormattedText
              text={branch.title}
              as='h3'
              className='mb-2 text-lg'
            />
          )}

          {openDaysWorking && (
            <FormattedText
              text={openDaysWorking}
              as='p'
              className={cn('text-primary text-sm', !openDaysWeekend && 'mb-12')}
            />
          )}

          {openDaysWeekend && (
            <FormattedText
              text={openDaysWeekend}
              as='p'
              className='text-primary mb-12 text-sm'
            />
          )}

          {phoneNumber && (
            <Link
              href={`tel:${phoneNumber}`}
              className='text-primary text-lg underline hover:no-underline'
            >
              {phoneNumber}
            </Link>
          )}

          <Link href={`/${branch.slug}`} className='-ml-4 lg:-ml-8 mt-2'>
            <Button buttonText={t.detailButton} size='small' variant='destructive' />
          </Link>
        </div>
      </article>
    );
  }

  return (
    <article className={cn('group flex h-full flex-col', className)}>
      <div className='relative aspect-square w-full overflow-hidden'>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            sizes='(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw'
            className='object-cover'
          />
        ) : (
          <div className='flex h-full w-full items-center justify-center bg-gray-200'>
            <span className='text-gray-400'>{t.noImage}</span>
          </div>
        )}
        {isClosed && (
          <div className='bg-primary min-h-[70px] z-10 absolute bottom-0 left-0 w-full p-3 pr-[70px]'>
            <p className='text-white-smoke leading-[150%] font-heading text-sm'>
              {t.closed}
            </p>
            <p className='text-white-smoke leading-[150%] font-heading text-sm'>
              {formattedDateRange}
            </p>
          </div>
        )}
        {hasParking && (
          <div className='z-10 absolute bottom-0 right-0'>
            <Parking />
          </div>
        )}
      </div>
      <div className='flex flex-1 flex-col py-5'>
        {city && (
          <FormattedText
            text={city}
            as='p'
            className='text-primary font-heading text-lg'
          />
        )}
        {branch.title && (
          <FormattedText
            text={branch.title}
            as='h3'
            className='mb-2 text-lg'
          />
        )}

        {openDaysWorking && (
            <FormattedText
              text={openDaysWorking}
              as='p'
              className={cn('text-primary text-sm', !openDaysWeekend && 'mb-12')}
            />
        )}

        {openDaysWeekend && (
            <FormattedText
              text={openDaysWeekend}
              as='p'
              className='text-primary text-sm mb-12'
            />
        )}

        {phoneNumber && (
          <Link
            href={`tel:${phoneNumber}`}
            className='text-primary text-lg underline hover:no-underline'
          >
            {phoneNumber}
          </Link>
        )}

        <Link href={`/${branch.slug}`} className='-ml-4 lg:-ml-8 mt-2'>
          <Button buttonText={t.detailButton} size='small' variant='destructive' />
        </Link>
      </div>
    </article>
  );
};

export default BranchCard;
