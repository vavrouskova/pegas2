import { getTranslations } from 'next-intl/server';
import React from 'react';

import BlogCarouselSection from '@/components/_shared/BlogCarouselSection';
import ContentSection from '@/components/_shared/ContentSection';
import FooterClaim from '@/components/_shared/FooterClaim';
import MainHeroSection from '@/components/_shared/MainHeroSection';
import OrganizedCarouselSection from '@/components/_shared/OrganizedCarouselSection';
import ServicesSection from '@/components/_shared/ServicesSection';
import { formatTranslation } from '@/lib/utils';

const Homepage = async () => {
  const t = await getTranslations('home');

  return (
    <main className='max-w-container page-container mx-auto'>
      <MainHeroSection
        title={formatTranslation(t('hero.title'))}
        description={formatTranslation(t('hero.description'))}
        className='mb-60'
      />

      <OrganizedCarouselSection />

      <ContentSection
        title={t('how-to-proceed.title')}
        description={t('how-to-proceed.description')}
        buttonText={t('how-to-proceed.button-text')}
        link={t('how-to-proceed.link')}
        image={{ src: '/images/faq-image.webp', alt: t('how-to-proceed.alt') }}
        className='mb-60'
      />

      <ContentSection
        title={t('services.title')}
        description={formatTranslation(t('services.description'))}
        buttonText={t('services.button-text')}
        link={t('services.link')}
        sectionClassName='mb-60'
      />

      <ContentSection
        title={t('branches.title')}
        description={t('branches.description')}
        buttonText={t('branches.button-text')}
        link={t('branches.link')}
        image={{ src: '/images/room.webp', alt: t('branches.alt') }}
      />

      <ContentSection
        title={t('organized-by-us.title')}
        description={formatTranslation(t('organized-by-us.description'))}
        buttonText={t('organized-by-us.button-text')}
        link={t('organized-by-us.link')}
        sectionClassName='pt-[25rem] pb-[25rem]'
        withFeathers
      />

      <BlogCarouselSection />

      <ContentSection
        title={t('about-us.title')}
        description={t('about-us.description')}
        buttonText={t('about-us.button-text')}
        link={t('about-us.link')}
        imagePosition='left'
        className='mb-60'
        image={{ src: '/images/about-us.webp', alt: t('about-us.alt') }}
      />

      <ServicesSection />

      <FooterClaim />
    </main>
  );
};

export default Homepage;
