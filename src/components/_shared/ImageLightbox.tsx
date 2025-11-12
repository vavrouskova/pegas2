'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';

import { IMAGE_GALLERY_CONFIG } from '@/config/imageGallery.config';
import { useImageKeyboardNavigation } from '@/hooks/useImageKeyboardNavigation';
import { useImagePan } from '@/hooks/useImagePan';
import { useImageTouchGestures } from '@/hooks/useImageTouchGestures';
import { useImageZoom } from '@/hooks/useImageZoom';
import { useViewportHeight } from '@/hooks/useViewportHeight';
import type { GalleryImage } from '@/providers/ImageGalleryProvider';
import { useImageGallery } from '@/providers/ImageGalleryProvider';
import { createImageGalleryNavigation } from '@/utils/imageGalleryNavigation';

const LightboxOverlay = () => (
  <Dialog.Overlay
    className='data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50'
    style={{
      backgroundColor: IMAGE_GALLERY_CONFIG.colors.overlayBg,
      height: 'calc(var(--vh, 1vh) * 100)',
    }}
  />
);

const LightboxControls = () => (
  <Dialog.Close className='data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 z-10 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:outline-none disabled:pointer-events-none'>
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={24}
      height={24}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className='text-primary'
    >
      <path d='M18 6 6 18' />
      <path d='m6 6 12 12' />
    </svg>
    <span className='sr-only'>Close</span>
  </Dialog.Close>
);

interface LightboxCounterProps {
  currentIndex: number;
  totalImages: number;
}

const LightboxCounter = ({ currentIndex, totalImages }: LightboxCounterProps) => {
  const navigation = createImageGalleryNavigation(currentIndex, totalImages);
  if (!navigation.hasMultipleImages()) return null;

  return (
    <div className='text-primary absolute top-4 left-4 z-10 px-3 py-2 text-2xl'>{navigation.getCounterText()}</div>
  );
};

interface LightboxNavigationProps {
  currentIndex: number;
  totalImages: number;
  onNavigatePrev: () => void;
  onNavigateNext: () => void;
}

const LightboxNavigation = ({ currentIndex, totalImages, onNavigatePrev, onNavigateNext }: LightboxNavigationProps) => {
  const navigation = createImageGalleryNavigation(currentIndex, totalImages);
  const { buttonBg } = IMAGE_GALLERY_CONFIG.colors;
  const { buttonSize, iconSize } = IMAGE_GALLERY_CONFIG.ui;

  if (!navigation.hasMultipleImages()) return null;

  const buttonClasses =
    'absolute top-1/2 z-10 flex -translate-y-1/2 items-center justify-center rounded-full text-white transition-opacity hover:opacity-100 focus:ring-2 focus:ring-white focus:outline-none';

  return (
    <>
      {navigation.canNavigatePrev() && (
        <button
          type='button'
          onClick={onNavigatePrev}
          className={`${buttonClasses} left-4`}
          style={{
            backgroundColor: buttonBg,
            width: `${buttonSize}px`,
            height: `${buttonSize}px`,
          }}
          aria-label='Previous image'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width={iconSize}
            height={iconSize}
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='m15 18-6-6 6-6' />
          </svg>
        </button>
      )}

      {navigation.canNavigateNext() && (
        <button
          type='button'
          onClick={onNavigateNext}
          className={`${buttonClasses} right-4`}
          style={{
            backgroundColor: buttonBg,
            width: `${buttonSize}px`,
            height: `${buttonSize}px`,
          }}
          aria-label='Next image'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width={iconSize}
            height={iconSize}
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='m9 18 6-6-6-6' />
          </svg>
        </button>
      )}
    </>
  );
};

interface LightboxImageProps {
  image: GalleryImage;
  scale: number;
  position: { x: number; y: number };
  isDragging: boolean;
  cursor: string;
  containerRef: React.RefObject<HTMLDivElement>;
  onWheel: (event: React.WheelEvent) => void;
  onMouseDown: (event: React.MouseEvent) => void;
  onMouseMove: (event: React.MouseEvent) => void;
  onMouseUp: () => void;
  onDoubleClick: () => void;
}

