import { getTranslations } from 'next-intl/server';
import Image from 'next/image';

import Breadcrumbs from '@/components/_shared/Breadcrumbs';
import FadeIn from '@/components/_shared/FadeIn';
import FadeInOnActivity from '@/components/_shared/FadeInOnActivity';
import { FormattedText } from '@/components/_shared/FormattedText';
import { Link } from '@/i18n/routing';
import { PhoneNumber } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface MainHeroSectionProps {
  title: string | string[];
  description: string;
  branchesCount?: number;
  sectionClassName?: string;
  contentClassName?: string;
  imageClassName?: string;
  pageTitle?: string;
  noImage?: boolean;
  breadcrumbItems?: BreadcrumbItem[];
}

const MainHeroSection = async ({
  title,
  description,
  branchesCount = 0,
  sectionClassName,
  contentClassName,
  imageClassName,
  pageTitle,
  noImage = false,
  breadcrumbItems,
}: MainHeroSectionProps) => {
  const t = await getTranslations('home.hero');

  return (
    <section className={cn('px-4 pb-12.5 sm:px-14 lg:pb-35', sectionClassName)}>
      {pageTitle && (
        <Breadcrumbs
          pageTitle={pageTitle}
          items={breadcrumbItems}
        />
      )}
      <div className={cn('mx-auto mt-114 max-w-267.5', contentClassName)}>
        <div className={cn('max-w-lg-content flex flex-col justify-center gap-12 lg:gap-25')}>
          <div className='space-y-2.5'>
            <FadeIn
              delay={1.5}
              duration={0.45}
            >
              {Array.isArray(title) ? (
                <h1 className='flex flex-col gap-8'>
                  {title.map((line, index) => (
                    <FormattedText
                      key={index}
                      text={line}
                      as='span'
                      className='font-heading text-3xl leading-[150%]'
                    />
                  ))}
                </h1>
              ) : (
                <FormattedText
                  text={title}
                  as='h1'
                />
              )}
            </FadeIn>
            <FadeIn
              delay={1.8}
              duration={0.45}
            >
              <FormattedText
                text={description}
                as='p'
                className='text-lg'
              />
            </FadeIn>
          </div>
          <FadeInOnActivity
            delay={0.3}
            duration={1.5}
          >
            <div className='flex flex-col justify-between gap-7.5 text-lg md:flex-row lg:gap-4'>
              <div className='flex flex-col'>
                <span className='leading-9'>{t('contact-us')}</span>
                <Link
                  className='link'
                  href={`tel:${PhoneNumber}` as any}
                >
                  {PhoneNumber}
                </Link>
              </div>
              <div className='flex flex-col'>
                <span className='leading-9'>{t('prepare')}</span>
                <Link
                  className='link'
                  href={`/${t('needed-documents-link')}` as any}
                >
                  {t('needed-documents')}
                </Link>
              </div>
              <div className='flex flex-col'>
                <span className='leading-9'>{t('visit-us')}</span>
                <Link
                  className='link'
                  href='/contacts'
                >
                  {branchesCount} {t('branches')}
                </Link>
              </div>
            </div>
          </FadeInOnActivity>
        </div>
      </div>
      {!noImage && (
        <FadeIn delay={1.3}>
          <Image
            src='/images/wing.webp'
            alt='Background Image'
            width={2000}
            height={2000}
            className={cn('absolute top-20 right-0 z-[-1] w-180 min-w-140 lg:w-200 xl:top-40 xl:w-232', imageClassName)}
          />
        </FadeIn>
      )}
    </section>
  );
};

export default MainHeroSection;
