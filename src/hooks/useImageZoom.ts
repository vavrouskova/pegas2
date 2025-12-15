import React, { useState } from 'react';

import { IMAGE_GALLERY_CONFIG } from '@/config/imageGallery.config';

export const useImageZoom = () => {
  const { maxZoom, minZoom, zoomStep, doubleClickZoom } = IMAGE_GALLERY_CONFIG.gestures;
  const [scale, setScale] = useState<number>(minZoom);

  const setScaleClamped = (newScale: number) => {
    setScale(Math.min(Math.max(newScale, minZoom), maxZoom));
  };

  const resetZoom = () => {
    setScale(minZoom);
  };

  const handleWheel = (event: React.WheelEvent) => {
    event.preventDefault();
    const delta = event.deltaY > 0 ? 1 - zoomStep : 1 + zoomStep;
    setScaleClamped(scale * delta);
  };

  const handleDoubleClick = () => {
    if (scale === minZoom) {
      setScale(doubleClickZoom);
    } else {
      resetZoom();
    }
  };

  return {
    scale,
    resetZoom,
    setScale: setScaleClamped,
    handleWheel,
    handleDoubleClick,
  };
};
