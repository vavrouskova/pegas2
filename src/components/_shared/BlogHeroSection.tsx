import { FormattedText } from '@/components/_shared/FormattedText';
import Image from 'next/image';

interface BlogHeroSectionProps {
  title: string;
  description: string;
}

const BlogHeroSection = ({ title, description }: BlogHeroSectionProps) => {
  return (
    <section className='relative flex flex-col gap-8 lg:px-30'>
      <FormattedText
        text={title}
        as='h1'
      />

      <FormattedText
        text={description}
        as='p'
        className='max-w-[549px] text-xl'
      />
      <Image
        src='/images/flowers.webp'
        alt='Blog Hero Image'
        width={1000}
        height={1000}
        className='absolute -top-full left-1/2 z-0 h-auto w-full max-w-[29.9375rem] min-w-[29.9375rem] translate-x-[80%] rotate-[-59.175deg]'
      />
    </section>
  );
};

export default BlogHeroSection;
