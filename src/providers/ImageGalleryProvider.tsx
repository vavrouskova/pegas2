'use client';

import { usePathname } from 'next/navigation';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

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
  /* eslint-disable no-unused-vars */
  openLightbox: (imageIndex: number) => void;
  closeLightbox: () => void;
  nextImage: () => void;
  prevImage: () => void;
  registerImage: (galleryImage: GalleryImage) => number;
  /* eslint-enable no-unused-vars */
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

  // Track route changes to reset gallery
  const pathname = usePathname();
  const lastRegisteredPathnameRef = useRef<string | null>(null);

  const registerImage = useCallback(
    (image: GalleryImage): number => {
      // If this is the first registration on a new route, clear previous images
      if (lastRegisteredPathnameRef.current !== pathname) {
        imagesRef.current = [];
        lastRegisteredPathnameRef.current = pathname;
      }

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
    },
    [pathname]
  );

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
      // Uložit aktuální pozici scrollu
      const scrollY = window.scrollY;

      // Zakázat scroll na body pomocí position: fixed
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${scrollY}px`;

      // Zakázat touch scrolling na celé stránce
      const preventTouchScroll = (touchEvent: TouchEvent) => {
        // Povolit scroll pouze v lightbox kontejneru
        const target = touchEvent.target as HTMLElement;
        if (!target.closest('[data-lightbox-container]')) {
          touchEvent.preventDefault();
        }
      };

      // Zakázat wheel scroll na celé stránce (včetně touchpadu)
      const preventWheel = (wheelEvent: WheelEvent) => {
        // Povolit wheel pouze v lightbox kontejneru
        const target = wheelEvent.target as HTMLElement;
        if (!target.closest('[data-lightbox-container]')) {
          wheelEvent.preventDefault();
          wheelEvent.stopPropagation();
          // Okamžitě resetovat scroll pozici pro touchpad gesta
          window.scrollTo(0, scrollY);
        }
      };

      // Kontrola a reset scroll pozice pomocí requestAnimationFrame (pro touchpad gesta)
      let rafId: number | null = null;
      const checkScrollPosition = () => {
        if (window.scrollY !== scrollY) {
          window.scrollTo(0, scrollY);
        }
        rafId = requestAnimationFrame(checkScrollPosition);
      };
      rafId = requestAnimationFrame(checkScrollPosition);

      // Zakázat scroll event - resetovat pozici pokud se změnila
      const resetScrollPosition = () => {
        if (window.scrollY !== scrollY) {
          window.scrollTo(0, scrollY);
        }
      };

      // Zakázat keyboard scroll
      const preventKeyboardScroll = (keyboardEvent: KeyboardEvent) => {
        const scrollKeys = ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End'];
        if (scrollKeys.includes(keyboardEvent.key)) {
          const target = keyboardEvent.target as HTMLElement;
          if (!target.closest('[data-lightbox-container]')) {
            keyboardEvent.preventDefault();
          }
        }
      };

      // Přidat všechny event listenery
      document.addEventListener('touchmove', preventTouchScroll, { passive: false });
      document.addEventListener('wheel', preventWheel, { passive: false, capture: true });
      window.addEventListener('scroll', resetScrollPosition, { passive: false, capture: true });
      document.addEventListener('scroll', resetScrollPosition, { passive: false, capture: true });
      document.addEventListener('keydown', preventKeyboardScroll, { passive: false });

      // Zajistit, že scroll je skutečně na správné pozici
      window.scrollTo(0, scrollY);

      return () => {
        // Zastavit requestAnimationFrame loop
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
        }

        // Obnovit pozici scrollu
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';
        window.scrollTo(0, scrollY);

        // Odstranit všechny event listenery
        document.removeEventListener('touchmove', preventTouchScroll);
        document.removeEventListener('wheel', preventWheel, { capture: true });
        window.removeEventListener('scroll', resetScrollPosition, { capture: true });
        document.removeEventListener('scroll', resetScrollPosition, { capture: true });
        document.removeEventListener('keydown', preventKeyboardScroll);
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
