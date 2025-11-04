import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { getAboutUsTimeline, getZamestnanciPosts } from '@/api/wordpress-api';
import BasicHeroSection from '@/components/_shared/BasicHeroSection';
import BlogCarouselSection from '@/components/_shared/BlogCarouselSection';
import ContentSection from '@/components/_shared/ContentSection';
import FooterClaim from '@/components/_shared/FooterClaim';
import PartnersSection from '@/components/_shared/PartnersSection';
import Socials from '@/components/_shared/Socials';
import CitationSection from '@/components/about-us/CitationSection';
import EmployeesSection from '@/components/about-us/EmployeesSection';
import FoundationSection from '@/components/about-us/FoundationSection';
import TimelineSection from '@/components/about-us/TimelineSection';
import { FormattedText } from '@/components/_shared/FormattedText';
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

  const timeline = aboutUsData?.oNasACF?.timeline ?? [];

  return (
    <main className='max-w-container mx-auto'>
      <BasicHeroSection
        title={t('about-us.basic-hero.title')}
        description={t('about-us.basic-hero.description')}
        image='/images/team-pegas.webp'
        imageAlt='Team Pegas'
        pageTitle={t('about-us.basic-hero.page-title')}
      />

      <section className='section-container 2lg:py-16 relative pt-32 lg:pb-16'>
        <Socials />
        <div className='mx-auto flex max-w-[42.6875rem] flex-col gap-6'>
          <FormattedText
            text={t('about-us.experience.title')}
            as='h2'
            className='text-3xl'
          />
          <FormattedText
            text={t('about-us.experience.description')}
            as='p'
            className='text-lg'
          />
        </div>
      </section>

      {timeline.length > 0 && <TimelineSection timeline={timeline} />}

      <CitationSection
        quote={t('about-us.citation.text')}
        author={t('about-us.citation.author')}
        position={t('about-us.citation.position')}
      />

      <EmployeesSection
        employees={employees}
        managementTitle={t('about-us.employees.management-title')}
        teamTitle={t('about-us.employees.team-title')}
      />

      <BlogCarouselSection />

      <ContentSection
        title={t('about-us.faq.title')}
        description={t('about-us.faq.description')}
        buttonText={t('about-us.faq.button-text')}
        link={t('about-us.faq.link')}
        image={{ src: '/images/faq-image.webp', alt: t('about-us.faq.alt') }}
      />

      <ContentSection
        title={t('about-us.branches.title')}
        description={t('about-us.branches.description')}
        buttonText={t('about-us.branches.button-text')}
        link={t('about-us.branches.link')}
        image={{ src: '/images/room.webp', alt: t('about-us.branches.alt') }}
        imagePosition='left'
      />

      <FoundationSection />

      <PartnersSection />

      <FooterClaim />
    </main>
  );
};

export default AboutUsPage;
