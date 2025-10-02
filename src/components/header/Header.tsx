import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import Search from '@/components/icons/Search';
import { getHeaderLinks } from '@/utils/data';
import { getUniqueId } from '@/utils/helper';

const Header = async () => {
  const headerLinks = await getHeaderLinks();

  return (
    <header className='max-w-container mx-auto mt-6 px-12 py-4'>
      <div className='flex w-full items-end justify-between px-2'>
        <Link href='/'>
          <Image
            src='/images/icons/logo.svg'
            alt='Logo'
            width={160}
            height={35}
            className='mb-[0.19rem]'
          />
        </Link>
        <div className='flex gap-8'>
          {headerLinks.map((link) => (
            <Link
              href={link.href}
              key={getUniqueId()}
              className='hover:text-secondary transition-all duration-300 hover:scale-105'
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className='flex items-center gap-4'>
          <Search className='h-6 w-6' />
        </div>
      </div>
    </header>
  );
};

export default Header;
