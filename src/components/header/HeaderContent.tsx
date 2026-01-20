'use client';

import { usePathname } from 'next/navigation';
import { useCallback, useRef, useState } from 'react';

import Logo from '@/components/header/Logo';
import { MegamenuDropdown } from '@/components/header/MegamenuDropdown';
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
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [navLeftOffset, setNavLeftOffset] = useState(0);
  const [lastMenuItems, setLastMenuItems] = useState<HeaderLink[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navRef = useCallback((node: HTMLElement | null) => {
    if (node) {
      setNavLeftOffset(node.getBoundingClientRect().left);
    }
  }, []);

  const isActiveLink = (href: string) => {
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, '') || '/';
    const hrefWithoutLocale = href.replace(/^\/[a-z]{2}(?=\/|$)/, '') || '/';

    if (hrefWithoutLocale === '/') {
      return pathWithoutLocale === '/';
    }
    return pathWithoutLocale.startsWith(hrefWithoutLocale);
  };

  const handleMouseEnter = (linkId: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    const items = getMegamenuItems(linkId);
    if (items) {
      setLastMenuItems(items);
    }
    setOpenMenuId(linkId);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenMenuId(null);
    }, 150);
  };

  const currentMenuItems = openMenuId ? getMegamenuItems(openMenuId) : undefined;

  return (
    <>
      <Logo className='lg:mb-[0.19rem]' />
      <nav
        ref={navRef}
        className='2lg:gap-8 hidden gap-6 lg:flex'
      >
        {headerLinks.map((link) => {
          const megamenuItems = link.id ? getMegamenuItems(link.id) : undefined;
          const hasMegamenu = megamenuItems && megamenuItems.length > 0;

          return (
            <NavItem
              key={link.id || link.href}
              link={link}
              isActive={isActiveLink(link.href)}
              isOpen={openMenuId === link.id}
              hasMegamenu={hasMegamenu}
              onMouseEnter={hasMegamenu && link.id ? () => handleMouseEnter(link.id!) : undefined}
              onMouseLeave={hasMegamenu ? handleMouseLeave : undefined}
            />
          );
        })}
      </nav>
      <div className='flex items-center gap-4'>
        <SearchTriggerButton>
          <Search className='h-6 w-6' />
        </SearchTriggerButton>
        <MobileMenu headerLinks={headerLinks} />
      </div>
      <MegamenuOverlay isVisible={!!openMenuId} />
      <MegamenuDropdown
        items={currentMenuItems || lastMenuItems}
        isOpen={!!openMenuId}
        navLeftOffset={navLeftOffset}
        onMouseEnter={() => openMenuId && handleMouseEnter(openMenuId)}
        onMouseLeave={handleMouseLeave}
      />
    </>
  );
};

export default HeaderContent;
