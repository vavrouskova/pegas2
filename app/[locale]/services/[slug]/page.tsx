import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { getServiceBySlug } from '@/api/wordpress-api';
import BasicHeroSection from '@/components/_shared/BasicHeroSection';
import ContentSection from '@/components/_shared/ContentSection';
import FooterClaim from '@/components/_shared/FooterClaim';
import { getSeoDataBySlug } from '@/utils/seo';

interface ServiceDetailPageProps {
  params: Promise<{
    slug: string;
    locale: string;
  }>;
}

export async function generateMetadata({ params }: ServiceDetailPageProps): Promise<Metadata> {
  const { slug } = await params;

  return getSeoDataBySlug('sluzbyPost', slug);
}

const ServiceDetailPage = async ({ params }: ServiceDetailPageProps) => {
  const { slug } = await params;
  const [t, serviceData] = await Promise.all([getTranslations(), getServiceBySlug(slug)]);

  // Pokud služba nebyla nalezena, zobraz 404
  if (!serviceData) {
    notFound();
  }

  const { title, sluzbyAcf } = serviceData;
  const introText = sluzbyAcf?.introText || '';
  const image = sluzbyAcf?.introImageSluzby?.node?.sourceUrl || '/images/team-pegas.webp';
  const imageAlt = sluzbyAcf?.introImageSluzby?.node?.altText || title;

  return (
    <main className='max-w-container mx-auto'>
      <BasicHeroSection
        title={title}
        description={introText}
        image={image}
        imageAlt={imageAlt}
        pageTitle={title}
      />

      <ContentSection
        title={t('home.organized-by-us.title')}
        description={t('home.organized-by-us.description')}
        buttonText={t('home.organized-by-us.button-text')}
        link={t('home.organized-by-us.link')}
        sectionClassName='pt-[26rem] lg:pt-[15rem] pb-[21rem]'
        withFeathers
      />

      <FooterClaim />
    </main>
  );
};

export default ServiceDetailPage;
