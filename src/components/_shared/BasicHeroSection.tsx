import Image from 'next/image';

import Breadcrumbs from '@/components/_shared/Breadcrumbs';
import LeavesAnimation from '@/components/_shared/LeavesAnimation';

interface BasicHeroSectionProps {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  pageTitle: string;
}

const BasicHeroSection = async ({ title, description, image, imageAlt, pageTitle }: BasicHeroSectionProps) => {
  return (
    <section className='relative px-4 sm:px-14 lg:px-44'>
      <LeavesAnimation />
      <Breadcrumbs pageTitle={pageTitle} />
      <div className='mx-auto max-w-[1272px] pt-[7.75rem]'>
        <div className='z-10 mb-8 flex max-w-[35.75rem] flex-col gap-8'>
          <h1 className='text-4xl'>{title}</h1>
          <p className='text-primary text-xl'>{description}</p>
        </div>
        <Image
          src={image}
          alt={imageAlt}
          width={1272}
          height={1272}
          className='relative z-0 h-auto w-full'
        />
      </div>
    </section>
  );
};

export default BasicHeroSection;
