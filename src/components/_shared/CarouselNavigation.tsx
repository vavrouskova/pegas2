import React from 'react';

import { CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

interface CarouselNavigationProps {
  itemsCount: number;
  currentIndex: number;
  onDotClick: (index: number) => void;
}

export const CarouselNavigation = ({ itemsCount, currentIndex, onDotClick }: CarouselNavigationProps) => {
  return (
    <>
      <CarouselPrevious
        variant='ghost'
        className='left-0 top-1/2 -translate-x-full -translate-y-1/2'
      />
      <CarouselNext
        variant='ghost'
        className='right-0 top-1/2 translate-x-full -translate-y-1/2'
      />

      {itemsCount > 1 && (
        <div className='absolute -bottom-5 left-1/2 flex -translate-x-1/2 space-x-2.5'>
          {Array.from({ length: itemsCount }).map((_, index) => (
            <span
              key={`slide n.${index + 1}`}
              onClick={() => onDotClick(index)}
              className={`h-1.5 w-3 cursor-pointer rounded-full transition-all duration-500 ${currentIndex === index ? 'bg-primary w-6' : 'bg-white'}`}
            />
          ))}
        </div>
      )}
    </>
  );
};
