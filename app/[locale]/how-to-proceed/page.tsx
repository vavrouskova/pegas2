import { getTranslations } from 'next-intl/server';
import React from 'react';

import MainHeroSection from '@/components/_shared/MainHeroSection';

const Homepage = async () => {
  const t = await getTranslations('home');

  return (
    <main className='max-w-container page-container mx-auto'>
      <MainHeroSection
        title={t('hero.title').replaceAll('<br/>', '\n')}
        description={t('hero.description').replaceAll('<br/>', '\n')}
      />
    </main>
  );
};

export default Homepage;
