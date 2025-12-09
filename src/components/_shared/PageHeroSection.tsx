import Image from 'next/image';

import { FormattedText } from '@/components/_shared/FormattedText';
import { cn } from '@/lib/utils';

interface PageHeroSectionProps {
  title: string;
  description: string;
  classNameSection?: string;
  classNameContent?: string;
}

const PageHeroSection = ({ title, description, classNameSection, classNameContent }: PageHeroSectionProps) => {
  return (
    <section className={cn('lg:px-30', classNameSection)}>
      <div className={cn('flex flex-col gap-2.5', classNameContent)}>
        <FormattedText
          text={title}
          as='h1'
        />
        <FormattedText
          text={description}
          as='p'
          className='max-w-content text-primary'
        />
        <Image
          src='/images/leaves.webp'
          alt='Decorative leaves'
          width={300}
          height={300}
          className='absolute top-5 left-1/2 z-10 h-auto w-[31.8725rem] translate-x-[31rem] -scale-x-100 rotate-[260deg] max-lg:hidden'
        />
      </div>
    </section>
  );
};

export default PageHeroSection;
