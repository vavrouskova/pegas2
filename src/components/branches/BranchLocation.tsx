import { FormattedText } from '@/components/_shared/FormattedText';
import Parking from '@/components/icons/Parking';
import WheelChair from '@/components/icons/WheelChair';

interface BranchLocationProps {
  visitUs?: string;
  parking?: string;
  wheelchairAccess?: boolean;
  whereToFindLabel: string;
  wheelchairAccessLabel: string;
}

const FEATURE_ICON_CLASS = 'size-9';
const FEATURE_TEXT_CLASS = 'text-lg';

export const BranchLocation = ({
  visitUs,
  parking,
  wheelchairAccess,
  whereToFindLabel,
  wheelchairAccessLabel,
}: BranchLocationProps) => {
  const hasFeatures = parking || wheelchairAccess;

  if (!visitUs && !hasFeatures) return null;

  return (
    <div className='order-4 md:col-span-12 md:pt-12 md:pr-25'>
      {visitUs && (
        <div className='mb-8'>
          <FormattedText
            text={whereToFindLabel}
            as='p'
            className='font-heading text-lg'
          />
          <FormattedText
            text={visitUs}
            as='p'
            className={FEATURE_TEXT_CLASS}
          />
        </div>
      )}
      {hasFeatures && (
        <div className='flex flex-col gap-4'>
          {parking && (
            <div className='flex items-center gap-2'>
              <Parking className={FEATURE_ICON_CLASS} />
              <span className={FEATURE_TEXT_CLASS}>{parking}</span>
            </div>
          )}
          {wheelchairAccess && (
            <div className='flex items-center gap-2'>
              <WheelChair className={FEATURE_ICON_CLASS} />
              <span className={FEATURE_TEXT_CLASS}>{wheelchairAccessLabel}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
