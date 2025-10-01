'use client';

import HolyLoader from 'holy-loader';
import React, { useState } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

interface ProviderProps {
  children: React.ReactNode;
}

const BaseProvider = ({ children }: ProviderProps) => {
  const [client] = useState(new QueryClient());

  return (
    <QueryClientProvider client={client}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
      <HolyLoader
        color='#6F5577'
        height='0.15rem'
        speed={250}
        easing='linear'
      />
    </QueryClientProvider>
  );
};

export default BaseProvider;
