'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import Logo from '@/components/header/Logo';
import { MegamenuDropdown } from '@/components/header/MegamenuDropdown';
import { MegamenuOverlay } from '@/components/header/MegamenuOverlay';
import MobileMenu from '@/components/header/MobileMenu';
import { NavItem } from '@/components/header/NavItem';
import { SearchTriggerButton } from '@/components/header/SearchTriggerButton';
import Search from '@/components/icons/Search';
import { getMegamenuItemsFromData, MegamenuData } from '@/utils/data';

export interface HeaderLink {
  id?: string;
  href: string;
  label: string;
  children?: HeaderLink[];
}

interface HeaderContentProps {
  headerLinks: HeaderLink[];
  megamenuData: MegamenuData;
  isVisible?: boolean;
}

const HeaderContent = ({ headerLinks, megamenuData, isVisible }: HeaderContentProps) => {
  const pathname = usePathname();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [navLeftOffset, setNavLeftOffset] = useState(0);
  const [navBottomOffset, setNavBottomOffset] = useState(0);
  const [lastMenuItems, setLastMenuItems] = useState<HeaderLink[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navElementRef = useRef<HTMLElement | null>(null);

  const updateNavOffset = () => {
    if (navElementRef.current) {
      const rect = navElementRef.current.getBoundingClientRect();
      setNavLeftOffset(rect.left);
      // Add 16px gap below nav for consistent spacing
      setNavBottomOffset(rect.bottom + 16);
    }
  };

  useEffect(() => {
    updateNavOffset();
    window.addEventListener('resize', updateNavOffset);
    return () => window.removeEventListener('resize', updateNavOffset);
  }, []);

  // Recalculate offset when sticky header becomes visible
  useEffect(() => {
    if (isVisible) {
      // Small delay to ensure layout is complete after visibility change
      requestAnimationFrame(updateNavOffset);
    }
  }, [isVisible]);

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
    // Recalculate offset when menu opens to ensure correct position
    updateNavOffset();
    const items = getMegamenuItemsFromData(linkId, megamenuData);
    if (items) {
      setLastMenuItems(items);
    }
    setOpenMenuId(linkId);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenMenuId(null);
    }, 250);
  };

  const handleClose = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setOpenMenuId(null);
  };

  const currentMenuItems = openMenuId ? getMegamenuItemsFromData(openMenuId, megamenuData) : undefined;

  return (
    <>
      <Logo className='lg:mb-[0.19rem]' />
      <nav
        ref={navElementRef}
        className='2lg:gap-8 hidden gap-6 lg:flex'
      >
        {headerLinks.map((link) => {
          const megamenuItems = link.id ? getMegamenuItemsFromData(link.id, megamenuData) : undefined;
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
              onClick={hasMegamenu ? handleClose : undefined}
            />
          );
        })}
      </nav>
      <div className='flex items-center gap-4'>
        <SearchTriggerButton>
          <Search className='h-6 w-6' />
        </SearchTriggerButton>
        <MobileMenu
          headerLinks={headerLinks}
          megamenuData={megamenuData}
        />
      </div>
      <MegamenuOverlay isVisible={!!openMenuId} />
      <MegamenuDropdown
        items={currentMenuItems || lastMenuItems}
        isOpen={!!openMenuId}
        navLeftOffset={navLeftOffset}
        headerHeight={navBottomOffset}
        onMouseEnter={() => openMenuId && handleMouseEnter(openMenuId)}
        onMouseLeave={handleMouseLeave}
        onClose={handleClose}
      />
    </>
  );
};

export default HeaderContent;
