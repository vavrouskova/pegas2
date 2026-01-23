import React, { useState, useCallback } from 'react';

export const useImagePan = (scale: number) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const resetPosition = useCallback(() => {
    setPosition({ x: 0, y: 0 });
  }, []);

  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      if (scale > 1) {
        setIsDragging(true);
        setDragStart({
          x: event.clientX - position.x,
          y: event.clientY - position.y,
        });
      }
    },
    [scale, position.x, position.y]
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent) => {
      if (isDragging && scale > 1) {
        setPosition({
          x: event.clientX - dragStart.x,
          y: event.clientY - dragStart.y,
        });
      }
    },
    [isDragging, scale, dragStart.x, dragStart.y]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const getCursor = useCallback((): string => {
    if (scale <= 1) return 'default';
    return isDragging ? 'grabbing' : 'grab';
  }, [scale, isDragging]);

  return {
    position,
    isDragging,
    resetPosition,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    getCursor,
  };
};
