'use client';

import Image from 'next/image';

import { ArticleGalleryWrapper } from '@/components/_shared/ArticleGalleryWrapper';
import { FormattedText } from '@/components/_shared/FormattedText';

interface ImageBox {
  boxHeadline?: string;
  boxDescription?: string;
  imageBox?: {
    node: {
      altText?: string;
      sourceUrl?: string;
    };
  };
}

interface ImageBoxesSectionProps {
  imageBoxes: ImageBox[];
}

export const ImageBoxesSection = ({ imageBoxes }: ImageBoxesSectionProps) => {
  if (!imageBoxes || imageBoxes.length === 0) return null;

  return (
    <div className='grid w-full grid-cols-2 gap-2.5 lg:grid-cols-4'>
      {imageBoxes.map((box, index) => {
        const imageUrl = box.imageBox?.node?.sourceUrl;
        const imageAlt = box.imageBox?.node?.altText || box.boxHeadline || '';

        if (!imageUrl) return null;

        return (
          <div
            key={index}
            className='flex h-full flex-col'
          >
            <ArticleGalleryWrapper
              src={imageUrl}
              alt={imageAlt}
              width={800}
              height={800}
              caption={imageAlt}
              wrapperClassName='relative aspect-square w-full overflow-hidden'
            >
              <Image
                src={imageUrl}
                alt={imageAlt}
                fill
                className='object-cover'
                sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw'
              />
            </ArticleGalleryWrapper>
            <div className='flex flex-1 flex-col bg-white px-2.5 py-1.5'>
              {box.boxHeadline && (
                <FormattedText
                  text={box.boxHeadline}
                  as='h3'
                  className='text-sm'
                />
              )}
              {box.boxDescription && (
                <FormattedText
                  text={box.boxDescription}
                  as='p'
                  className='text-sm'
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
