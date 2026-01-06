import Image from 'next/image';
import Link from 'next/link';

import Button from '@/components/_shared/Button';
import { FormattedText } from '@/components/_shared/FormattedText';
import LeavesAnimation from '@/components/_shared/LeavesAnimation';

interface OtherService {
  id: string;
  title: string;
  slug: string;
  sluzbyAcf?: {
    introText?: string;
  };
}

interface OtherServicesSectionProps {
  services: OtherService[];
  id?: string;
}

const OtherServicesSection = ({ services, id }: OtherServicesSectionProps) => {
  if (!services || services.length === 0) {
    return null;
  }

  return (
    <section
      id={id}
      className='section-container relative max-lg:pt-100!'
    >
      <LeavesAnimation />
      <Image
        src='/images/leaves.webp'
        alt='Decorative leaves'
        width={300}
        height={300}
        className='absolute top-0 right-0 z-10 h-auto min-w-[26.8rem] shrink-0 translate-x-16 -translate-y-20 -scale-x-100 rotate-260 lg:hidden'
      />
      <div className='max-w-content relative z-10 flex flex-col gap-35 lg:ml-30'>
        {services.map((service) => (
          <div
            key={service.id}
            className='flex flex-col gap-7'
          >
            {/* Nadpis */}
            <FormattedText
              text={service.title}
              as='h2'
            />

            {/* Popis */}
            {service.sluzbyAcf?.introText && (
              <FormattedText
                text={service.sluzbyAcf.introText}
                as='p'
                className='text-lg'
              />
            )}

            {/* CTA tlačítko */}
            <Link
              href={`/${service.slug}`}
              className='mt-2 w-fit'
            >
              <Button buttonText='Detail služby' />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OtherServicesSection;
