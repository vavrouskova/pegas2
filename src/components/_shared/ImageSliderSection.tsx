'use client';

import Image from 'next/image';

import { ArticleGalleryWrapper } from '@/components/_shared/ArticleGalleryWrapper';
import { CarouselNavigation } from '@/components/_shared/CarouselNavigation';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { useCarouselAutoplay } from '@/hooks/useCarouselAutoplay';

interface SliderImage {
  altText?: string;
  sourceUrl?: string;
}

interface ImageSliderSectionProps {
  images: SliderImage[];
}

export const ImageSliderSection = ({ images }: ImageSliderSectionProps) => {
  const { currentIndex, setApi, carouselRef, setIsHovering, goToSlide } = useCarouselAutoplay();

  if (!images || images.length === 0) return null;

  return (
    <div
      ref={carouselRef}
      className='relative w-full'
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Carousel
        opts={{ align: 'start', loop: true }}
        setApi={setApi}
        className='w-full'
      >
        <CarouselContent>
          {images.map((image, index) => {
            if (!image.sourceUrl) return null;

            return (
              <CarouselItem
                key={index}
                className='w-full'
              >
                <ArticleGalleryWrapper
                  src={image.sourceUrl}
                  alt={image.altText || `Slide ${index + 1}`}
                  width={1200}
                  height={800}
                  caption={image.altText || ''}
                  wrapperClassName='relative w-full aspect-[16/9]'
                >
                  <Image
                    src={image.sourceUrl}
                    alt={image.altText || `Slide ${index + 1}`}
                    fill
                    className='object-cover'
                    sizes='(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 1200px'
                    priority={index === 0}
                  />
                </ArticleGalleryWrapper>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        {images.length > 1 && (
          <CarouselNavigation
            itemsCount={images.length}
            currentIndex={currentIndex}
            onDotClick={goToSlide}
          />
        )}
      </Carousel>
    </div>
  );
};
