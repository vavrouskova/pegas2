import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

import BasicHeroSection from '@/components/_shared/BasicHeroSection';
import Button from '@/components/_shared/Button';
import ContentSection from '@/components/_shared/ContentSection';
import DetailHeroSection from '@/components/_shared/DetailHeroSection';
import DynamicContentSection from '@/components/_shared/DynamicContentSection';
import FooterClaim from '@/components/_shared/FooterClaim';
import { FormattedText } from '@/components/_shared/FormattedText';
import LeavesImage from '@/components/_shared/LeavesImage';
import MainHeroSection from '@/components/_shared/MainHeroSection';
import PreviewBanner from '@/components/_shared/PreviewBanner';
import ViewItemTracker from '@/components/_shared/ViewItemTracker';
import BranchDetailSection from '@/components/branches/BranchDetailSection';
import ContactForm from '@/components/forms/contact/ContactForm';
import ServicesGridSection from '@/components/services/ServicesGridSection';
import { decodeHtmlEntitiesServer, stripHtmlTags } from '@/utils/helper';
import type { BlogPostDetail, PobockaPost, PostupPost } from '@/utils/wordpress-types';

type TranslationFunction = Awaited<ReturnType<typeof getTranslations>>;

interface RenderOptions {
  isPreview?: boolean;
  slug?: string;
}

export const renderBlogPost = (data: BlogPostDetail, t: TranslationFunction, options?: RenderOptions) => {
  const { isPreview } = options ?? {};
  const { title: rawTitle, excerpt, featuredImage, categories, components, date } = data;
  const title = rawTitle || '';
  const introText = excerpt ? decodeHtmlEntitiesServer(stripHtmlTags(excerpt)) : '';
  const image = featuredImage?.node?.sourceUrl;
  const imageAlt = featuredImage?.node?.altText || title || '';

  const breadcrumbItems = [{ label: t('blog.page-title'), href: `/${t('routes.blog')}` }];
  const validCategories = categories?.nodes?.filter((cat) => cat.databaseId !== 1) || [];
  if (validCategories.length > 0) {
    breadcrumbItems.push({
      label: validCategories[0].name,
      href: `/${t('routes.blog')}/${validCategories[0].slug}`,
    });
  }

  const hasComponents = components?.components && components.components.length > 0;

  return (
    <main className={`max-w-container mx-auto${isPreview ? ' pt-10' : ''}`}>
      {isPreview && <PreviewBanner />}
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
          categorySlug={validCategories[0]?.slug}
          backLink={`/${t('routes.blog')}`}
          backLinkText={t('blog.back-to-blog')}
          className='lg:pt-12.5!'
        />
      )}
      {!isPreview && (
        <ContentSection
          title={t('home.organized-by-us.title')}
          description={t('home.organized-by-us.description')}
          buttonText={t('home.organized-by-us.button-text')}
          link={t('home.organized-by-us.link')}
          image={{ src: '/images/detail-service.webp', alt: t('home.about-us.alt') }}
          imagePosition='left'
        />
      )}
      <FooterClaim />
    </main>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const renderReference = (data: any, t: TranslationFunction, options?: RenderOptions) => {
  const { isPreview } = options ?? {};
  const { title: rawTitle, referenceACF, featuredImage, typReference, components } = data;
  const title = rawTitle || '';
  const farewellDate = referenceACF?.farewellDate || '';
  const farewellPlace = referenceACF?.farewellPlace || '';
  const image = referenceACF?.introImage?.node?.sourceUrl || featuredImage?.node?.sourceUrl;
  const imageAlt = referenceACF?.introImage?.node?.altText || featuredImage?.node?.altText || title || '';

  const breadcrumbItems = [{ label: t('references.page-title'), href: `/${t('routes.references')}` }];
  if (typReference?.nodes && typReference.nodes.length > 0) {
    breadcrumbItems.push({
      label: typReference.nodes[0].name,
      href: `/${t('routes.references')}/${typReference.nodes[0].slug}`,
    });
  }

  const hasComponents = components?.components && components.components.length > 0;

  return (
    <main className={`max-w-container mx-auto${isPreview ? ' pt-10' : ''}`}>
      {isPreview && <PreviewBanner />}
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
          className='lg:pt-12.5!'
        />
      )}
      {!isPreview && (
        <ContentSection
          title={t('home.about-us.title')}
          description={t('home.about-us.description')}
          buttonText={t('home.about-us.button-text')}
          link={t('home.about-us.link')}
          imagePosition='left'
          image={{ src: '/images/about-us.webp', alt: t('home.about-us.alt') }}
        />
      )}
      <FooterClaim />
    </main>
  );
};

interface BranchRenderData {
  branch: PobockaPost;
  funeralEssentials: {
    taxonomy: { name: string; description: string } | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    posts: any[];
  };
}

