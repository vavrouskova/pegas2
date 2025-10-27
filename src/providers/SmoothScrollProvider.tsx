'use client';

import ReactLenis from 'lenis/react';

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
          return node.classList.contains('pm--box');
        },
      }}
    >
      <Scroll />
      {children}
    </ReactLenis>
  );
};

export default SmoothScrollProvider;
