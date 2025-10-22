import Link from 'next/link';

import Button from '@/components/_shared/Button';
import { czechTypography } from '@/lib/utils';

interface TransportFeature {
  title: string;
  description: string;
}

interface TransportSectionProps {
  title: string;
  description: string;
  features: TransportFeature[];
  primaryButton: {
    text: string;
    link: string;
  };
  secondaryButton: {
    text: string;
    link: string;
  };
}

const TransportSection = ({ title, description, features, primaryButton, secondaryButton }: TransportSectionProps) => {
  return (
    <section className='section-container py-20 md:py-32 lg:py-40'>
      <div className='max-w-[42.6875rem]'>
        {/* Hlavní nadpis a popis */}
        <div className='mb-9 flex flex-col gap-8'>
          <h2>{czechTypography(title)}</h2>
          <p className='text-lg leading-relaxed whitespace-pre-line'>{czechTypography(description)}</p>
        </div>

        {/* Výhody/Features */}
        <div className='mb-9 flex flex-col gap-6'>
          {features.map((feature, index) => (
            <div
              key={index}
              className='flex flex-col gap-2.5'
            >
              <h4 className='text-xl'>{czechTypography(feature.title)}</h4>
              <p className='text-lg leading-relaxed'>{czechTypography(feature.description)}</p>
            </div>
          ))}
        </div>

        {/* CTA tlačítka */}
        <div className='flex flex-col items-start gap-6 sm:flex-row sm:items-center'>
          <Link href={`/${primaryButton.link}`}>
            <Button buttonText={primaryButton.text} />
          </Link>
          <Link
            href={`/${secondaryButton.link}`}
            className='text-lg font-bold underline decoration-solid transition-opacity hover:opacity-70'
          >
            <Button
              variant='destructive'
              buttonText={secondaryButton.text}
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TransportSection;
