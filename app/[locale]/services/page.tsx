import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { getBranchesCount } from '@/api/wordpress-api';
import ContentSection from '@/components/_shared/ContentSection';
import FooterClaim from '@/components/_shared/FooterClaim';
import MainHeroSection from '@/components/_shared/MainHeroSection';
import PartnersSection from '@/components/_shared/PartnersSection';
import TransportSection from '@/components/services/TransportSection';
import { formatTranslation } from '@/lib/utils';
import { getSeoDataByUri } from '@/utils/seo';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('routes');

  return getSeoDataByUri('page', t('services'));
}

const ServicesPage = async () => {
  const [branchesCount, t] = await Promise.all([getBranchesCount(), getTranslations()]);

  return (
    <main className='max-w-container mx-auto'>
      <MainHeroSection
        title={formatTranslation(t('services.hero.title'))}
        description={formatTranslation(t('services.hero.description'))}
        branchesCount={branchesCount}
        pageTitle={t('services.hero.page-title')}
        noImage
      />

      <TransportSection
        title={t('services.transport.title')}
        description={t('services.transport.description')}
        features={[
          {
            title: t('services.transport.features.dignified-transport.title'),
            description: t('services.transport.features.dignified-transport.description'),
          },
          {
            title: t('services.transport.features.empathetic-approach.title'),
            description: t('services.transport.features.empathetic-approach.description'),
          },
          {
            title: t('services.transport.features.modern-facilities.title'),
            description: t('services.transport.features.modern-facilities.description'),
          },
        ]}
        primaryButton={{
          text: t('services.transport.primary-button'),
          link: 'kontakty',
        }}
        secondaryButton={{
          text: t('services.transport.secondary-button'),
          link: 'sluzby/repatriace',
        }}
      />

      <ContentSection
        title={t('home.organized-by-us.title')}
        description={formatTranslation(t('home.organized-by-us.description'))}
        buttonText={t('home.organized-by-us.button-text')}
        link={t('home.organized-by-us.link')}
        sectionClassName='pt-[26rem] lg:pt-[15rem] pb-[21rem]'
        withFeathers
      />

      <ContentSection
        title={t('home.about-us.title')}
        description={t('home.about-us.description')}
        buttonText={t('home.about-us.button-text')}
        link={t('home.about-us.link')}
        imagePosition='left'
        className='pb-40 lg:py-80'
        image={{ src: '/images/about-us.webp', alt: t('home.about-us.alt') }}
      />

      <PartnersSection />

      <FooterClaim />
    </main>
  );
};

export default ServicesPage;
