'use client';

import type Lenis from 'lenis';
import { useLenis } from 'lenis/react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

import {
  getSavedScrollPosition,
  saveScrollPosition,
  scrollControl,
} from '@/utils/scroll-control';

const generateId = (): string =>
  crypto.randomUUID?.() ?? Math.random().toString(36).slice(2) + Date.now().toString(36);

const HEADER_OFFSET = 100;

const scrollToElement = (
  element: HTMLElement,
  lenisInstance: Lenis | undefined,
) => {
  const elementTop = element.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;

  if (lenisInstance) {
    lenisInstance.scrollTo(elementTop, { immediate: false, duration: 1 });
  } else {
    window.scrollTo({ top: elementTop, left: 0, behavior: 'smooth' });
  }
};

const LenisScrollEffect = () => {
  const pathname = usePathname();
  const searchParameters = useSearchParams();
  const scrollIdRef = useRef<string | null>(null);
  const handledEntryRef = useRef<string | null>(null);
  const rafIdRef = useRef(0);

  const lenis = useLenis();
  // Ref keeps latest Lenis instance accessible inside effects without re-triggering them
  const lenisRef = useRef(lenis);
  lenisRef.current = lenis;

  // Prevent native scroll restoration interfering with Lenis
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Handle scroll position on route change
  // Detection: if history.state.__scrollId exists AND has a saved position → back/forward (restore)
  //            otherwise → new entry (scroll to top)
  useEffect(() => {
    if (scrollControl.skipNext) {
      scrollControl.skipNext = false;
      return;
    }

    const existingId = window.history.state?.__scrollId as string | undefined;

    // Skip if we already handled this exact history entry (prevents double-fire from
    // searchParams dependency changes triggering the effect again)
    if (existingId && handledEntryRef.current === existingId) {
      return;
    }

    const currentLenis = lenisRef.current;
    const hash = window.location.hash;

    if (hash) {
      if (scrollIdRef.current) {
        saveScrollPosition(scrollIdRef.current, currentLenis?.scroll ?? window.scrollY);
      }

      if (!existingId) {
        const newId = generateId();
        window.history.replaceState({ ...window.history.state, __scrollId: newId }, '');
        handledEntryRef.current = newId;
        scrollIdRef.current = newId;
      } else {
        handledEntryRef.current = existingId;
        scrollIdRef.current = existingId;
      }

      const elementId = hash.replace('#', '');
      // eslint-disable-next-line unicorn/prefer-query-selector
      const element = document.getElementById(elementId);

      if (element) {
        scrollToElement(element, currentLenis);
      }

      return;
    }

    // Check if this history entry was visited before (has saved scroll position)
    const saved = existingId ? getSavedScrollPosition(existingId) : null;
    let cancelled = false;

    if (saved !== null) {
      // Back/forward navigation — restore saved scroll position (or stay at top if saved === 0)
      handledEntryRef.current = existingId!;
      scrollIdRef.current = existingId!;

      if (saved > 0) {
        if (currentLenis) {
          currentLenis.scrollTo(saved, { immediate: true, force: true });
        } else {
          window.scrollTo({ top: saved, left: 0, behavior: 'auto' });
        }

        // Verify and retry if page wasn't tall enough yet
        const verifyRestore = (attempt: number) => {
          rafIdRef.current = requestAnimationFrame(() => {
            if (cancelled) return;

            // Read latest Lenis — it may have initialized between attempts
            const l = lenisRef.current;
            const actual = l?.scroll ?? window.scrollY;

            if (Math.abs(actual - saved) > 10 && attempt < 5) {
              if (l) {
                l.scrollTo(saved, { immediate: true, force: true });
              } else {
                window.scrollTo({ top: saved, left: 0, behavior: 'auto' });
              }
              verifyRestore(attempt + 1);
            } else if (Math.abs(actual - saved) > 10 && !l) {
              // Final fallback only when Lenis is unavailable — avoid desync
              window.scrollTo({ top: saved, left: 0, behavior: 'auto' });
            }
          });
        };

        verifyRestore(0);
      }
    } else {
      // New entry (forward navigation) — save outgoing page position, then scroll to top
      if (scrollIdRef.current) {
        saveScrollPosition(scrollIdRef.current, currentLenis?.scroll ?? window.scrollY);
      }

      const newId = generateId();
      window.history.replaceState({ ...window.history.state, __scrollId: newId }, '');
      handledEntryRef.current = newId;
      scrollIdRef.current = newId;

      // Scroll to top: immediate call forces position, RAF call ensures Lenis
      // internal state syncs on the next frame (Safari workaround)
      if (currentLenis) {
        currentLenis.scrollTo(0, { immediate: true });
        rafIdRef.current = requestAnimationFrame(() => {
          if (cancelled) return;
          lenisRef.current?.scrollTo(0, { immediate: true });
        });
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      }
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafIdRef.current);
    };
  }, [pathname, searchParameters]);

  // Handle hash changes within the same page
  useEffect(() => {
    const handleHashChange = () => {
      const newHash = window.location.hash;

      if (newHash) {
        const elementId = newHash.replace('#', '');
        // eslint-disable-next-line unicorn/prefer-query-selector
        const element = document.getElementById(elementId);

        if (element) {
          scrollToElement(element, lenisRef.current);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return null;
};

export default LenisScrollEffect;
