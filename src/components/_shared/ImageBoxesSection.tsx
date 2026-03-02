'use client';

import Image from 'next/image';

import { ArticleGalleryWrapper } from '@/components/_shared/ArticleGalleryWrapper';
import { FormattedText } from '@/components/_shared/FormattedText';
import { cn } from '@/lib/utils';
import { htmlToMarkers } from '@/utils/htmlToMarkers';

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
  descriptionLineGap?: string;
}

export const ImageBoxesSection = ({ imageBoxes, descriptionLineGap }: ImageBoxesSectionProps) => {
  if (!imageBoxes || imageBoxes.length === 0) return null;

  return (
    <div className='grid w-full grid-cols-2 gap-2.5 lg:grid-cols-4'>
      {imageBoxes.map((box, index) => {
        const imageUrl = box.imageBox?.node?.sourceUrl;
        const imageAlt = box.imageBox?.node?.altText || box.boxHeadline || '';

        if (!imageUrl) return null;

        const descriptionMarkers = box.boxDescription ? htmlToMarkers(box.boxDescription) : '';
        const descriptionLines = descriptionLineGap
          ? descriptionMarkers.split('{{br}}').filter((line) => line.trim())
          : [];

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
            <div className='flex flex-1 flex-col gap-1 bg-white px-2.5 py-1.5'>
              {box.boxHeadline && (
                <FormattedText
                  text={box.boxHeadline}
                  as='h3'
                  className='text-sm leading-[144%]'
                />
              )}
              {descriptionLineGap && descriptionLines.length > 0 ? (
                <div className={cn('flex flex-col', descriptionLineGap)}>
                  {descriptionLines.map((line, lineIndex) => (
                    <FormattedText
                      key={lineIndex}
                      text={line.trim()}
                      as='span'
                      className='text-sm leading-[144%]'
                    />
                  ))}
                </div>
              ) : (
                box.boxDescription && (
                  <FormattedText
                    text={descriptionMarkers}
                    as='p'
                    className='text-sm leading-[144%]'
                  />
                )
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
