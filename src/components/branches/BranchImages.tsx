import Image from 'next/image';
import Link from 'next/link';

import ArrowRight from '@/components/icons/ArrowRight';

interface ImageData {
  url: string;
  alt: string;
}

interface BranchImagesProps {
  internalImage?: ImageData;
  externalImage?: ImageData;
  mapImage?: ImageData;
  navigateLink?: string;
  planRouteLabel?: string;
}

const IMAGE_SIZE = 100;
const IMAGE_CLASS = 'h-full w-full object-cover';
const CONTAINER_CLASS = 'aspect-square overflow-hidden';

export const BranchImages = ({
  internalImage,
  externalImage,
  mapImage,
  navigateLink,
  planRouteLabel,
}: BranchImagesProps) => {
  if (!internalImage && !externalImage) return null;

  return (
    <div className='order-2 flex flex-col gap-4 md:col-span-8 md:col-start-13 md:row-span-3 md:row-start-1 md:gap-8'>
      {internalImage && (
        <div className={CONTAINER_CLASS}>
          <Image
            src={internalImage.url}
            alt={internalImage.alt}
            width={IMAGE_SIZE}
            height={IMAGE_SIZE}
            className={IMAGE_CLASS}
          />
        </div>
      )}
      <div className='grid grid-cols-2 gap-4 md:gap-8'>
        {externalImage && (
          <div className={CONTAINER_CLASS}>
            <Image
              src={externalImage.url}
              alt={externalImage.alt}
              width={IMAGE_SIZE}
              height={IMAGE_SIZE}
              className={IMAGE_CLASS}
            />
          </div>
        )}
        {mapImage && (
          <div className='flex flex-col gap-2'>
            <Link
              href={navigateLink || '#'}
              target='_blank'
              className={CONTAINER_CLASS}
            >
              <Image
                src={mapImage.url}
                alt={mapImage.alt}
                width={IMAGE_SIZE}
                height={IMAGE_SIZE}
                className={IMAGE_CLASS}
              />
            </Link>
            {navigateLink && planRouteLabel && (
              <Link
                href={navigateLink}
                target='_blank'
                className='text-primary flex items-center gap-2 text-sm transition-opacity duration-300 hover:opacity-70'
              >
                {planRouteLabel}
                <ArrowRight className='size-4 shrink-0' />
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
