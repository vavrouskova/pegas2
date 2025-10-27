import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { getServiceBySlug } from '@/api/wordpress-api';
import BasicHeroSection from '@/components/_shared/BasicHeroSection';
import ContentSection from '@/components/_shared/ContentSection';
import FooterClaim from '@/components/_shared/FooterClaim';
import ServiceContentSection from '@/components/services/ServiceContentSection';
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

  const { title, sluzbyAcf, components, typSluzby } = serviceData;
  const introText = sluzbyAcf?.introText || '';
  const image = sluzbyAcf?.introImageSluzby?.node?.sourceUrl || '/images/team-pegas.webp';
  const imageAlt = sluzbyAcf?.introImageSluzby?.node?.altText || title;

  // Sestavení breadcrumb items
  const breadcrumbItems = [
    {
      label: t('header.services'),
      href: `/${t('routes.services')}`,
    },
  ];

  // Pokud má služba kategorii, přidej ji do breadcrumbs
  if (typSluzby?.nodes && typSluzby.nodes.length > 0) {
    const category = typSluzby.nodes[0];
    breadcrumbItems.push({
      label: category.name,
      href: `/${t('routes.services')}#${category.slug}`,
    });
  }

  return (
    <main className='max-w-container mx-auto'>
      <BasicHeroSection
        title={title}
        description={introText}
        image={image}
        imageAlt={imageAlt}
        pageTitle={title}
        breadcrumbItems={breadcrumbItems}
      />

      <ServiceContentSection components={components} />

      <ContentSection
        title={t('home.organized-by-us.title')}
        description={t('home.organized-by-us.description')}
        buttonText={t('home.organized-by-us.button-text')}
        link={t('home.organized-by-us.link')}
        sectionClassName='pt-[15rem] pb-[21rem]'
        withFeathers
      />

      <FooterClaim />
    </main>
  );
};

export default ServiceDetailPage;
