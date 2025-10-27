import Image from 'next/image';

import Breadcrumbs from '@/components/_shared/Breadcrumbs';
import { FormattedText } from '@/components/_shared/FormattedText';
import LeavesAnimation from '@/components/_shared/LeavesAnimation';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BasicHeroSectionProps {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  pageTitle: string;
  breadcrumbItems?: BreadcrumbItem[];
}

const BasicHeroSection = ({
  title,
  description,
  image,
  imageAlt,
  pageTitle,
  breadcrumbItems,
}: Readonly<BasicHeroSectionProps>) => {
  return (
    <section className='relative px-4 sm:px-14 lg:px-44'>
      <LeavesAnimation />
      <Breadcrumbs
        pageTitle={pageTitle}
        items={breadcrumbItems}
      />
      <div className='mx-auto max-w-[1272px] pt-[7.75rem]'>
        <div className='relative z-10 mb-5 flex max-w-[35.75rem] flex-col gap-8 lg:mb-8'>
          <FormattedText
            text={title}
            as='h1'
            className='text-4xl'
          />
          <FormattedText
            text={description}
            as='p'
            className='text-primary text-xl'
          />
        </div>
        <Image
          src={image}
          alt={imageAlt}
          width={1272}
          height={1272}
          className='relative z-0 h-auto w-full'
          priority
        />
      </div>
      <Image
        src='/images/leaves.webp'
        alt='Decorative leaves'
        width={300}
        height={300}
        className='absolute top-0 right-0 z-0 h-auto w-[17.40625rem] shrink-0 translate-x-34 -translate-y-10 -scale-x-100 -rotate-[60deg] lg:hidden'
      />
    </section>
  );
};

export default BasicHeroSection;