const LightboxImage = ({
  image,
  scale,
  position,
  isDragging,
  cursor,
  containerRef,
  onWheel,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onDoubleClick,
}: LightboxImageProps) => (
  <div
    ref={containerRef}
    className='relative flex h-full w-full items-center justify-center overflow-hidden p-4 pb-12 md:pb-20'
    onWheel={onWheel}
    onMouseDown={onMouseDown}
    onMouseMove={onMouseMove}
    onMouseUp={onMouseUp}
    onMouseLeave={onMouseUp}
    onDoubleClick={onDoubleClick}
    style={{ cursor }}
  >
    <div
      style={{
        transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
        transition: isDragging ? 'none' : 'transform 0.2s ease-out',
      }}
      className='relative max-h-full max-w-full'
    >
      <Image
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        className='max-h-[calc(100vh-10rem)] w-auto object-contain'
        unoptimized
        priority
      />
    </div>

    {image.caption && (
      <div className='absolute right-0 bottom-0 left-0 z-10 bg-gradient-to-t from-black/80 to-transparent p-6 text-center'>
        <p className='text-primary text-sm'>{image.caption}</p>
      </div>
    )}
  </div>
);

export const ImageLightbox = () => {
  const { images, currentIndex, isOpen, closeLightbox, nextImage, prevImage } = useImageGallery();
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const currentImage = images[currentIndex];

  // Handle mobile viewport height changes (address bar show/hide)
  useViewportHeight();

  const { scale, setScale, handleWheel, handleDoubleClick, resetZoom } = useImageZoom();

  const { position, isDragging, resetPosition, handleMouseDown, handleMouseMove, handleMouseUp, getCursor } =
    useImagePan(scale);

  useImageTouchGestures({
    containerRef: imageContainerRef as React.RefObject<HTMLDivElement>,
    isOpen,
    scale,
    currentIndex,
    totalImages: images.length,
    onZoomChange: setScale,
    onNavigateNext: nextImage,
    onNavigatePrev: prevImage,
  });

  useImageKeyboardNavigation({
    isOpen,
    currentIndex,
    totalImages: images.length,
    onClose: closeLightbox,
    onNavigateNext: nextImage,
    onNavigatePrev: prevImage,
  });

  useEffect(() => {
    resetZoom();
    resetPosition();
  }, [currentIndex, resetZoom, resetPosition]);

  if (!currentImage) return null;

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => !open && closeLightbox()}
    >
      <Dialog.Portal>
        <LightboxOverlay />

        <Dialog.Content
          className='fixed inset-0 z-50 flex items-center justify-center overflow-hidden'
          style={{
            height: 'calc(var(--vh, 1vh) * 100)',
          }}
          onPointerDownOutside={(event) => {
            if (event.target === event.currentTarget) {
              closeLightbox();
            }
          }}
        >
          <Dialog.Title className='sr-only'>{currentImage?.alt || 'Image gallery'}</Dialog.Title>
          <Dialog.Description className='sr-only'>
            {currentImage?.caption ?? currentImage?.alt ?? 'Gallery image viewer'}
          </Dialog.Description>

          <LightboxControls />
          <LightboxCounter
            currentIndex={currentIndex}
            totalImages={images.length}
          />
          <LightboxNavigation
            currentIndex={currentIndex}
            totalImages={images.length}
            onNavigatePrev={prevImage}
            onNavigateNext={nextImage}
          />
          <LightboxImage
            image={currentImage}
            scale={scale}
            position={position}
            isDragging={isDragging}
            cursor={getCursor()}
            containerRef={imageContainerRef as React.RefObject<HTMLDivElement>}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onDoubleClick={handleDoubleClick}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
