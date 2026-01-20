'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import Logo from '@/components/header/Logo';
import MobileMenu from '@/components/header/MobileMenu';
import { SearchTriggerButton } from '@/components/header/SearchTriggerButton';
import Search from '@/components/icons/Search';
import { cn } from '@/lib/utils';
import { getUniqueId } from '@/utils/helper';

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

  return (
    <>
      <Logo className='lg:mb-[0.19rem]' />
      <nav className='2lg:gap-8 hidden gap-6 lg:flex'>
        {headerLinks.map((link) => (
          <Link
            href={link.href}
            key={getUniqueId()}
            className={cn(
              'hover:text-secondary text-sm transition-all duration-300 hover:opacity-70 xl:text-base',
              isActiveLink(link.href) ? 'font-cta' : 'font-text'
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className='flex items-center gap-4'>
        <SearchTriggerButton>
          <Search className='h-6 w-6' />
        </SearchTriggerButton>
        <MobileMenu headerLinks={headerLinks} />
      </div>
    </>
  );
};

export default HeaderContent;
