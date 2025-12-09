import Image from 'next/image';

import { FormattedText } from '@/components/_shared/FormattedText';

interface ConsultantImage {
  sourceUrl: string;
  altText: string;
}

interface ConsultantACF {
  profileImage?: {
    node: ConsultantImage;
  };
  positionDescription?: string;
}

interface Consultant {
  title?: string;
  zamestnanciACF?: ConsultantACF;
}

interface BranchConsultantProps {
  consultant?: Consultant;
}

export const BranchConsultant = ({ consultant }: BranchConsultantProps) => {
  if (!consultant) return null;

  const profileImage = consultant.zamestnanciACF?.profileImage?.node;
  const position = consultant.zamestnanciACF?.positionDescription;
  const name = consultant.title;

  return (
    <div className='order-3 flex flex-col gap-7.5 md:col-span-12 md:flex-row md:items-center md:gap-7.5 md:pt-12 md:pr-25'>
      {profileImage && (
        <div className='grid grid-cols-2 gap-4 md:grid-cols-1'>
          <div className='relative aspect-square h-auto w-full md:h-[120px] md:shrink-0'>
            <Image
              src={profileImage.sourceUrl}
              alt={profileImage.altText}
              fill
              className='aspect-square object-cover'
            />
          </div>
        </div>
      )}
      <div className='flex flex-col'>
        {name && (
          <FormattedText
            text={name}
            as='p'
            className='font-heading text-primary text-xl'
          />
        )}
        {position && (
          <FormattedText
            text={position}
            as='p'
            className='text-primary'
          />
        )}
      </div>
    </div>
  );
};
