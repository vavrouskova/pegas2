'use client';

import HolyLoader from 'holy-loader';
import React, { useState } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { ImageGalleryProvider } from '@/providers/ImageGalleryProvider';
import { ImageLightbox } from '@/components/_shared/ImageLightbox';

interface ProviderProps {
  children: React.ReactNode;
}

const BaseProvider = ({ children }: ProviderProps) => {
  const [client] = useState(new QueryClient());

  return (
    <QueryClientProvider client={client}>
      <ImageGalleryProvider>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
        <HolyLoader
          color='oklch(var(--tertiary))'
          height='0.15rem'
          speed={250}
          easing='linear'
        />
        <ImageLightbox />
      </ImageGalleryProvider>
    </QueryClientProvider>
  );
};

export default BaseProvider;
