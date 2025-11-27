import Link from 'next/link';

import Button from '@/components/_shared/Button';
import { FormattedText } from '@/components/_shared/FormattedText';
import { cn } from '@/lib/utils';

interface BranchCardContentProps {
  city?: string;
  title?: string;
  openDaysWorking?: string;
  openDaysWeekend?: string;
  phoneNumber?: string;
  slug: string;
  detailButtonText: string;
  layout: 'vertical' | 'horizontal';
}

const BranchCardContent = ({
  city,
  title,
  openDaysWorking,
  openDaysWeekend,
  phoneNumber,
  slug,
  detailButtonText,
  layout
}: BranchCardContentProps) => {
  const containerClasses = cn(
    'flex flex-1 flex-col',
    layout === 'vertical' ? 'py-5' : 'py-1'
  );

  return (
    <div className={containerClasses}>
      {city && (
        <FormattedText
          text={city}
          as='p'
          className='text-primary font-heading text-lg'
        />
      )}
      {title && (
        <FormattedText
          text={title}
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

      <Link href={`/${slug}`} className='-ml-4 lg:-ml-8 mt-2'>
        <Button buttonText={detailButtonText} size='small' variant='destructive' />
      </Link>
    </div>
  );
};

export default BranchCardContent;
