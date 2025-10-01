import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import React from 'react';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('error_page');

  return {
    title: t('404.title'),
    description: t('404.description'),
  };
}

const NotFound = () => {
  return (
    <main className='relative z-10 bg-white'>
      <h1>Not Found</h1>
    </main>
  );
};

export default NotFound;
