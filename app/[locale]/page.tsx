import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import React from 'react';

import { getBranchesCount, getHomepageData } from '@/api/wordpress-api';
import ContentSection from '@/components/_shared/ContentSection';
import FooterClaim from '@/components/_shared/FooterClaim';
import HomepageSliderSection from '@/components/_shared/HomepageSliderSection';
import MainHeroSection from '@/components/_shared/MainHeroSection';
import ReferencesCarouselSection from '@/components/_shared/ReferencesCarouselSection';
import TestimonialsPreview from '@/components/_shared/TestimonialsPreview';
import ServicesSection from '@/components/_shared/ServicesSection';
import { getSeoDataByUri } from '@/utils/seo';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('routes');

  return getSeoDataByUri('page', t('home'));
}

const Homepage = async () => {
  const [homepageData, branchesCount, t] = await Promise.all([
    getHomepageData(),
    getBranchesCount(),
    getTranslations('home'),
  ]);

  const slides = homepageData?.homepageACF?.slider ?? [];
  const referencePosts = homepageData?.homepageACF?.selectedReference?.nodes ?? [];
  const services = homepageData?.homepageACF?.selectedSluzby?.nodes ?? [];

  return (
    <main className='max-w-container mx-auto'>
      <MainHeroSection
        title={t('hero.title')}
        description={t('hero.description')}
        branchesCount={branchesCount}
      />

      <HomepageSliderSection slides={slides} />

      <ContentSection
        title={t('faq.title')}
        description={t('faq.description')}
        buttonText={t('faq.button-text')}
        link={t('faq.link')}
        image={{ src: '/images/ceremonies.webp', alt: t('faq.alt') }}
      />

      <ContentSection
        title={t('services.title')}
        description={t('services.description')}
        buttonText={t('services.button-text')}
        link={t('services.link')}
        withFeathers
        featherPosition='left'
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
        description={t('organized-by-us.description')}
        buttonText={t('organized-by-us.button-text')}
        link={t('organized-by-us.link')}
        withFeathers
        featherPosition='right'
      />

      <ReferencesCarouselSection referencePosts={referencePosts} />

      <ContentSection
        title={t('about-us.title')}
        description={t('about-us.description')}
        buttonText={t('about-us.button-text')}
        link={t('about-us.link')}
        imagePosition='left'
        image={{ src: '/images/about-us.webp', alt: t('about-us.alt') }}
      />

      <TestimonialsPreview />

      <ServicesSection services={services} />

      <FooterClaim />
    </main>
  );
};

export default Homepage;
