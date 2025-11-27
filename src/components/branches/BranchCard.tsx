import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import Button from '@/components/_shared/Button';
import { FormattedText } from '@/components/_shared/FormattedText';
import Parking from '@/components/icons/Parking';
import { cn } from '@/lib/utils';
import { formatDateRange } from '@/utils/helper';
import type { PobockaPost } from '@/utils/wordpress-types';

interface BranchCardProps {
  branch: PobockaPost;
  className?: string;
}

const BranchCard = ({ branch, className }: Readonly<BranchCardProps>) => {
  const t = useTranslations('branches');
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
  const isClosed = dateCloseFrom && dateCloseTo;
  // Check if branch has parking
  const hasParking = parking && parking.trim() !== '';

  const formattedDateRange = formatDateRange(dateCloseFrom, dateCloseTo);

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
            <span className='text-gray-400'>{t('no-image')}</span>
          </div>
        )}
        {isClosed && (
          <div className='bg-primary min-h-[70px] z-10 absolute bottom-0 left-0 w-full p-3 pr-[70px]'>
            <p className='text-white-smoke leading-[150%] font-heading text-sm'>
              {t('closed')}
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
          <Button buttonText={t('detail-button')} size='small' variant='destructive' />
        </Link>
      </div>
    </article>
  );
};

export default BranchCard;
