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
    document.body.style.overflow = isOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
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
