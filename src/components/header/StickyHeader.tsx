'use client';

import { useEffect, useState } from 'react';

import HeaderContent, { HeaderLink } from '@/components/header/HeaderContent';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { cn } from '@/lib/utils';
import { MegamenuData } from '@/utils/data';

interface StickyHeaderProps {
  headerLinks: HeaderLink[];
  megamenuData: MegamenuData;
}

const getVisibilityClass = (isAtTop: boolean, isVisible: boolean) => {
  if (isAtTop) return 'hidden';
  if (isVisible) return 'translate-y-0 duration-300';
  return '-translate-y-full duration-300';
};

const StickyHeader = ({ headerLinks, megamenuData }: StickyHeaderProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent;
    const mobile =
      userAgent.includes('Mobile') ||
      userAgent.includes('Android') ||
      userAgent.includes('iPhone') ||
      userAgent.includes('iPad') ||
      userAgent.includes('iPod');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobile(mobile);
  }, []);

  const { scrollDirection, isScrolled } = useScrollDirection({ threshold: isMobile ? 0 : 24 });

  const isVisible = isScrolled && scrollDirection === 'up';
  const isAtTop = !isScrolled;

  return (
    <header
      className={cn(
        'bg-white-smoke fixed top-0 right-0 left-0 z-50 transition-all ease-out',
        getVisibilityClass(isAtTop, isVisible),
        isVisible ? 'opacity-100' : 'opacity-0'
      )}
    >
      <div className='mx-auto flex w-full max-w-378 items-end justify-between px-6 py-2 lg:px-14 lg:py-4'>
        <HeaderContent
          headerLinks={headerLinks}
          megamenuData={megamenuData}
          isVisible={isVisible}
        />
      </div>
    </header>
  );
};

export default StickyHeader;
