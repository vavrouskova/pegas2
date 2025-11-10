import Image from 'next/image';

import { FormattedText } from '@/components/_shared/FormattedText';

interface CitationSectionProps {
  quote: string;
  author: string;
  position: string;
}

const CitationSection = ({ quote, author, position }: Readonly<CitationSectionProps>) => {
  return (
    <section className='relative px-4 pt-72 pb-40 lg:px-14 lg:pt-16'>
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
        className='absolute top-0 right-0 z-10 h-auto w-[18rem] translate-x-10 -translate-y-10 -scale-x-100 rotate-[260deg] lg:hidden'
      />
    </section>
  );
};

export default CitationSection;
