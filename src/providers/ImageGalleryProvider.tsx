'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { IMAGE_GALLERY_CONFIG } from '@/config/imageGallery.config';

export interface GalleryImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
}

interface ImageGalleryContextType {
  images: GalleryImage[];
  currentIndex: number;
  isOpen: boolean;
  openLightbox: (index: number) => void;
  closeLightbox: () => void;
  nextImage: () => void;
  prevImage: () => void;
  registerImage: (image: GalleryImage) => number;
  clearImages: () => void;
}

const ImageGalleryContext = createContext<ImageGalleryContextType | undefined>(undefined);

export function useImageGallery() {
  const context = useContext(ImageGalleryContext);
  if (!context) {
    throw new Error('useImageGallery must be used within ImageGalleryProvider');
  }
  return context;
}

interface ImageGalleryProviderProps {
  children: React.ReactNode;
}

export const ImageGalleryProvider = ({ children }: ImageGalleryProviderProps) => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const imagesRef = useRef<GalleryImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const registerImage = useCallback((image: GalleryImage): number => {
    const currentImages = imagesRef.current;
    const existingIndex = currentImages.findIndex((img) => img.src === image.src);

    if (existingIndex !== -1) {
      return existingIndex;
    }

    if (currentImages.length >= IMAGE_GALLERY_CONFIG.performance.maxImages) {
      console.warn(
        `Image gallery has reached maximum capacity (${IMAGE_GALLERY_CONFIG.performance.maxImages} images). New images will not be added.`
      );
      return -1;
    }

    const newIndex = currentImages.length;

    const newImages = [...currentImages, image];
    imagesRef.current = newImages;
    setImages(newImages);

    return newIndex;
  }, []);

  const clearImages = useCallback(() => {
    setImages([]);
    imagesRef.current = [];
    setCurrentIndex(0);
    setIsOpen(false);
  }, []);

  const openLightbox = useCallback((index: number) => {
    const totalImages = imagesRef.current.length;
    if (index >= 0 && index < totalImages) {
      setCurrentIndex(index);
      setIsOpen(true);
    } else {
      console.error('Invalid image index:', index, 'total images:', totalImages);
    }
  }, []);

  const closeLightbox = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Zakázat scroll na body
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;

      // Zakázat touch scrolling na celé stránce
      const preventScroll = (e: TouchEvent) => {
        // Povolit scroll pouze v lightbox kontejneru
        const target = e.target as HTMLElement;
        if (!target.closest('[data-lightbox-container]')) {
          e.preventDefault();
        }
      };

      // Zakázat wheel scroll na celé stránce
      const preventWheel = (e: WheelEvent) => {
        // Povolit wheel pouze v lightbox kontejneru
        const target = e.target as HTMLElement;
        if (!target.closest('[data-lightbox-container]')) {
          e.preventDefault();
        }
      };

      document.addEventListener('touchmove', preventScroll, { passive: false });
      document.addEventListener('wheel', preventWheel, { passive: false });

      return () => {
        // Obnovit pozici scrollu
        const scrollY = document.body.style.top;
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';
        window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);

        document.removeEventListener('touchmove', preventScroll);
        document.removeEventListener('wheel', preventWheel);
      };
    }
  }, [isOpen]);

  const nextImage = useCallback(() => {
    setCurrentIndex((previous) => (previous + 1) % imagesRef.current.length);
  }, []);

  const previousImage = useCallback(() => {
    setCurrentIndex((previous) => (previous - 1 + imagesRef.current.length) % imagesRef.current.length);
  }, []);

  const value = useMemo(
    () => ({
      images,
      currentIndex,
      isOpen,
      openLightbox,
      closeLightbox,
      nextImage,
      prevImage: previousImage,
      registerImage,
      clearImages,
    }),
    [images, currentIndex, isOpen, openLightbox, closeLightbox, nextImage, previousImage, registerImage, clearImages]
  );

  return <ImageGalleryContext.Provider value={value}>{children}</ImageGalleryContext.Provider>;
};
