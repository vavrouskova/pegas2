import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { ClassNameProps } from '@/utils/types';

const Logo = ({ className }: ClassNameProps) => {
  return (
    <Link href='/'>
      <Image
        src='/images/icons/logo.svg'
        alt='Logo'
        width={160}
        height={35}
        priority
        className={className}
      />
    </Link>
  );
};

export default Logo;
