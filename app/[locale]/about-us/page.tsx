import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { getAboutUsTimeline, getReferencePosts, getZamestnanciPosts } from '@/api/wordpress-api';
import BasicHeroSection from '@/components/_shared/BasicHeroSection';
import ContentSection from '@/components/_shared/ContentSection';
import FooterClaim from '@/components/_shared/FooterClaim';
import { FormattedText } from '@/components/_shared/FormattedText';
import PartnersSection from '@/components/_shared/PartnersSection';
import ReferencesCarouselSection from '@/components/_shared/ReferencesCarouselSection';
import CitationSection from '@/components/about-us/CitationSection';
import EmployeesSection from '@/components/about-us/EmployeesSection';
import TimelineSection from '@/components/about-us/TimelineSection';
import ContactForm from '@/components/forms/contact/ContactForm';
import { getSeoDataByUri } from '@/utils/seo';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('routes');

  return getSeoDataByUri('page', t('about-us'));
}

const AboutUsPage = async () => {
  const [t, aboutUsData, employees, referencePostsData] = await Promise.all([
    getTranslations(),
    getAboutUsTimeline(),
    getZamestnanciPosts(),
    getReferencePosts(6),
  ]);

  const timeline = aboutUsData?.oNasACF?.timeline ?? [];
  const referencePosts = referencePostsData?.nodes ?? [];

  return (
    <main className='max-w-container mx-auto'>
      <BasicHeroSection
        title={t('about-us.basic-hero.title')}
        description={t('about-us.basic-hero.description')}
        image='/images/team-pegas.webp'
        imageAlt='Team Pegas'
        pageTitle={t('about-us.basic-hero.page-title')}
      />

      <section className='relative px-4 pt-25 pb-12.5 lg:px-14 '>
        <div className='max-w-section mx-auto'>
          <div className='max-w-lg-content flex flex-col gap-6'>
            <FormattedText
              text={t('about-us.experience.title')}
              as='h2'
            />
            <FormattedText
              text={t('about-us.experience.description')}
              as='p'
            />
          </div>
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

      <ContentSection
        title={t('about-us.faq.title')}
        description={t('about-us.faq.description')}
        buttonText={t('about-us.faq.button-text')}
        link={t('about-us.faq.link')}
        image={{ src: '/images/support.webp', alt: t('about-us.faq.alt') }}
      />

      <ReferencesCarouselSection referencePosts={referencePosts} />

      <ContentSection
        title={t('about-us.branches.title')}
        description={t('about-us.branches.description')}
        buttonText={t('about-us.branches.button-text')}
        link={t('about-us.branches.link')}
        image={{ src: '/images/room.webp', alt: t('about-us.branches.alt') }}
      />

      <PartnersSection />

      <ContactForm />

      <FooterClaim />
    </main>
  );
};

export default AboutUsPage;
