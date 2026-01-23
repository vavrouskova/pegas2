'use client';

import ReactLenis from 'lenis/react';
import React, { Suspense } from 'react';

import Scroll from '@/components/_shared/Scroll';

interface ProviderProps {
  children: React.ReactNode;
}

const SmoothScrollProvider = ({ children }: ProviderProps) => {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1,
        smoothWheel: true,
        prevent(node) {
          return node.classList.contains('pm--box') || node.closest('[data-lenis-prevent]') !== null;
        },
      }}
    >
      <Suspense fallback={null}>
        <Scroll />
      </Suspense>
      {children}
    </ReactLenis>
  );
};

export default SmoothScrollProvider;
