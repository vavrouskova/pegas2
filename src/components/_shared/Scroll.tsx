'use client';

import { useLenis } from 'lenis/react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { scrollControl } from '@/utils/scroll-control';

const LenisScrollEffect = () => {
  const pathname = usePathname();
  const searchParameters = useSearchParams();
  const lenis = useLenis();

  // Prevent native scroll restoration interfering with Lenis
  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Reset scroll position on route change
  useEffect(() => {
    if (scrollControl.skipNext) {
      scrollControl.skipNext = false;
      return;
    }

    const hash = window.location.hash;

    if (hash) {
      // For hash navigation, use native browser scrolling (bypass Lenis)
      const scrollToHash = () => {
        const elementId = hash.replace('#', '');
        // eslint-disable-next-line unicorn/prefer-query-selector
        const element = document.getElementById(elementId);

        if (element) {
          // Disable Lenis temporarily
          if (lenis) {
            lenis.stop();
          }

          // First scroll to top immediately
          window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

          // Then scroll to element with native browser scroll
          setTimeout(() => {
            const elementTop = element.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top: elementTop, left: 0, behavior: 'smooth' });

            // Re-enable Lenis after scroll completes
            // eslint-disable-next-line sonarjs/no-nested-functions
            setTimeout(() => {
              if (lenis) {
                lenis.start();
              }
            }, 1000);
          }, 100);
        }
      };

      scrollToHash();
    } else {
      // No hash: scroll to top with Lenis
      if (lenis) {
        lenis.stop();
        lenis.scrollTo(0, { immediate: true, force: true });
        setTimeout(() => lenis.start(), 50);
      }

      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      }
    }
  }, [pathname, searchParameters, lenis]);

  // Handle hash changes within the same page (without Lenis)
  useEffect(() => {
    const handleHashChange = () => {
      const newHash = window.location.hash;

      if (newHash) {
        const elementId = newHash.replace('#', '');
        // eslint-disable-next-line unicorn/prefer-query-selector
        const element = document.getElementById(elementId);

        if (element) {
          // Disable Lenis for hash scroll
          if (lenis) {
            lenis.stop();
          }

          // Use native browser scroll
          const elementTop = element.getBoundingClientRect().top + window.scrollY - 100;
          window.scrollTo({ top: elementTop, left: 0, behavior: 'smooth' });

          // Re-enable Lenis after scroll
          setTimeout(() => {
            if (lenis) {
              lenis.start();
            }
          }, 1000);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [lenis]);

  return null;
};

export default LenisScrollEffect;
