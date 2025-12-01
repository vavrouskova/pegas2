import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { checkSlugType, getBlogPostBySlug, getReferenceBySlug, getServiceBySlug } from '@/api/wordpress-api';
import BasicHeroSection from '@/components/_shared/BasicHeroSection';
import ContentSection from '@/components/_shared/ContentSection';
import DetailHeroSection from '@/components/_shared/DetailHeroSection';
import DynamicContentSection from '@/components/_shared/DynamicContentSection';
import FooterClaim from '@/components/_shared/FooterClaim';
import BranchDetailSection from '@/components/branches/BranchDetailSection';
import { decodeHtmlEntitiesServer, stripHtmlTags } from '@/utils/helper';
import { getSeoDataBySlug } from '@/utils/seo';

interface SlugPageProps {
  params: Promise<{
    slug: string;
    locale: string;
  }>;
}

export async function generateMetadata({ params }: SlugPageProps): Promise<Metadata> {
  const { slug } = await params;

  const slugType = await checkSlugType(slug);
  if (slugType === 'post') {
    return getSeoDataBySlug('post', slug);
  }

  if (slugType === 'referencePost') {
    return getSeoDataBySlug('referencePost', slug);
  }

  if (slugType === 'pobockaPost') {
    return getSeoDataBySlug('pobockaPost', slug);
  }

  return getSeoDataBySlug('sluzbyPost', slug);
}

const SlugPage = async ({ params }: SlugPageProps) => {
  const { slug } = await params;
  const t = await getTranslations();

  const slugType = await checkSlugType(slug);

  if (!slugType) {
    notFound();
  }

  if (slugType === 'post') {
    const blogData = await getBlogPostBySlug(slug);

    if (!blogData) {
      notFound();
    }
    const { title, excerpt, featuredImage, categories, components, date } = blogData;
    const introText = excerpt ? decodeHtmlEntitiesServer(stripHtmlTags(excerpt)) : '';
    const image = featuredImage?.node?.sourceUrl;
    const imageAlt = featuredImage?.node?.altText || title || '';

    const breadcrumbItems = [
      {
        label: t('blog.page-title'),
        href: `/${t('routes.blog')}`,
      },
    ];

    const validCategories = categories?.nodes?.filter((cat) => cat.databaseId !== 1) || [];
    if (validCategories.length > 0) {
      const category = validCategories[0];
      breadcrumbItems.push({
        label: category.name,
        href: `/${t('routes.blog')}?category=${category.databaseId}`,
      });
    }

    const hasComponents = components?.components && components.components.length > 0;

    return (
      <main className='max-w-container mx-auto'>
        <DetailHeroSection
          title={title}
          date={date}
          image={image}
          imageAlt={imageAlt}
          description={introText}
          pageTitle={title}
          breadcrumbItems={breadcrumbItems}
        />

        {hasComponents && (
          <DynamicContentSection
            components={components}
            categorySlug={categories?.nodes?.[0]?.slug}
            backLink={`/${t('routes.blog')}`}
            backLinkText={t('blog.back-to-blog')}
            className='lg:!pt-12.5'
          />
        )}

        <ContentSection
          title={t('home.organized-by-us.title')}
          description={t('home.organized-by-us.description')}
          buttonText={t('home.organized-by-us.button-text')}
          link={t('home.organized-by-us.link')}
          image={{ src: '/images/detail-service.webp', alt: t('home.about-us.alt') }}
          imagePosition='left'
        />

        <FooterClaim />
      </main>
    );
  }

  if (slugType === 'referencePost') {
    const referenceData = await getReferenceBySlug(slug);

    if (!referenceData) {
      notFound();
    }

    const { title, referenceACF, featuredImage, typReference, components } = referenceData;
    const farewellDate = referenceACF?.farewellDate || '';
    const farewellPlace = referenceACF?.farewellPlace || '';
    const image = referenceACF?.introImage?.node?.sourceUrl || featuredImage?.node?.sourceUrl;
    const imageAlt = referenceACF?.introImage?.node?.altText || featuredImage?.node?.altText || title || '';

    const breadcrumbItems = [
      {
        label: t('references.page-title'),
        href: `/${t('routes.references')}`,
      },
    ];

    if (typReference?.nodes && typReference.nodes.length > 0) {
      const category = typReference.nodes[0];
      breadcrumbItems.push({
        label: category.name,
        href: `/${t('routes.references')}?category=${category.databaseId}`,
      });
    }

    const hasComponents = components?.components && components.components.length > 0;

    return (
      <main className='max-w-container mx-auto'>
        <DetailHeroSection
          title={title}
          farewellDate={farewellDate}
          farewellPlace={farewellPlace}
          image={image}
          imageAlt={imageAlt}
          pageTitle={title}
          breadcrumbItems={breadcrumbItems}
        />

        {hasComponents && (
          <DynamicContentSection
            components={components}
            categorySlug={typReference?.nodes?.[0]?.slug}
            backLink={`/${t('routes.references')}`}
            backLinkText={t('references.back-to-references')}
            className='lg:!pt-12.5'
          />
        )}

        <ContentSection
          title={t('home.about-us.title')}
          description={t('home.about-us.description')}
          buttonText={t('home.about-us.button-text')}
          link={t('home.about-us.link')}
          imagePosition='left'
          image={{ src: '/images/about-us.webp', alt: t('home.about-us.alt') }}
        />

        <FooterClaim />
      </main>
    );
  }

  if (slugType === 'pobockaPost') {
    return (
      <main className='max-w-container mx-auto'>
        <BranchDetailSection slug={slug} />
      </main>
    );
  }

  const serviceData = await getServiceBySlug(slug);

  if (!serviceData) {
    notFound();
  }

  const { title, sluzbyAcf, components, typSluzby } = serviceData;
  const introText = sluzbyAcf?.introText || '';
  const image = sluzbyAcf?.introImageSluzby?.node?.sourceUrl;
  const imageAlt = sluzbyAcf?.introImageSluzby?.node?.altText || title;

  const breadcrumbItems = [
    {
      label: t('header.services'),
      href: `/${t('routes.services')}`,
    },
  ];

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
        contentClassName='max-w-dynamic-content'
        decorativeImage='flowers'
      />

      <DynamicContentSection
        components={components}
        categorySlug={typSluzby?.nodes?.[0]?.slug}
        className='lg:!pt-12.5'
      />

      <ContentSection
        title={t('services.service-detail.contact-us.title')}
        description={t('services.service-detail.contact-us.description')}
        buttonText={t('services.service-detail.contact-us.button-text')}
        link={t('routes.contacts')}
      />

      <ContentSection
        title={t('home.organized-by-us.title')}
        description={t('home.organized-by-us.description')}
        buttonText={t('home.organized-by-us.button-text')}
        link={t('home.organized-by-us.link')}
        image={{ src: '/images/detail-service.webp', alt: t('home.about-us.alt') }}
        imagePosition='left'
      />

      <FooterClaim />
    </main>
  );
};

export default SlugPage;
