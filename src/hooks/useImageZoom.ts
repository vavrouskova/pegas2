import React, { useState, useCallback } from 'react';

import { IMAGE_GALLERY_CONFIG } from '@/config/imageGallery.config';

export const useImageZoom = () => {
  const { maxZoom, minZoom, zoomStep, doubleClickZoom } = IMAGE_GALLERY_CONFIG.gestures;
  const [scale, setScale] = useState<number>(minZoom);

  const setScaleClamped = useCallback(
    (newScale: number) => {
      setScale(Math.min(Math.max(newScale, minZoom), maxZoom));
    },
    [minZoom, maxZoom]
  );

  const resetZoom = useCallback(() => {
    setScale(minZoom);
  }, [minZoom]);

  const handleWheel = useCallback(
    (event: React.WheelEvent) => {
      event.preventDefault();
      const delta = event.deltaY > 0 ? 1 - zoomStep : 1 + zoomStep;
      setScaleClamped(scale * delta);
    },
    [scale, zoomStep, setScaleClamped]
  );

  const handleDoubleClick = useCallback(() => {
    if (scale === minZoom) {
      setScale(doubleClickZoom);
    } else {
      resetZoom();
    }
  }, [scale, minZoom, doubleClickZoom, resetZoom]);

  return {
    scale,
    resetZoom,
    setScale: setScaleClamped,
    handleWheel,
    handleDoubleClick,
  };
};
