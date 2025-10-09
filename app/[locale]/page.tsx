import { getTranslations } from 'next-intl/server';
import React from 'react';

import { getBranchesCount, getHomepageWithSelectedReference } from '@/api/wordpress-api';
import BlogCarouselSection from '@/components/_shared/BlogCarouselSection';
import ContentSection from '@/components/_shared/ContentSection';
import FooterClaim from '@/components/_shared/FooterClaim';
import MainHeroSection from '@/components/_shared/MainHeroSection';
import ReferencesCarouselSection from '@/components/_shared/ReferencesCarouselSection';
import ServicesSection from '@/components/_shared/ServicesSection';
import { formatTranslation } from '@/lib/utils';

const Homepage = async () => {
  const [homepageData, branchesCount, t] = await Promise.all([
    getHomepageWithSelectedReference(),
    getBranchesCount(),
    getTranslations('home'),
  ]);

  const referencePosts = homepageData?.homepageACF?.selectedPosts?.nodes || [];

  return (
    <main className='max-w-container page-container mx-auto'>
      <MainHeroSection
        title={formatTranslation(t('hero.title'))}
        description={formatTranslation(t('hero.description'))}
        branchesCount={branchesCount}
      />

      <ReferencesCarouselSection referencePosts={referencePosts} />

      <ContentSection
        title={t('how-to-proceed.title')}
        description={t('how-to-proceed.description')}
        buttonText={t('how-to-proceed.button-text')}
        link={t('how-to-proceed.link')}
        image={{ src: '/images/faq-image.webp', alt: t('how-to-proceed.alt') }}
      />

      <ContentSection
        title={t('services.title')}
        description={formatTranslation(t('services.description'))}
        buttonText={t('services.button-text')}
        link={t('services.link')}
        sectionClassName='pt-12 md:pt-40 pb-20 md:pb-48'
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
        sectionClassName='pt-[26rem] lg:pt-[15rem] pb-[21rem]'
        withFeathers
      />

      <BlogCarouselSection />

      <ContentSection
        title={t('about-us.title')}
        description={t('about-us.description')}
        buttonText={t('about-us.button-text')}
        link={t('about-us.link')}
        imagePosition='left'
        className='pb-40 lg:py-80'
        image={{ src: '/images/about-us.webp', alt: t('about-us.alt') }}
      />

      <ServicesSection />

      <FooterClaim />
    </main>
  );
};

export default Homepage;
