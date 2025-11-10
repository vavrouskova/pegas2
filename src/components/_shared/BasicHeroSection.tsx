import Image from 'next/image';

import Breadcrumbs from '@/components/_shared/Breadcrumbs';
import { FormattedText } from '@/components/_shared/FormattedText';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BasicHeroSectionProps {
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  pageTitle: string;
  breadcrumbItems?: BreadcrumbItem[];
}

const BasicHeroSection = ({
  title,
  description,
  image,
  imageAlt = '',
  pageTitle = '',
  breadcrumbItems,
}: Readonly<BasicHeroSectionProps>) => {
  return (
    <section className='relative px-4 lg:px-14'>
      <Breadcrumbs
        pageTitle={pageTitle}
        items={breadcrumbItems}
      />
      <div className='max-w-section mx-auto pt-18 lg:pt-[11.65rem]'>
        <div className='max-w-lg-content relative z-10 mb-5 flex flex-col gap-2 lg:mb-12.5'>
          <FormattedText
            text={title}
            as='h1'
          />
          <FormattedText
            text={description}
            as='p'
            className='text-primary'
          />
        </div>
        {image && (
          <Image
            src={image}
            alt={imageAlt}
            width={1272}
            height={1272}
            className='relative z-0 h-auto w-full'
            priority
          />
        )}
      </div>
      <Image
        src='/images/leaves.webp'
        alt='Decorative leaves'
        width={300}
        height={300}
        className='absolute top-5 left-1/2 z-10 h-auto w-[31.8725rem] translate-x-[31rem] -scale-x-100 rotate-[260deg] max-lg:hidden'
      />
    </section>
  );
};

export default BasicHeroSection;
