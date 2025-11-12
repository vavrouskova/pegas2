'use client';

import { useEffect } from 'react';

/**
 * Hook for handling mobile viewport height issues
 * Sets CSS custom property --vh to 1% of actual viewport height
 * Updates on resize to handle mobile browser address bar show/hide
 */
export const useViewportHeight = () => {
  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    // Set initial value
    setVh();

    // Update on resize (handles address bar show/hide)
    window.addEventListener('resize', setVh);

    // Also listen to orientation change
    window.addEventListener('orientationchange', setVh);

    return () => {
      window.removeEventListener('resize', setVh);
      window.removeEventListener('orientationchange', setVh);
    };
  }, []);
};
