import Image from 'next/image';

import { FormattedText } from '@/components/_shared/FormattedText';

interface CitationSectionProps {
  quote: string;
  author: string;
  position: string;
}

const CitationSection = ({ quote, author, position }: Readonly<CitationSectionProps>) => {
  return (
    <section className='section-container relative pt-16 pb-40'>
      <div className='max-w-lg-content mx-auto flex flex-col gap-12'>
        <FormattedText
          text={quote}
          as='blockquote'
          className='text-2xl leading-[1.8]'
        />
        <div className='ml-auto w-fit'>
          <FormattedText
            text={author}
            as='p'
            className='font-heading text-xl'
          />
          <FormattedText
            text={position}
            as='p'
            className='text-sm'
          />
        </div>
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
