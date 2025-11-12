import Image from 'next/image';

import { FormattedText } from '@/components/_shared/FormattedText';

interface PageHeroSectionProps {
  title: string;
  description: string;
}

const PageHeroSection = ({ title, description }: PageHeroSectionProps) => {
  return (
    <section className='flex flex-col gap-2.5 lg:px-30'>
      <FormattedText
        text={title}
        as='h1'
      />

      <FormattedText
        text={description}
        as='p'
        className='max-w-content'
      />
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

export default PageHeroSection;
