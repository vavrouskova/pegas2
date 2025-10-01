import Image from 'next/image';
import React from 'react';

import ContentBox from '@/components/_shared/ContentBox';
import { cn } from '@/lib/utils';

interface ContentWithImagesProps {
  title: string;
  description: string;
  buttonText: string;
  link: string;
  className?: string;
  variant?: 'grid' | 'single';
  images?: { src: string; alt: string }[];
}

const ContentWithImages = ({
  title,
  description,
  buttonText,
  link,
  className,
  variant = 'grid',
  images,
}: ContentWithImagesProps) => {
  const fallbackSource = '/images/rose.webp';
  const fallbackAlt = 'How to navigate';
  const gridImages = (
    images && images.length > 0 ? images : Array.from({ length: 4 }, () => ({ src: fallbackSource, alt: fallbackAlt }))
  ).slice(0, 4);
  const singleImage = images && images.length > 0 ? images[0] : { src: fallbackSource, alt: fallbackAlt };
  return (
    <section className={cn('flex items-center justify-between gap-10', className)}>
      <ContentBox
        title={title}
        description={description}
        buttonText={buttonText}
        link={link}
        className='max-w-[28.375rem] pl-30'
      />
      {variant === 'single' ? (
        <Image
          src={singleImage.src}
          alt={singleImage.alt}
          width={1400}
          height={1400}
          className='size-[43.25rem]'
        />
      ) : (
        <div className='grid grid-cols-2 gap-4'>
          {gridImages.map((img, index) => (
            <Image
              key={`${img.src}-${index}`}
              src={img.src}
              alt={img.alt}
              width={700}
              height={700}
              className='size-[21.13069rem]'
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default ContentWithImages;
