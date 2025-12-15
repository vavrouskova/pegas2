import React, { useEffect, useRef } from 'react';

import { IMAGE_GALLERY_CONFIG } from '@/config/imageGallery.config';
import { createImageGalleryNavigation } from '@/utils/imageGalleryNavigation';

interface UseImageTouchGesturesProps {
  containerRef: React.RefObject<HTMLDivElement>;
  isOpen: boolean;
  scale: number;
  currentIndex: number;
  totalImages: number;
  // eslint-disable-next-line no-unused-vars
  onZoomChange: (newScale: number) => void;
  onNavigateNext: () => void;
  onNavigatePrev: () => void;
}

export const useImageTouchGestures = ({
  containerRef,
  isOpen,
  scale,
  currentIndex,
  totalImages,
  onZoomChange,
  onNavigateNext,
  onNavigatePrev,
}: UseImageTouchGesturesProps) => {
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const initialDistanceRef = useRef<number>(0);

  useEffect(() => {
    if (!isOpen) return;

    const container = containerRef.current;
    if (!container) return;

    const navigation = createImageGalleryNavigation(currentIndex, totalImages);
    const { swipeThreshold, swipeVerticalTolerance, maxZoom, minZoom } = IMAGE_GALLERY_CONFIG.gestures;

    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length === 1) {
        touchStartRef.current = {
          x: event.touches[0].clientX,
          y: event.touches[0].clientY,
        };
      } else if (event.touches.length === 2) {
        // Pinch zoom start
        const distance = Math.hypot(
          event.touches[0].clientX - event.touches[1].clientX,
          event.touches[0].clientY - event.touches[1].clientY
        );
        initialDistanceRef.current = distance;
      }
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length === 2 && initialDistanceRef.current > 0) {
        event.preventDefault();
        // Pinch zoom
        const distance = Math.hypot(
          event.touches[0].clientX - event.touches[1].clientX,
          event.touches[0].clientY - event.touches[1].clientY
        );
        const newScale = (distance / initialDistanceRef.current) * scale;
        onZoomChange(Math.min(Math.max(newScale, minZoom), maxZoom));
        initialDistanceRef.current = distance;
      }
    };

    const handleTouchEnd = (event: TouchEvent) => {
      if (touchStartRef.current && event.changedTouches.length === 1 && scale === minZoom) {
        const deltaX = event.changedTouches[0].clientX - touchStartRef.current.x;
        const deltaY = Math.abs(event.changedTouches[0].clientY - touchStartRef.current.y);

        // Only trigger navigation if horizontal movement is significant and vertical is minimal
        if (Math.abs(deltaX) > swipeThreshold && deltaY < swipeVerticalTolerance) {
          if (deltaX > 0 && navigation.canNavigatePrev()) {
            onNavigatePrev();
          } else if (deltaX < 0 && navigation.canNavigateNext()) {
            onNavigateNext();
          }
        }
      }

      touchStartRef.current = null;
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isOpen, scale, currentIndex, totalImages, containerRef, onZoomChange, onNavigateNext, onNavigatePrev]);
};
