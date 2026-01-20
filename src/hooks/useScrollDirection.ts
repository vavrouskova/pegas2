'use client';

import { useLenis } from 'lenis/react';
import { useEffect, useRef, useState } from 'react';

type ScrollDirection = 'up' | 'down' | null;

interface UseScrollDirectionOptions {
  threshold?: number;
}

interface UseScrollDirectionReturn {
  scrollDirection: ScrollDirection;
  isScrolled: boolean;
  scrollY: number;
}

export const useScrollDirection = (options: UseScrollDirectionOptions = {}): UseScrollDirectionReturn => {
  const { threshold = 100 } = options;

  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const lastScrollY = useRef(0);

  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    const handleScroll = () => {
      const currentScrollY = lenis.scroll;

      setScrollY(currentScrollY);
      setIsScrolled(currentScrollY > threshold);

      if (currentScrollY <= threshold) {
        setScrollDirection(null);
        lastScrollY.current = currentScrollY;
        return;
      }

      const diff = currentScrollY - lastScrollY.current;

      // Only change direction if scrolled more than 10px (prevents jitter)
      if (Math.abs(diff) > 10) {
        setScrollDirection(diff > 0 ? 'down' : 'up');
        lastScrollY.current = currentScrollY;
      }
    };

    lenis.on('scroll', handleScroll);

    return () => {
      lenis.off('scroll', handleScroll);
    };
  }, [lenis, threshold]);

  return { scrollDirection, isScrolled, scrollY };
};
