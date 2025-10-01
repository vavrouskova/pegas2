import { getTranslations } from 'next-intl/server';
import React from 'react';

import ContentBox from '@/components/_shared/ContentBox';
import ContentWithImages from '@/components/_shared/ContentWithImages';
import MainHeroSection from '@/components/_shared/MainHeroSection';

const Homepage = async () => {
  const t = await getTranslations('home');

  return (
    <main className='max-w-container page-container mx-auto'>
      <MainHeroSection
        title={t('hero.title').replaceAll('<br/>', '\n')}
        description={t('hero.description').replaceAll('<br/>', '\n')}
        className='mb-60'
      />

      <ContentWithImages
        title={t('how-to-proceed.title')}
        description={t('how-to-proceed.description')}
        buttonText={t('how-to-proceed.button-text')}
        link={t('how-to-proceed.link')}
        variant='grid'
        className='mb-60'
        images={[
          { src: '/images/rose.webp', alt: 'How to proceed' },
          { src: '/images/wing.webp', alt: 'How to proceed' },
          { src: '/images/room.webp', alt: 'How to proceed' },
          { src: '/images/rose.webp', alt: 'How to proceed' },
        ]}
      />

      <section className='mb-60'>
        <ContentBox
          title={t('services.title')}
          description={t('services.description').replaceAll('<br/>', '\n')}
          buttonText={t('services.button-text')}
          link={t('services.link')}
          className='mx-auto max-w-[42.6875rem]'
        />
      </section>

      <ContentWithImages
        title={t('branches.title')}
        description={t('branches.description')}
        buttonText={t('branches.button-text')}
        link={t('branches.link')}
        variant='single'
        className='mb-60'
        images={[{ src: '/images/room.webp', alt: 'Branches' }]}
      />
    </main>
  );
};

export default Homepage;
