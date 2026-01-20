'use client';

import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useRef, useState } from 'react';

import { HeaderLink } from '@/components/header/HeaderContent';
import { MegamenuDropdown } from '@/components/header/MegamenuDropdown';
import { cn } from '@/lib/utils';

interface NavItemProps {
  link: HeaderLink;
  isActive: boolean;
  megamenuItems?: HeaderLink[];
  onMegamenuOpen?: () => void;
  onMegamenuClose?: () => void;
}

export const NavItem = ({ link, isActive, megamenuItems, onMegamenuOpen, onMegamenuClose }: NavItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasMegamenu = megamenuItems && megamenuItems.length > 0;

  const handleMouseEnter = () => {
    if (!hasMegamenu) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setIsOpen(true);
    onMegamenuOpen?.();
  };

  const handleMouseLeave = () => {
    if (!hasMegamenu) return;

    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      onMegamenuClose?.();
    }, 150);
  };

  const linkClassName = cn(
    'hover:text-secondary flex items-center gap-1 text-sm transition-all duration-300 hover:opacity-70 xl:text-base',
    isActive ? 'font-cta' : 'font-text'
  );

  if (!hasMegamenu) {
    return (
      <Link
        href={link.href}
        className={linkClassName}
      >
        {link.label}
      </Link>
    );
  }

  return (
    <div
      className='relative'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href={link.href}
        className={linkClassName}
      >
        {link.label}
        <ChevronDown className={cn('h-4 w-4 transition-transform duration-200', isOpen && 'rotate-180')} />
      </Link>
      <MegamenuDropdown
        items={megamenuItems}
        isOpen={isOpen}
      />
    </div>
  );
};
