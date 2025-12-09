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

const CONSULTANT_IMAGE_SIZE = 120;

export const BranchConsultant = ({ consultant }: BranchConsultantProps) => {
  if (!consultant) return null;

  const profileImage = consultant.zamestnanciACF?.profileImage?.node;
  const position = consultant.zamestnanciACF?.positionDescription;
  const name = consultant.title;

  return (
    <div className='order-3 flex flex-col gap-7.5 lg:col-span-12 lg:flex-row lg:items-center lg:gap-7.5 lg:pt-12 lg:pr-25'>
      {profileImage && (
        <div className='shrink-0'>
          <Image
            src={profileImage.sourceUrl}
            alt={profileImage.altText}
            width={CONSULTANT_IMAGE_SIZE}
            height={CONSULTANT_IMAGE_SIZE}
            className='aspect-square object-cover'
          />
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
