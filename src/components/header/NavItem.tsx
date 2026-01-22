'use client';

import { ChevronDown } from 'lucide-react';
import Link from 'next/link';

import { HeaderLink } from '@/components/header/HeaderContent';
import { cn } from '@/lib/utils';

interface NavItemProps {
  link: HeaderLink;
  isActive: boolean;
  isOpen?: boolean;
  hasMegamenu?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClick?: () => void;
}

export const NavItem = ({ link, isActive, isOpen, hasMegamenu, onMouseEnter, onMouseLeave, onClick }: NavItemProps) => {
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
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Link
        href={link.href}
        onClick={onClick}
        className={linkClassName}
      >
        {link.label}
        <ChevronDown className={cn('h-4 w-4 transition-transform duration-200', isOpen && 'rotate-180')} />
      </Link>
    </div>
  );
};
