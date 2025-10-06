import { getTranslations } from 'next-intl/server';
import React from 'react';

import ContentBox from '@/components/_shared/ContentBox';
import ContentWithImages from '@/components/_shared/ContentWithImages';
import FeatherAnimation from '@/components/_shared/FeatherAnimation';
import FooterClaim from '@/components/_shared/FooterClaim';
import MainHeroSection from '@/components/_shared/MainHeroSection';
import OrganizedCarouselSection from '@/components/_shared/OrganizedCarouselSection';
import ServicesSection from '@/components/_shared/ServicesSection';

const Homepage = async () => {
  const t = await getTranslations('home');

  return (
    <main className='max-w-container page-container mx-auto'>
      <MainHeroSection
        title={t('hero.title').replaceAll('<br/>', '\n')}
        description={t('hero.description').replaceAll('<br/>', '\n')}
        className='mb-60'
      />

      <OrganizedCarouselSection />

      <ContentWithImages
        title={t('how-to-proceed.title')}
        description={t('how-to-proceed.description')}
        buttonText={t('how-to-proceed.button-text')}
        link={t('how-to-proceed.link')}
        image={{ src: '/images/faq-image.webp', alt: 'How to proceed' }}
        className='mb-60'
      />

      <section className='mb-60'>
        <ContentBox
          title={t('services.title')}
          description={t('services.description').replaceAll('<br/>', '\n')}
          buttonText={t('services.button-text')}
          link={t('services.link')}
          className='max-w-[42.6875rem] lg:mx-auto'
        />
      </section>

      <ContentWithImages
        title={t('branches.title')}
        description={t('branches.description')}
        buttonText={t('branches.button-text')}
        link={t('branches.link')}
        image={{ src: '/images/room.webp', alt: 'Branches' }}
      />

      <section className='relative pt-[25rem] pb-[25rem]'>
        <ContentBox
          title={t('organized-by-us.title')}
          description={t('organized-by-us.description').replaceAll('<br/>', '\n')}
          buttonText={t('organized-by-us.button-text')}
          link={t('organized-by-us.link')}
          className='relative z-20 max-w-[42.6875rem] lg:mx-auto'
        />
        <FeatherAnimation />
      </section>

      <ContentWithImages
        title={t('about-us.title')}
        description={t('about-us.description')}
        buttonText={t('about-us.button-text')}
        link={t('about-us.link')}
        className='mb-60 lg:flex-row-reverse'
        image={{ src: '/images/about-us.webp', alt: 'About us' }}
      />

      <ServicesSection />

      <FooterClaim />
    </main>
  );
};

export default Homepage;
