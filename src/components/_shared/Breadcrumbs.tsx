import { cn } from '@/lib/utils';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import React from 'react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  pageTitle: string;
  items?: BreadcrumbItem[];
  className?: string;
}

const Breadcrumbs = async ({ pageTitle, items = [], className }: BreadcrumbsProps) => {
  const t = await getTranslations();

  // Pro mobilní zobrazení: zobrazit pouze první a poslední item, prostřední nahradit "..."
  const hasMultipleItems = items.length > 0;
  const secondItemHref = items[0]?.href;

  return (
    <div className={cn('relative z-10 flex flex-wrap items-center gap-2 pt-12 max-lg:pr-20', className)}>
      <Link
        href='/'
        className='font-text text-sm underline underline-offset-2 hover:no-underline'
      >
        {t('common.home')}
      </Link>

      {/* Desktop: zobrazit všechny items */}
      <div className='hidden items-center gap-2 lg:flex'>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            -
            {item.href ? (
              <Link
                href={item.href}
                className='font-text text-sm underline underline-offset-2 hover:no-underline'
              >
                {item.label}
              </Link>
            ) : (
              <span className='font-text text-sm'>{item.label}</span>
            )}
          </React.Fragment>
        ))}
        - <span className='font-text text-primary text-sm'>{pageTitle}</span>
      </div>

      {/* Mobile: zobrazit pouze ... s linkem na druhý item */}
      <div className='flex flex-wrap items-center gap-2 lg:hidden'>
        {hasMultipleItems && secondItemHref && (
          <>
            -
            <Link
              href={secondItemHref}
              className='font-text text-sm underline underline-offset-2 hover:no-underline'
            >
              ...
            </Link>
          </>
        )}
        - <span className='font-text text-primary text-sm'>{pageTitle}</span>
      </div>
    </div>
  );
};

export default Breadcrumbs;
