import Image from 'next/image';
import Link from 'next/link';

import { FormattedText } from '@/components/_shared/FormattedText';
import ArrowRight from '@/components/icons/ArrowRight';

interface TransportCard {
  title: string;
  description: string;
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

const TransportSection = ({ id, title, description, cards }: TransportSectionProps) => {
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

      <div className='grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3'>
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className='group flex flex-col overflow-hidden'
          >
            <picture className='relative aspect-[4/3] w-full overflow-hidden'>
              <Image
                src={card.image}
                alt={card.imageAlt}
                fill
                sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                className='object-cover transition-transform duration-300 group-hover:scale-105'
              />
            </picture>
            <div className='bg-primary flex flex-1 flex-col justify-between gap-4 p-6'>
              <div className='flex flex-col gap-1.5'>
                <h3 className='text-white-smoke font-heading text-lg'>
                  {card.title}
                </h3>
                <p className='text-white-smoke/70 font-text text-sm leading-relaxed'>
                  {card.description}
                </p>
              </div>
              <div className='text-white-smoke flex items-center gap-2'>
                <span className='text-white-smoke font-heading text-base'>Zjistěte podrobnosti</span>
                <ArrowRight className='size-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1' />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default TransportSection;
