import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { checkSlugType, getBlogPostBySlug, getServiceBySlug } from '@/api/wordpress-api';
import BasicHeroSection from '@/components/_shared/BasicHeroSection';
import BlogDetailHeroSection from '@/components/_shared/BlogDetailHeroSection';
import ContentSection from '@/components/_shared/ContentSection';
import FooterClaim from '@/components/_shared/FooterClaim';
import DynamicContentSection from '@/components/_shared/DynamicContentSection';
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
        <BlogDetailHeroSection
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
            className='2lg:py-10 pt-10'
            socials={false}
            components={components}
            categorySlug={categories?.nodes?.[0]?.slug}
            backLink={`/${t('routes.blog')}`}
            backLinkText={t('blog.back-to-blog')}
          />
        )}

        <ContentSection
          title={t('home.organized-by-us.title')}
          description={t('home.organized-by-us.description')}
          buttonText={t('home.organized-by-us.button-text')}
          link={t('home.organized-by-us.link')}
          sectionClassName='pt-[26rem] lg:pt-[15rem] pb-[21rem]'
          withFeathers
        />
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
      />

      <DynamicContentSection
        components={components}
        categorySlug={typSluzby?.nodes?.[0]?.slug}
      />

      <ContentSection
        title={t('services.service-detail.contact-us.title')}
        description={t('services.service-detail.contact-us.description')}
        buttonText={t('services.service-detail.contact-us.button-text')}
        link={t('routes.contacts')}
        sectionClassName='py-30 lg:py-40'
      />

      <ContentSection
        title={t('home.organized-by-us.title')}
        description={t('home.organized-by-us.description')}
        buttonText={t('home.organized-by-us.button-text')}
        link={t('home.organized-by-us.link')}
        sectionClassName='pt-[26rem] lg:pt-[15rem] pb-[21rem]'
        withFeathers
      />

      <FooterClaim className='mt-0' />
    </main>
  );
};

export default SlugPage;
