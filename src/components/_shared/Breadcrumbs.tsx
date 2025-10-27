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
}

const Breadcrumbs = async ({ pageTitle, items = [] }: BreadcrumbsProps) => {
  const t = await getTranslations();
  return (
    <div className='relative z-10 flex items-center gap-2 pt-12'>
      <Link
        href='/'
        className='font-text text-sm underline underline-offset-2 hover:no-underline'
      >
        {t('common.home')}
      </Link>
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
  );
};

export default Breadcrumbs;