export const renderBranch = (data: BranchRenderData, t: TranslationFunction, options?: RenderOptions) => {
  const { isPreview, slug = '' } = options ?? {};
  const { branch, funeralEssentials } = data;

  const branchTitle = branch?.title || slug;
  const branchCity = branch?.pobockyACF?.city || '';

  return (
    <main className={`max-w-container mx-auto${isPreview ? ' pt-10' : ''}`}>
      {isPreview && <PreviewBanner />}
      {!isPreview && (
        <ViewItemTracker
          itemId={slug}
          itemName={
            branchCity
              ? `${branchCity}, ${t('branches.branch')} ${branchTitle}`
              : `${t('branches.branch')} ${branchTitle}`
          }
          itemCategory={t('tracking.category-branches')}
          itemCategory2={t('tracking.category-services')}
        />
      )}
      <BranchDetailSection
        slug={slug}
        preloadedData={isPreview ? branch : undefined}
      />
      <ContactForm />
      <ServicesGridSection
        id='doplnkove-sluzby-a-produkty'
        title={funeralEssentials.taxonomy?.name || 'Doplňkové služby a produkty'}
        description={funeralEssentials.taxonomy?.description || ''}
        services={funeralEssentials.posts}
      />
      <FooterClaim />
    </main>
  );
};

interface PostupRenderData {
  postup: PostupPost;
  branchesCount: number;
}

export const renderPostup = (data: PostupRenderData, t: TranslationFunction, options?: RenderOptions) => {
  const { isPreview } = options ?? {};
  const { postup, branchesCount } = data;
  const { title: rawTitle, jakPostupovatAcf, components } = postup;
  const title = rawTitle || '';
  const topSubtitle = jakPostupovatAcf?.topSubtitle || '';
  const shortDescription = jakPostupovatAcf?.shortDescription || '';
  const bottomSubtitle = jakPostupovatAcf?.bottomSubtitle || '';

  const breadcrumbItems = [{ label: t('faq.page-title'), href: `/${t('routes.faq')}` }];
  const hasComponents = components?.components && components.components.length > 0;

  return (
    <main className={`max-w-container relative mx-auto${isPreview ? ' pt-10' : ''}`}>
      {isPreview && <PreviewBanner />}
      <LeavesImage />
      <MainHeroSection
        breadcrumbItems={breadcrumbItems}
        title={[title, topSubtitle]}
        description={shortDescription}
        branchesCount={branchesCount}
        pageTitle={title}
        noImage
        contentClassName='mt-18 lg:mt-[15.25rem] lg:ml-30 pb-25'
      />
      {hasComponents && (
        <DynamicContentSection
          components={components}
          showBackLink={false}
          className='lg:pt-12.5!'
        />
      )}
      <section className='section-container pt-0! lg:pt-0!'>
        <div className='max-w-dynamic-content mx-auto'>
          <FormattedText
            text={bottomSubtitle}
            as='h2'
            className='mb-2.5'
          />
          <FormattedText
            text={t('faq.branches-desc')}
            as='p'
            className='mb-12.5'
          />
          <Link
            href={`/${t('routes.contacts')}`}
            className='link'
          >
            <Button buttonText={t('faq.branches-button')} />
          </Link>
        </div>
      </section>
      {!isPreview && (
        <ContentSection
          title={t('home.organized-by-us.title')}
          description={t('home.organized-by-us.description')}
          buttonText={t('home.organized-by-us.button-text')}
          link={t('home.organized-by-us.link')}
          image={{ src: '/images/detail-service.webp', alt: t('home.about-us.alt') }}
          imagePosition='left'
        />
      )}
      <FooterClaim />
    </main>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const renderService = (data: any, t: TranslationFunction, options?: RenderOptions) => {
  const { isPreview, slug } = options ?? {};
  const { title: rawTitle, sluzbyAcf, components, typSluzby, id: serviceId } = data;
  const title = rawTitle || '';
  const introText = sluzbyAcf?.introText || '';
  const heroImage = sluzbyAcf?.introImageSluzby?.node?.sourceUrl;
  const imageAlt = sluzbyAcf?.introImageSluzby?.node?.altText || title;

  const breadcrumbItems = [{ label: t('header.services'), href: `/${t('routes.services')}` }];
  if (typSluzby?.nodes && typSluzby.nodes.length > 0) {
    breadcrumbItems.push({
      label: typSluzby.nodes[0].name,
      href: `/${t('routes.services')}#${typSluzby.nodes[0].slug}`,
    });
  }

  return (
    <main className={`max-w-container mx-auto${isPreview ? ' pt-10' : ''}`}>
      {isPreview && <PreviewBanner />}
      {!isPreview && (
        <ViewItemTracker
          itemId={serviceId}
          itemName={title}
          itemCategory={typSluzby?.nodes?.[0]?.name || t('tracking.category-services')}
          itemCategory2={
            typSluzby?.nodes?.[0]?.slug === 'doplnkove-sluzby-a-produkty'
              ? t('tracking.category-products')
              : t('tracking.category-services')
          }
        />
      )}
      <BasicHeroSection
        title={title}
        description={introText}
        image={heroImage}
        imageAlt={imageAlt}
        pageTitle={title}
        breadcrumbItems={breadcrumbItems}
        contentClassName='max-w-dynamic-content'
        decorativeImage='flowers'
      />
      <DynamicContentSection
        components={components}
        categorySlug={typSluzby?.nodes?.[0]?.slug}
        className='lg:pt-12.5!'
        imageBoxesDescriptionLineGap={slug === 'kytice-na-rakev' ? 'gap-1.5' : undefined}
      />
      {!isPreview && (
        <>
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
        </>
      )}
      <FooterClaim />
    </main>
  );
};
