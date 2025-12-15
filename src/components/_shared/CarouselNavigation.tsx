import { CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

interface CarouselNavigationProps {
  itemsCount: number;
  currentIndex: number;
  // eslint-disable-next-line no-unused-vars
  onDotClick: (index: number) => void;
}

export const CarouselNavigation = ({ itemsCount, currentIndex, onDotClick }: CarouselNavigationProps) => {
  return (
    <>
      <CarouselPrevious
        variant='ghost'
        className='hidden lg:absolute lg:top-1/2 lg:-left-2 lg:block lg:-translate-x-full lg:-translate-y-1/2'
      />
      <CarouselNext
        variant='ghost'
        className='hidden lg:absolute lg:top-1/2 lg:-right-2 lg:block lg:translate-x-full lg:-translate-y-1/2'
      />

      {itemsCount > 1 && (
        <div className='absolute -bottom-10.5 left-1/2 flex -translate-x-1/2 items-center gap-2.5 lg:-bottom-7.5'>
          <CarouselPrevious
            variant='ghost'
            className='relative top-4 lg:hidden'
          />

          <div className='flex space-x-2.5'>
            {Array.from({ length: itemsCount }).map((_, slideIndex) => (
              <span
                key={`slide n.${slideIndex + 1}`}
                onClick={() => onDotClick(slideIndex)}
                className={`size-3 cursor-pointer rounded-full transition-all duration-500 ${currentIndex === slideIndex ? 'bg-primary' : 'bg-grey-cold'}`}
              />
            ))}
          </div>

          <CarouselNext
            variant='ghost'
            className='relative top-4 lg:hidden'
          />
        </div>
      )}
    </>
  );
};
