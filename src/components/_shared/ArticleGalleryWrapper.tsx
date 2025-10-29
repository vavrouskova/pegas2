'use client';

import { useLayoutEffect, useRef } from 'react';

import { cn } from '@/lib/utils';
import { useImageGallery } from '@/providers/ImageGalleryProvider';

interface ArticleGalleryWrapperProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  wrapperClassName?: string;
  children: React.ReactNode;
}

export const ArticleGalleryWrapper = ({
  src,
  alt,
  width,
  height,
  caption,
  wrapperClassName,
  children,
}: Readonly<ArticleGalleryWrapperProps>) => {
  const { registerImage, openLightbox } = useImageGallery();
  const imageIndexRef = useRef<number | null>(null);
  const hasRegistered = useRef(false);

  // Use useLayoutEffect to register synchronously before paint
  useLayoutEffect(() => {
    if (!hasRegistered.current) {
      const index = registerImage({
        src,
        alt,
        width,
        height,
        caption: caption ?? alt,
      });
      imageIndexRef.current = index;
      hasRegistered.current = true;
    }
  }, [src, alt, width, height, caption, registerImage]);

  const handleClick = () => {
    // Only open if we have a valid index
    if (imageIndexRef.current !== null && imageIndexRef.current >= 0) {
      openLightbox(imageIndexRef.current);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role='button'
      tabIndex={0}
      className={cn(
        'cursor-pointer transition-opacity hover:opacity-90 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none',
        wrapperClassName
      )}
      aria-label={`View image: ${alt || 'Gallery image'}`}
    >
      {children}
    </div>
  );
};
