'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';

import Logo from '@/components/header/Logo';
import { MegamenuOverlay } from '@/components/header/MegamenuOverlay';
import MobileMenu from '@/components/header/MobileMenu';
import { NavItem } from '@/components/header/NavItem';
import { SearchTriggerButton } from '@/components/header/SearchTriggerButton';
import Search from '@/components/icons/Search';
import { getMegamenuItems } from '@/utils/data';

export interface HeaderLink {
  id?: string;
  href: string;
  label: string;
  children?: HeaderLink[];
}

interface HeaderContentProps {
  headerLinks: HeaderLink[];
}

const HeaderContent = ({ headerLinks }: HeaderContentProps) => {
  const pathname = usePathname();
  const [isMegamenuOpen, setIsMegamenuOpen] = useState(false);

  const isActiveLink = (href: string) => {
    // Remove locale prefix for comparison (e.g., /cs/about -> /about)
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, '') || '/';
    const hrefWithoutLocale = href.replace(/^\/[a-z]{2}(?=\/|$)/, '') || '/';

    // Exact match for home, startsWith for other pages
    if (hrefWithoutLocale === '/') {
      return pathWithoutLocale === '/';
    }
    return pathWithoutLocale.startsWith(hrefWithoutLocale);
  };

  const handleMegamenuOpen = () => setIsMegamenuOpen(true);
  const handleMegamenuClose = () => setIsMegamenuOpen(false);

  return (
    <>
      <Logo className='lg:mb-[0.19rem]' />
      <nav className='2lg:gap-8 hidden gap-6 lg:flex'>
        {headerLinks.map((link) => (
          <NavItem
            key={link.id || link.href}
            link={link}
            isActive={isActiveLink(link.href)}
            megamenuItems={link.id ? getMegamenuItems(link.id) : undefined}
            onMegamenuOpen={handleMegamenuOpen}
            onMegamenuClose={handleMegamenuClose}
          />
        ))}
      </nav>
      <div className='flex items-center gap-4'>
        <SearchTriggerButton>
          <Search className='h-6 w-6' />
        </SearchTriggerButton>
        <MobileMenu headerLinks={headerLinks} />
      </div>
      <MegamenuOverlay isVisible={isMegamenuOpen} />
    </>
  );
};

export default HeaderContent;
