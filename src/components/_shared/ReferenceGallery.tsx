'use client';

import { GalleryImageWrapper } from '@/components/services/GalleryImageWrapper';

interface GalleryImage {
  sourceUrl?: string;
  altText?: string;
}

interface ReferenceGalleryProps {
  images: GalleryImage[];
}

const ReferenceGallery = ({ images }: ReferenceGalleryProps) => {
  if (!images || images.length === 0) {
    return null;
  }

  // Layout pro 2 obrázky
  if (images.length === 2) {
    return (
      <div className='flex w-full flex-col gap-3 md:gap-4 lg:flex-row'>
        {images.map((image, imgIndex) => {
          const isSquare = imgIndex % 2 === 0;

          return (
            <GalleryImageWrapper
              key={imgIndex}
              src={image.sourceUrl || ''}
              alt={image.altText || ''}
              className={`relative w-full ${isSquare ? 'aspect-square' : 'aspect-[16/9]'} lg:aspect-auto ${
                imgIndex === 0 ? 'lg:h-[239px] lg:w-[239px] lg:flex-none lg:shrink-0' : 'lg:h-[239px] lg:flex-1'
              }`}
            />
          );
        })}
      </div>
    );
  }

  // Layout pro 4 obrázky (cik-cak)
  if (images.length === 4) {
    return (
      <div className='flex w-full flex-col gap-3 md:gap-4'>
        {/* Mobile layout - střídavé aspect ratio */}
        {images.map((image, imgIndex) => {
          const isSquare = imgIndex % 2 === 0;

          return (
            <GalleryImageWrapper
              key={imgIndex}
              src={image.sourceUrl || ''}
              alt={image.altText || ''}
              className={`relative w-full ${isSquare ? 'aspect-square' : 'aspect-[16/9]'} lg:hidden`}
            />
          );
        })}

        {/* Desktop layout - cik cak pattern */}
        <div className='hidden lg:flex lg:gap-4'>
          <GalleryImageWrapper
            src={images[0].sourceUrl || ''}
            alt={images[0].altText || ''}
            className='relative aspect-auto h-[239px] w-[239px] shrink-0'
          />
          <GalleryImageWrapper
            src={images[1].sourceUrl || ''}
            alt={images[1].altText || ''}
            className='relative aspect-auto h-[239px] flex-1'
          />
        </div>
        <div className='hidden lg:flex lg:gap-4'>
          <GalleryImageWrapper
            src={images[2].sourceUrl || ''}
            alt={images[2].altText || ''}
            className='relative aspect-auto h-[239px] flex-1'
          />
          <GalleryImageWrapper
            src={images[3].sourceUrl || ''}
            alt={images[3].altText || ''}
            className='relative aspect-auto h-[239px] w-[239px] shrink-0'
          />
        </div>
      </div>
    );
  }

  // Ostatní počty obrázků (1, 3, 5+)
  return (
    <div className='flex w-full flex-col gap-3 md:gap-4 lg:grid lg:grid-cols-2'>
      {images.map((image, imgIndex) => {
        const isSquare = imgIndex % 2 === 0;

        return (
          <GalleryImageWrapper
            key={imgIndex}
            src={image.sourceUrl || ''}
            alt={image.altText || ''}
            className={`relative w-full ${isSquare ? 'aspect-square' : 'aspect-[16/9]'} lg:aspect-auto lg:h-[239px]`}
          />
        );
      })}
    </div>
  );
};

export default ReferenceGallery;
