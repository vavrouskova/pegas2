import BranchCardContent from '@/components/branches/BranchCardContent';
import BranchCardImage from '@/components/branches/BranchCardImage';
import Parking from '@/components/icons/Parking';
import { cn } from '@/lib/utils';
import { formatDateRange, isClosurePeriodActive } from '@/utils/helper';
import type { PobockaPost } from '@/utils/wordpress-types';

interface BranchCardProps {
  branch: PobockaPost;
  className?: string;
  layout?: 'vertical' | 'horizontal';
  showClosedInfo?: boolean;
  showParking?: boolean;
  translations: {
    closed: string;
    detailButton: string;
  };
  // Tracking props
  index?: number;
}

const BranchCard = ({
  branch,
  className,
  layout = 'vertical',
  showClosedInfo = true,
  showParking = true,
  translations,
  index,
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

  // Check if branch is currently closed (only show if dateCloseTo is today or in the future)
  const isClosed = showClosedInfo && dateCloseFrom && dateCloseTo && isClosurePeriodActive(dateCloseTo);
  // Check if branch has parking
  const hasParking = showParking && parking && parking.trim() !== '';

  const formattedDateRange = formatDateRange(dateCloseFrom, dateCloseTo);

  if (layout === 'horizontal') {
    return (
      <article className={cn('flex min-h-[120px] gap-4', className)}>
        <BranchCardImage
          imageUrl={imageUrl}
          imageAlt={imageAlt}
          layout='horizontal'
          slug={branch.slug}
          linkToDetail={true}
          branchId={branch.id}
          branchTitle={branch.title}
          index={index}
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
          branchId={branch.id}
          branchTitle={branch.title}
          index={index}
        />
      </article>
    );
  }

  return (
    <article className={cn('group flex h-full flex-col bg-white', className)}>
      <div className='relative aspect-square w-full overflow-hidden'>
        <BranchCardImage
          imageUrl={imageUrl}
          imageAlt={imageAlt}
          layout='vertical'
          slug={branch.slug}
          linkToDetail={true}
          branchId={branch.id}
          branchTitle={branch.title}
          index={index}
        />
        {isClosed && (
          <div className='bg-primary pointer-events-none absolute bottom-0 left-0 z-10 min-h-[70px] w-full p-3 pr-[70px]'>
            <p className='text-white-smoke font-heading text-sm leading-[150%]'>{t.closed}</p>
            <p className='text-white-smoke font-heading text-sm leading-[150%]'>{formattedDateRange}</p>
          </div>
        )}
        {hasParking && (
          <div className='pointer-events-none absolute right-0 bottom-0 z-10'>
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
        branchId={branch.id}
        branchTitle={branch.title}
        index={index}
      />
    </article>
  );
};

export default BranchCard;
