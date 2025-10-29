'use client';

import Image from 'next/image';

import { ArticleGalleryWrapper } from '@/components/_shared/ArticleGalleryWrapper';

interface GalleryImageWrapperProps {
  src: string;
  alt: string;
  className?: string;
}

export const GalleryImageWrapper = ({ src, alt, className }: GalleryImageWrapperProps) => {
  return (
    <ArticleGalleryWrapper
      src={src}
      alt={alt}
      width={1200}
      height={800}
      caption={alt}
      wrapperClassName={className}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className='object-cover'
        unoptimized
      />
    </ArticleGalleryWrapper>
  );
};
