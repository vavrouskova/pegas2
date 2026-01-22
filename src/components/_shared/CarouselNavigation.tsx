import { CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { cn } from '@/lib/utils';

interface CarouselNavigationProps {
  itemsCount: number;
  currentIndex: number;
  // eslint-disable-next-line no-unused-vars
  onDotClick: (index: number) => void;
  /** Maximum number of dots to show. If items exceed this, dots represent groups */
  maxDots?: number;
  /** Additional className for responsive hiding */
  className?: string;
}

export const CarouselNavigation = ({
  itemsCount,
  currentIndex,
  onDotClick,
  maxDots = 7,
  className,
}: CarouselNavigationProps) => {
  // Calculate how dots map to slides
  const dotsCount = Math.min(itemsCount, maxDots);
  const itemsPerDot = itemsCount <= maxDots ? 1 : Math.ceil(itemsCount / maxDots);
  const activeDotIndex = Math.min(Math.floor(currentIndex / itemsPerDot), dotsCount - 1);

  const handleDotClick = (dotIndex: number) => {
    // Navigate to the first slide of that dot's group
    const targetSlide = dotIndex * itemsPerDot;
    onDotClick(Math.min(targetSlide, itemsCount - 1));
  };

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
        <div
          className={cn(
            'absolute -bottom-10.5 left-1/2 flex -translate-x-1/2 items-center gap-2.5 lg:-bottom-7.5',
            className
          )}
        >
          <CarouselPrevious
            variant='ghost'
            className='relative top-4 lg:hidden'
          />

          <div className='flex space-x-2.5'>
            {Array.from({ length: dotsCount }).map((_, dotIndex) => (
              <span
                key={`dot-${dotIndex}`}
                onClick={() => handleDotClick(dotIndex)}
                className={`size-3 cursor-pointer rounded-full transition-all duration-500 ${activeDotIndex === dotIndex ? 'bg-primary' : 'bg-grey-cold'}`}
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
