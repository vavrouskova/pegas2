import React from 'react';

import { ClassNameProps } from '@/utils/types';

const Hamburger = ({ className }: ClassNameProps) => {
  return (
    <svg
      width='24'
      height='25'
      viewBox='0 0 24 25'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      <g>
        <path
          d='M3 7.94286V5.94286H21V7.94286H3ZM3 19.9429V17.9429H21V19.9429H3ZM3 13.9429V11.9429H21V13.9429H3Z'
          fill='currentColor'
        />
      </g>
    </svg>
  );
};

export default Hamburger;
