import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

import Breadcrumbs from '@/components/_shared/Breadcrumbs';
import ContentSection from '@/components/_shared/ContentSection';
import FooterClaim from '@/components/_shared/FooterClaim';
import PageHeroSection from '@/components/_shared/PageHeroSection';
import ArrowRight from '@/components/icons/ArrowRight';
import { getSeoDataByUri } from '@/utils/seo';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('routes');

  return getSeoDataByUri('page', t('references'));
}

const ReferencesHubPage = async () => {
  const t = await getTranslations();

  const cards = [
    {
      title: t('references.hub.wrote-about-us-title'),
      description: t('references.hub.wrote-about-us-description'),
      href: `/${t('routes.references-wrote-about-us')}`,
      image: '/images/rose.webp',
      imageAlt: 'Napsali o nás',
    },
    {
      title: t('references.hub.organized-title'),
      description: t('references.hub.organized-description'),
      href: `/${t('routes.references-organized')}`,
      image: 'https://wp.pohrebpegas.cz/cz/wp-content/uploads/sites/2/2025/10/pegas-smutecni-kvetiny12.webp',
      imageAlt: 'Smuteční květiny a svíčky',
    },
  ];

  return (
    <main className='max-w-container relative mx-auto'>
      <Breadcrumbs
        className='px-4 pb-18 md:px-14 lg:pb-43'
        pageTitle={t('references.page-title')}
      />

      <PageHeroSection
        title={t('references.hero.title')}
        description={t('references.hero.description')}
        classNameSection='px-4 md:px-14 pb-25 lg:px-14'
        classNameContent='max-w-dynamic-content mx-auto'
      />

      <section className='px-4 pb-12.5 md:px-14 lg:pb-35'>
        <div className='max-w-dynamic-content mx-auto flex flex-col gap-6 lg:gap-8'>
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className='bg-primary group flex items-stretch overflow-hidden transition-opacity duration-300 hover:opacity-90 max-lg:flex-col lg:min-h-57.5 lg:flex-row'
            >
              <picture className='relative w-full shrink-0 max-lg:aspect-video lg:w-57.5'>
                <Image
                  src={card.image}
                  alt={card.imageAlt}
                  fill
                  sizes='(max-width: 1024px) 100vw, 230px'
                  className='object-cover'
                />
              </picture>
              <div className='flex flex-1 flex-col justify-between gap-4 px-6 py-8 lg:px-12 lg:py-10'>
                <div className='flex flex-col gap-2.5'>
                  <h2 className='text-white-smoke font-heading text-xl lg:text-2xl'>
                    {card.title}
                  </h2>
                  <p className='text-white-smoke/70 font-text text-sm leading-relaxed lg:text-base'>
                    {card.description}
                  </p>
                </div>
                <div className='text-white-smoke flex items-center gap-3'>
                  <span className='text-white-smoke font-heading text-lg'>
                    {t('common.find-out-more')}
                  </span>
                  <ArrowRight className='size-5 shrink-0 transition-transform duration-200 group-hover:translate-x-1' />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

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
};

export default ReferencesHubPage;
