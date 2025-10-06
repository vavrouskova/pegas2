import Link from 'next/link';
import React from 'react';

import Logo from '@/components/header/Logo';
import MobileMenu from '@/components/header/MobileMenu';
import Search from '@/components/icons/Search';
import { getHeaderLinks } from '@/utils/data';
import { getUniqueId } from '@/utils/helper';

const Header = async () => {
  const headerLinks = await getHeaderLinks();

  return (
    <header className='max-w-container mx-auto px-4 py-2 lg:mt-6 lg:px-12 lg:py-4'>
      <div className='flex w-full items-end justify-between px-2'>
        <Logo className='lg:mb-[0.19rem]' />
        <div className='2lg:gap-8 hidden gap-6 lg:flex'>
          {headerLinks.map((link) => (
            <Link
              href={link.href}
              key={getUniqueId()}
              className='hover:text-secondary transition-all duration-300 hover:opacity-70'
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className='flex items-center gap-4'>
          <Search className='h-6 w-6' />
          <MobileMenu headerLinks={headerLinks} />
        </div>
      </div>
    </header>
  );
};

export default Header;
