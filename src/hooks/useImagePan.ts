import { useState } from 'react';

export const useImagePan = (scale: number) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const resetPosition = () => {
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (event: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: event.clientX - position.x,
        y: event.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: event.clientX - dragStart.x,
        y: event.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const getCursor = (): string => {
    if (scale <= 1) return 'default';
    return isDragging ? 'grabbing' : 'grab';
  };

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
