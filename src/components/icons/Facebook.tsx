import React from 'react';

import { ClassNameProps } from '@/utils/types';

const Facebook = ({ className }: ClassNameProps) => {
  return (
    <svg
      width='11'
      height='22'
      viewBox='0 0 11 22'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M7.14952 22V11.9619H10.3905L10.8742 8.05302H7.13984V5.55628C7.13984 4.42046 7.43975 3.65302 9.00704 3.65302H11V0.153488C10.6517 0.102326 9.47142 0 8.08795 0C5.22427 0 3.25066 1.8214 3.25066 5.16744V8.05302H0V11.9619H3.25066V22H7.13984H7.14952Z'
        fill='currentColor'
      />
    </svg>
  );
};

export default Facebook;
