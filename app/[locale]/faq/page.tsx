import { getTranslations } from 'next-intl/server';
import React from 'react';

import MainHeroSection from '@/components/_shared/MainHeroSection';
import { formatTranslation } from '@/lib/utils';

const Homepage = async () => {
  const t = await getTranslations('home');

  return (
    <main className='max-w-container page-container mx-auto'>
      <MainHeroSection
        title={formatTranslation(t('hero.title'))}
        description={formatTranslation(t('hero.description'))}
      />
    </main>
  );
};

export default Homepage;
