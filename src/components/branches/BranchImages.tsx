import Image from 'next/image';

interface ImageData {
  url: string;
  alt: string;
}

interface BranchImagesProps {
  internalImage?: ImageData;
  externalImage?: ImageData;
}

const IMAGE_SIZE = 100;
const IMAGE_CLASS = 'h-full w-full object-cover';
const CONTAINER_CLASS = 'aspect-square overflow-hidden';

export const BranchImages = ({ internalImage, externalImage }: BranchImagesProps) => {
  if (!internalImage && !externalImage) return null;

  return (
    <div className='order-2 flex flex-col gap-8 lg:col-span-8 lg:col-start-13 lg:row-span-3 lg:row-start-1'>
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
      <div className='grid grid-cols-2 gap-8'>
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
        {/* Map placeholder - můžeš přidat mapu zde */}
        <div className='aspect-square overflow-hidden bg-gray-200'></div>
      </div>
    </div>
  );
};
