import Image from 'next/image';
import Link from 'next/link';

import { FormattedText } from '@/components/_shared/FormattedText';

interface TransportCard {
  title: string;
  description?: string;
  image: string;
  imageAlt: string;
  href: string;
}

interface TransportSectionProps {
  id: string;
  title: string;
  description: string;
  cards: TransportCard[];
}

const TransportSection = ({ id, title, description, cards = [] }: TransportSectionProps) => {
  return (
    <section
      id={id}
      className='section-container'
    >
      <div className='max-w-lg-content mb-16 flex flex-col gap-2.5 lg:ml-30'>
        <FormattedText
          text={title}
          as='h2'
        />
        <FormattedText
          text={description}
          as='p'
          className='text-lg leading-relaxed'
        />
      </div>

      <div className='grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-4'>
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className='group flex flex-col gap-2.5 transition-opacity duration-300 hover:opacity-80'
          >
            <div className='bg-grey-warm p-[13%]'>
              <div className='relative aspect-square w-full overflow-hidden'>
                <Image
                  src={card.image}
                  alt={card.imageAlt}
                  fill
                  sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
                  className='object-cover'
                />
              </div>
            </div>
            <FormattedText
              text={card.title}
              as='h3'
              className='text-lg leading-tight tracking-wide'
            />
          </Link>
        ))}
      </div>
    </section>
  );
};

export default TransportSection;
