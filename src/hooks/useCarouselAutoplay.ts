import { useEffect, useRef, useState } from 'react';

import type { CarouselApi } from '@/components/ui/carousel';

interface UseCarouselAutoplayOptions {
  autoplayInterval?: number;
  threshold?: number;
}

interface UseCarouselAutoplayReturn {
  currentIndex: number;
  api: CarouselApi | null;
  setApi: (api: CarouselApi | null) => void;
  carouselRef: React.RefObject<HTMLDivElement | null>;
  isHovering: boolean;
  setIsHovering: (hovering: boolean) => void;
  goToSlide: (index: number) => void;
}

export function useCarouselAutoplay({
  autoplayInterval = 6000,
  threshold = 0.3,
}: UseCarouselAutoplayOptions = {}): UseCarouselAutoplayReturn {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const goToSlide = (index: number) => {
    if (api) api.scrollTo(index);
  };

  useEffect(() => {
    if (!api) return;
    const handleSelect = () => setCurrentIndex(api.selectedScrollSnap());
    handleSelect();
    api.on('select', handleSelect);
    api.on('reInit', handleSelect);
    return () => {
      api.off('select', handleSelect);
      api.off('reInit', handleSelect);
    };
  }, [api]);

  useEffect(() => {
    if (!carouselRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        threshold,
        rootMargin: '0px',
      }
    );

    observer.observe(carouselRef.current);

    return () => observer.disconnect();
  }, [threshold]);

  useEffect(() => {
    if (!api || !isInView) return;
    const interval = setInterval(() => {
      if (isHovering) return;
      api.scrollNext();
    }, autoplayInterval);
    return () => clearInterval(interval);
  }, [api, isHovering, isInView, autoplayInterval]);

  return {
    currentIndex,
    api,
    setApi,
    carouselRef,
    isHovering,
    setIsHovering,
    goToSlide,
  };
}
