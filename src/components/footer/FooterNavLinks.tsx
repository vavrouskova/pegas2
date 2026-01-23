import Link from 'next/link';
import React from 'react';

import AntLogo from '@/components/icons/AntLogo';

interface NavLink {
  href: string;
  label: string;
}

interface FooterNavLinksProps {
  links: NavLink[];
  copyrightText: string;
}

export const FooterNavLinks = ({ links, copyrightText }: FooterNavLinksProps) => {
  return (
    <div className='max-w-container mt-10 flex flex-col justify-between gap-10 pt-4 md:mt-24 lg:flex-row lg:items-end'>
      <div className='flex flex-col gap-6'>
        <div className='text-tertiary flex gap-6 text-sm max-lg:flex-col lg:items-center lg:gap-4'>
          {links.map((link, index) => (
            <React.Fragment key={link.href}>
              {index > 0 && <span className='max-lg:hidden'>|</span>}
              <Link
                className='font-text text-sm transition-all duration-300 hover:opacity-70'
                href={link.href}
              >
                {link.label}
              </Link>
            </React.Fragment>
          ))}
        </div>
        <p className='text-tertiary text-sm'>{copyrightText}</p>
      </div>
      <Link
        href='https://www.antstudio.cz'
        target='_blank'
        title='(ant) – full-service digitální agentura'
      >
        <AntLogo />
      </Link>
    </div>
  );
};
