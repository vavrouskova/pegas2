import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { getPageByUri } from '@/api/wordpress-api';
import Breadcrumbs from '@/components/_shared/Breadcrumbs';
import DynamicContentSection from '@/components/_shared/DynamicContentSection';
import FooterClaim from '@/components/_shared/FooterClaim';
import PageHeroSection from '@/components/_shared/PageHeroSection';
import PartnersSection from '@/components/_shared/PartnersSection';
import { getSeoDataByUri } from '@/utils/seo';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('routes');

  return getSeoDataByUri('page', t('gdpr'));
}

const GdprPage = async () => {
  const [t, gdprData] = await Promise.all([getTranslations(), getPageByUri('zasady-ochrany-osobnich-udaju')]);

  if (!gdprData) {
    notFound();
  }

  const { title, components } = gdprData;
  const hasComponents = components?.components && components.components.length > 0;

  return (
    <main className='max-w-container mx-auto'>
      <section className='px-4 sm:px-14'>
        <Breadcrumbs
          className='pb-18 lg:pb-43'
          pageTitle={title}
        />
        <PageHeroSection
          title={title}
          description={t('gdpr.hero.description')}
        />
      </section>

      {hasComponents && (
        <DynamicContentSection
          components={components}
          showBackLink={false}
          wider
        />
      )}

      <PartnersSection />

      <FooterClaim />
    </main>
  );
};

export default GdprPage;
