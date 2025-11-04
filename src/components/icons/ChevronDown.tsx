import React from 'react';

import { ClassNameProps } from '@/utils/types';

const ChevronDown = ({ className }: ClassNameProps) => {
  return (
    <svg
      width='21'
      height='24'
      viewBox='0 0 21 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M14.7908 10.2803C15.0697 9.98744 15.0697 9.51256 14.7908 9.21967C14.5118 8.92678 14.0596 8.92678 13.7806 9.21967L9.99999 13.1893L6.21934 9.21967C5.94041 8.92678 5.48813 8.92678 5.2092 9.21967C4.93027 9.51256 4.93027 9.98743 5.2092 10.2803L9.49491 14.7803C9.77386 15.0732 10.2261 15.0732 10.5051 14.7803L14.7908 10.2803Z'
        fill='currentColor'
      />
    </svg>
  );
};

export default ChevronDown;
