import Link from 'next/link';
import React from 'react';

import ArrowRight from '@/components/icons/ArrowRight';
import { cn } from '@/lib/utils';

interface LinkWithArrowProps {
  href: string;
  target?: string;
  title?: string;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'destructive';
}

const LinkWithArrow = ({ href, target, title, onClick, className, variant = 'primary' }: LinkWithArrowProps) => {
  return (
    <Link
      href={href}
      target={target}
      className={cn(
        'flex items-center gap-3 text-lg transition-opacity duration-300 hover:opacity-90',
        variant === 'primary' && 'text-primary',
        variant === 'destructive' && 'text-white-smoke',
        className
      )}
      onClick={onClick}
    >
      {title}
      <ArrowRight className='size-5 shrink-0' />
    </Link>
  );
};

export default LinkWithArrow;
