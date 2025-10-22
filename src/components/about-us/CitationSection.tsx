import Image from 'next/image';

import { czechTypography } from '@/lib/utils';

interface CitationSectionProps {
  quote: string;
  author: string;
  position: string;
}

const CitationSection = ({ quote, author, position }: Readonly<CitationSectionProps>) => {
  return (
    <section className='section-container relative pt-16 pb-40'>
      <div className='mx-auto flex max-w-[42.6875rem] flex-col gap-14 lg:gap-24'>
        <blockquote className='text-2xl leading-[2.0] lg:text-3xl'>{czechTypography(quote)}</blockquote>
        <footer>
          <p className='font-heading text-xl'>{czechTypography(author)}</p>
          <p className='text-sm'>{czechTypography(position)}</p>
        </footer>
      </div>
      <Image
        src='/images/leaves.webp'
        alt='Decorative leaves'
        width={300}
        height={300}
        className='absolute bottom-0 left-1/2 z-10 h-auto w-[20.8rem] shrink-0 -translate-x-1/8 translate-y-1/3 -scale-x-100 rotate-[260deg] lg:hidden'
      />
    </section>
  );
};

export default CitationSection;
