import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import React from 'react';

import { getAboutUsTimeline, getZamestnanciPosts } from '@/api/wordpress-api';
import BasicHeroSection from '@/components/_shared/BasicHeroSection';
import BlogCarouselSection from '@/components/_shared/BlogCarouselSection';
import ContentSection from '@/components/_shared/ContentSection';
import FooterClaim from '@/components/_shared/FooterClaim';
import PartnersSection from '@/components/_shared/PartnersSection';
import EmployeesSection from '@/components/about-us/EmployeesSection';
import FoundationSection from '@/components/about-us/FoundationSection';
import TimelineSection from '@/components/about-us/TimelineSection';
import { formatTranslation } from '@/lib/utils';
import { getSeoDataByUri } from '@/utils/seo';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('routes');

  return getSeoDataByUri('page', t('about-us'));
}

const AboutUsPage = async () => {
  const [t, aboutUsData, employees] = await Promise.all([
    getTranslations(),
    getAboutUsTimeline(),
    getZamestnanciPosts(),
  ]);
  const timeline = aboutUsData?.oNasACF?.timeline || [];

  return (
    <main className='max-w-container mx-auto'>
      <BasicHeroSection
        title={t('about-us.basic-hero.title')}
        description={t('about-us.basic-hero.description')}
        image='/images/team-pegas.webp'
        imageAlt='Team Pegas'
        pageTitle={t('about-us.basic-hero.page-title')}
      />

      <section className='section-container py-16'>
        <div className='mx-auto flex max-w-[42.6875rem] flex-col gap-6'>
          <h2 className='text-3xl'>{formatTranslation(t('about-us.experience.title'))}</h2>
          <p className='text-lg'>{t('about-us.experience.description')}</p>
        </div>
      </section>

      {timeline.length > 0 && <TimelineSection timeline={timeline} />}

      <section className='section-container py-16'>
        <div className='mx-auto flex max-w-[42.6875rem] flex-col gap-24'>
          <p className='text-3xl leading-[2.0]'>{t('about-us.citation.text')}</p>
          <div>
            <p className='font-heading text-xl'>{t('about-us.citation.author')}</p>
            <p className='text-sm'>{t('about-us.citation.position')}</p>
          </div>
        </div>
      </section>

      <EmployeesSection
        employees={employees}
        managementTitle={t('about-us.employees.management-title')}
        teamTitle={t('about-us.employees.team-title')}
      />

      <ContentSection
        title={t('about-us.how-to-proceed.title')}
        description={t('about-us.how-to-proceed.description')}
        buttonText={t('about-us.how-to-proceed.button-text')}
        link={t('about-us.how-to-proceed.link')}
        image={{ src: '/images/faq-image.webp', alt: t('about-us.how-to-proceed.alt') }}
      />

      <ContentSection
        title={t('home.branches.title')}
        description={t('home.branches.description')}
        buttonText={t('home.branches.button-text')}
        link={t('home.branches.link')}
        image={{ src: '/images/room.webp', alt: t('home.branches.alt') }}
        imagePosition='left'
      />

      <BlogCarouselSection />

      <FoundationSection />

      <PartnersSection />

      <FooterClaim />
    </main>
  );
};

export default AboutUsPage;
