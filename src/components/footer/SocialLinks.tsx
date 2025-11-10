import Link from 'next/link';
import React from 'react';

import Facebook from '@/components/icons/Facebook';
import Instagram from '@/components/icons/Instagram';
import { FacebookUrl, InstagramUrl } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface SocialLinksProps {
  className?: string;
}

export const SocialLinks = ({ className }: SocialLinksProps) => {
  const socialLinks = [
    { href: InstagramUrl, icon: Instagram, label: 'Instagram' },
    { href: FacebookUrl, icon: Facebook, label: 'Facebook' },
  ] as const;

  return (
    <div className={cn('flex gap-8', className)}>
      {socialLinks.map(({ href, icon: Icon, label }) => (
        <Link
          key={label}
          className='flex items-center justify-center transition-all duration-300 hover:opacity-70'
          href={href}
          aria-label={label}
        >
          <Icon className='text-white-smoke' />
        </Link>
      ))}
    </div>
  );
};
