'use client';

import Link from 'next/link';
import React from 'react';

import Logo from '@/components/header/Logo';
import MobileMenu from '@/components/header/MobileMenu';
import { SearchTriggerButton } from '@/components/header/SearchTriggerButton';
import Search from '@/components/icons/Search';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { cn } from '@/lib/utils';
import { getUniqueId } from '@/utils/helper';

interface HeaderLink {
  href: string;
  label: string;
}

interface StickyHeaderProps {
  headerLinks: HeaderLink[];
}

const StickyHeader = ({ headerLinks }: StickyHeaderProps) => {
  const { scrollDirection, isScrolled } = useScrollDirection({ threshold: 100 });

  const isVisible = isScrolled && scrollDirection === 'up';

  return (
    <header
      className={cn(
        'bg-white-smoke fixed top-0 right-0 left-0 z-50 shadow-sm transition-transform duration-300 ease-out',
        isVisible ? 'translate-y-0' : '-translate-y-full'
      )}
    >
      <div className='mx-auto flex w-full max-w-378 items-end justify-between px-6 py-2 lg:px-14 lg:py-4'>
        <Logo className='lg:mb-[0.19rem]' />
        <div className='2lg:gap-8 hidden gap-6 lg:flex'>
          {headerLinks.map((link) => (
            <Link
              href={link.href}
              key={getUniqueId()}
              className='hover:text-secondary text-sm transition-all duration-300 hover:opacity-70 xl:text-base'
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className='flex items-center gap-4'>
          <SearchTriggerButton>
            <Search className='h-6 w-6' />
          </SearchTriggerButton>
          <MobileMenu headerLinks={headerLinks} />
        </div>
      </div>
    </header>
  );
};

export default StickyHeader;
