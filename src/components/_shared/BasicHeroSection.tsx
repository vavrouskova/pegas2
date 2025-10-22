import Image from 'next/image';

import Breadcrumbs from '@/components/_shared/Breadcrumbs';
import LeavesAnimation from '@/components/_shared/LeavesAnimation';
import { czechTypography } from '@/lib/utils';

interface BasicHeroSectionProps {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  pageTitle: string;
}

const BasicHeroSection = ({ title, description, image, imageAlt, pageTitle }: Readonly<BasicHeroSectionProps>) => {
  return (
    <section className='relative px-4 sm:px-14 lg:px-44'>
      <LeavesAnimation />
      <Breadcrumbs pageTitle={pageTitle} />
      <div className='mx-auto max-w-[1272px] pt-[7.75rem]'>
        <div className='relative z-10 mb-5 flex max-w-[35.75rem] flex-col gap-8 lg:mb-8'>
          <h1 className='text-4xl'>{czechTypography(title)}</h1>
          <p className='text-primary text-xl'>{czechTypography(description)}</p>
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
