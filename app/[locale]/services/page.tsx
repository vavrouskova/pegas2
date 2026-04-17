import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { getAllServicesData, getBranchesCount } from '@/api/wordpress-api';
import ContentSection from '@/components/_shared/ContentSection';
import FooterClaim from '@/components/_shared/FooterClaim';
import MainHeroSection from '@/components/_shared/MainHeroSection';
import PartnersSection from '@/components/_shared/PartnersSection';
import OtherServicesSection from '@/components/services/OtherServicesSection';
import ServicesGridSection from '@/components/services/ServicesGridSection';
import TransportSection from '@/components/services/TransportSection';
import { getSeoDataByUri } from '@/utils/seo';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('routes');

  return getSeoDataByUri('page', t('services'));
}

const ServicesPage = async () => {
  const [branchesCount, t, servicesData] = await Promise.all([
    getBranchesCount(),
    getTranslations(),
    getAllServicesData(),
  ]);

  const { funeralCeremonies, funeralEssentials, otherServices } = servicesData;

  // Vyfiltrovat repatriaci a vozový park z gridů — přesunou se do TransportSection
  const transportSlugs = ['repatriace', 'vozovy-park'];
  const filteredCeremonies = {
    ...funeralCeremonies,
    posts: funeralCeremonies.posts.filter((p: { slug: string }) => !transportSlugs.includes(p.slug)),
  };
  const filteredEssentials = {
    ...funeralEssentials,
    posts: funeralEssentials.posts.filter((p: { slug: string }) => !transportSlugs.includes(p.slug)),
  };

  return (
    <main className='max-w-container mx-auto'>
      <MainHeroSection
        title={t('services.hero.title')}
        description={t('services.hero.description')}
        branchesCount={branchesCount}
        pageTitle={t('services.hero.page-title')}
        contentClassName='lg:ml-30 mt-18 lg:mt-[15.25rem] pb-[8rem]'
        imageClassName='top-205 sm:top-170 md:top-135 lg:top-215 xl:top-235'
      />

      <TransportSection
        id='prevoz-zesnulych'
        title={t('services.transport.title')}
        description={t('services.transport.description')}
        cards={[
          {
            title: t('services.transport.cards.transport.title'),
            image: '/images/pegas-vozovy-park3.png',
            imageAlt: t('services.transport.cards.transport.title'),
            href: '/prevoz-zesnulych',
          },
          {
            title: t('services.transport.cards.repatriation.title'),
            image: '/images/pegas-repatriace.png',
            imageAlt: t('services.transport.cards.repatriation.title'),
            href: '/repatriace',
          },
          {
            title: t('services.transport.cards.fleet.title'),
            image: 'https://wp.pohrebpegas.cz/cz/wp-content/uploads/sites/2/2025/10/pegas-vozovy-park2-1.webp',
            imageAlt: t('services.transport.cards.fleet.title'),
            href: '/vozovy-park',
          },
        ]}
      />

      <div data-hide-sticky="">
        <ServicesGridSection
          id='smutecni-obrady'
          title={filteredCeremonies.taxonomy?.name || 'Smuteční obřady'}
          description={filteredCeremonies.taxonomy?.description || ''}
          services={filteredCeremonies.posts}
          type='service'
          itemCategory2={t('tracking.category-services')}
        />
      </div>

      <ContentSection
        title={t('home.organized-by-us.title')}
        description={t('home.organized-by-us.description')}
        buttonText={t('home.organized-by-us.button-text')}
        link={t('home.organized-by-us.link')}
        withFeathers
        featherPosition='right'
      />

      <ServicesGridSection
        id='doplnkove-sluzby-a-produkty'
        title={filteredEssentials.taxonomy?.name || 'Náležitosti pohřbu'}
        description={filteredEssentials.taxonomy?.description || ''}
        services={filteredEssentials.posts}
        type='product'
        itemCategory2={t('tracking.category-products')}
      />

      <OtherServicesSection
        services={otherServices}
        id='dalsi-sluzby'
      />

      <ContentSection
        title={t('services.b2b.title')}
        description={t('services.b2b.description')}
        buttonText={t('services.b2b.button-text')}
        link={t('services.b2b.link')}
        imagePosition='left'
        className='lg:py-80'
        image={{ src: '/images/room.webp', alt: t('home.about-us.alt') }}
      />

      <PartnersSection />

      <FooterClaim />
    </main>
  );
};

export default ServicesPage;
