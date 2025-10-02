import React from 'react';

import { ClassNameProps } from '@/utils/types';

const Facebook = ({ className }: ClassNameProps) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='16'
      height='30'
      viewBox='0 0 16 30'
      fill='none'
      className={className}
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M10.2371 29.25V16.2508H14.6578L15.3211 11.1832H10.2371V7.94834C10.2371 6.48163 10.6482 5.48209 12.7824 5.48209L15.5 5.48099V0.948403C15.03 0.888147 13.4168 0.75 11.5392 0.75C7.61838 0.75 4.93414 3.11118 4.93414 7.44646V11.1832H0.5V16.2508H4.93414V29.25H10.2371Z'
        fill='currentColor'
      />
    </svg>
  );
};

export default Facebook;
