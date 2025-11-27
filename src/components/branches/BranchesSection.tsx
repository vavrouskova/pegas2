'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import Button from '@/components/_shared/Button';
import { FormattedText } from '@/components/_shared/FormattedText';
import { cn } from '@/lib/utils';
import { formatDateRange } from '@/utils/helper';
import type { PobockaPost } from '@/utils/wordpress-types';

interface BranchesSectionProps {
  branches: PobockaPost[];
  title?: string;
}

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

  // Check if branch is currently closed
  const isClosed = dateCloseFrom && dateCloseTo;

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
          <div className='bg-primary z-10 absolute bottom-0 left-0 w-full p-3'>
            <p className='text-white-smoke font-heading text-sm'>
              {t('closed')}
            </p>
            <p className='text-white-smoke font-heading text-sm'>
              {formattedDateRange}
            </p>
          </div>
        )}
      </div>
      <div className='flex flex-1 flex-col py-6'>
        {city && (
          <FormattedText
            text={city}
            as='p'
            className='text-primary font-heading text-xl'
          />
        )}
        {branch.title && (
          <FormattedText
            text={branch.title}
            as='h3'
            className='mb-2 text-xl'
          />
        )}

        {openDaysWorking && (
          <div className='mb-2'>
            <FormattedText
              text={openDaysWorking}
              as='p'
              className='text-primary text-sm'
            />
          </div>
        )}

        {openDaysWeekend && (
          <div className='mb-4'>
            <FormattedText
              text={openDaysWeekend}
              as='p'
              className='text-primary text-sm'
            />
          </div>
        )}

        {phoneNumber && (
          <Link
            href={`tel:${phoneNumber}`}
            className='text-primary text-lg underline transition-opacity hover:opacity-70'
          >
            {phoneNumber}
          </Link>
        )}

        <Link href={`/${branch.slug}`} className='-ml-4 lg:-ml-8 mt-4'>
          <Button buttonText={t('detail-button')} size='small' variant='destructive' />
        </Link>
      </div>
    </article>
  );
};

const BranchesSection = ({ branches, title }: Readonly<BranchesSectionProps>) => {
  if (branches.length === 0) return null;

  return (
    <section className='section-container'>
      <div className='max-w-container mx-auto'>
        {title && (
          <FormattedText
            text={title}
            as='h2'
            className='mb-12.5'
          />
        )}

        <div className='flex flex-wrap justify-center gap-x-7.5 gap-y-12.5 lg:gap-7.5'>
          {branches.map((branch) => (
            <BranchCard
              key={branch.id}
              branch={branch}
              className='w-full max-w-[15.75rem] min-w-[15.75rem]'
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BranchesSection;
