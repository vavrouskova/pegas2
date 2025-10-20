import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import React from 'react';

const Breadcrumbs = async ({ pageTitle }: { pageTitle: string }) => {
  const t = await getTranslations();
  return (
    <div className='z-10 flex items-center gap-2 pt-12'>
      <Link
        href='/'
        className='font-text text-sm underline underline-offset-2 hover:no-underline'
      >
        {t('common.home')}
      </Link>
      - <span className='font-text text-primary text-sm'>{pageTitle}</span>
    </div>
  );
};

export default Breadcrumbs;
