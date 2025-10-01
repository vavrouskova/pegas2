'use client';

import { useLenis } from 'lenis/react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const LenisScrollEffect = () => {
  const pathname = usePathname();
  const searchParameters = useSearchParams();
  const lenis = useLenis();

  // Prevent native scroll restoration interfering with Lenis, especially on Safari
  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      const previous = window.history.scrollRestoration as string;
      window.history.scrollRestoration = 'manual';
      return () => {
        window.history.scrollRestoration = previous as History['scrollRestoration'];
      };
    }
  }, []);

  useEffect(() => {
    // Robust reset to top on route/search change with Safari fallbacks
    const resetScrollTop = () => {
      // Try Lenis immediate reset first
      if (lenis) {
        lenis.scrollTo(0, { immediate: true });
        // Safari sometimes needs a second tick
        requestAnimationFrame(() => {
          lenis.scrollTo(0, { immediate: true });
        });
      }

      // Fallbacks for browsers where Lenis isn't ready or overridden
      requestAnimationFrame(() => {
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
          // Extra Safari guard
          // Some Safari versions rely on setting both documentElement and body
          if ((window as unknown as { pageYOffset?: number }).pageYOffset) {
            (document.documentElement || document.body).scrollTop = 0;
          }
        }
      });

      // Final guard after layout settles
      setTimeout(() => {
        if (typeof window !== 'undefined' && Math.round(window.scrollY) !== 0) {
          window.scrollTo(0, 0);
          (document.documentElement || document.body).scrollTop = 0;
        }
      }, 60);
    };

    resetScrollTop();
  }, [pathname, searchParameters, lenis]);

  return null;
};

export default LenisScrollEffect;
