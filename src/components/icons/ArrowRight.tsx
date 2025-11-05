import React from 'react';

import { ClassNameProps } from '@/utils/types';

const ArrowRight = ({ className }: ClassNameProps) => {
  return (
    <svg
      width='26'
      height='26'
      viewBox='0 0 26 26'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M9.9782 4.9209C9.53072 4.47345 8.80522 4.47345 8.35774 4.9209C7.91027 5.36835 7.91027 6.09389 8.35774 6.54134L14.4225 12.6061L8.35774 18.6709C7.91027 19.1184 7.91027 19.8439 8.35774 20.2913C8.80522 20.7388 9.53072 20.7388 9.9782 20.2913L16.8532 13.4163C17.3007 12.9689 17.3007 12.2434 16.8532 11.7959L9.9782 4.9209Z'
        fill='currentColor'
      />
    </svg>
  );
};

export default ArrowRight;
