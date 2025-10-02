import React from 'react';

import { ClassNameProps } from '@/utils/types';

const Instagram = ({ className }: ClassNameProps) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='30'
      height='30'
      viewBox='0 0 30 30'
      fill='none'
      className={className}
    >
      <path
        d='M15 9.49805C11.964 9.49805 9.49805 11.964 9.49805 15C9.49805 18.036 11.964 20.508 15 20.508C18.036 20.508 20.508 18.036 20.508 15C20.508 11.964 18.036 9.49805 15 9.49805Z'
        fill='currentColor'
      />
      <path
        d='M23.304 0H6.696C3.006 0 0 3.006 0 6.696V23.304C0 27 3.006 30 6.696 30H23.304C27 30 30 27 30 23.304V6.696C30 3.006 27 0 23.304 0ZM15 24.72C9.642 24.72 5.28 20.358 5.28 15C5.28 9.642 9.642 5.286 15 5.286C20.358 5.286 24.72 9.642 24.72 15C24.72 20.358 20.358 24.72 15 24.72ZM24.924 7.05C23.79 7.05 22.866 6.132 22.866 4.998C22.866 3.864 23.79 2.94 24.924 2.94C26.058 2.94 26.982 3.864 26.982 4.998C26.982 6.132 26.058 7.05 24.924 7.05Z'
        fill='currentColor'
      />
    </svg>
  );
};

export default Instagram;
