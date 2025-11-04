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
        className='top-full left-1/2 mt-9.5 -translate-x-[6.75rem] translate-y-0'
      />
      <CarouselNext
        variant='ghost'
        className='top-full left-1/2 mt-9.5 translate-x-[4.75rem] translate-y-0'
      />

      {itemsCount > 1 && (
        <div className='absolute -bottom-14 left-1/2 flex -translate-x-1/2 space-x-2.5'>
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
