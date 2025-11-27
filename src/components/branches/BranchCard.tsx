import Parking from '@/components/icons/Parking';
import { cn } from '@/lib/utils';
import { formatDateRange } from '@/utils/helper';
import type { PobockaPost } from '@/utils/wordpress-types';

import BranchCardContent from './BranchCardContent';
import BranchCardImage from './BranchCardImage';

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
        <BranchCardImage
          imageUrl={imageUrl}
          imageAlt={imageAlt}
          noImageText={t.noImage}
          layout='horizontal'
        />
        <BranchCardContent
          city={city}
          title={branch.title}
          openDaysWorking={openDaysWorking}
          openDaysWeekend={openDaysWeekend}
          phoneNumber={phoneNumber}
          slug={branch.slug}
          detailButtonText={t.detailButton}
          layout='horizontal'
        />
      </article>
    );
  }

  return (
    <article className={cn('group flex h-full flex-col', className)}>
      <div className='relative aspect-square w-full overflow-hidden'>
        <BranchCardImage
          imageUrl={imageUrl}
          imageAlt={imageAlt}
          noImageText={t.noImage}
          layout='vertical'
        />
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
      <BranchCardContent
        city={city}
        title={branch.title}
        openDaysWorking={openDaysWorking}
        openDaysWeekend={openDaysWeekend}
        phoneNumber={phoneNumber}
        slug={branch.slug}
        detailButtonText={t.detailButton}
        layout='vertical'
      />
    </article>
  );
};

export default BranchCard;
