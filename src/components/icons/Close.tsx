import React from 'react';

import { ClassNameProps } from '@/utils/types';

const Close = ({ className }: ClassNameProps) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='30'
      height='30'
      viewBox='0 0 30 30'
      fill='none'
      className={className}
    >
      <g>
        <path
          d='M8 31.7849L6.25 29.996L13.25 22.8406L6.25 15.6851L8 13.8962L15 21.0517L22 13.8962L23.75 15.6851L16.75 22.8406L23.75 29.996L22 31.7849L15 24.6294L8 31.7849Z'
          fill='currentColor'
        />
      </g>
    </svg>
  );
};

export default Close;
