import Image from 'next/image';
import Link from 'next/link';

import Button from '@/components/_shared/Button';
import LeavesAnimation from '@/components/_shared/LeavesAnimation';
import { czechTypography } from '@/lib/utils';

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
}

const OtherServicesSection = ({ services }: OtherServicesSectionProps) => {
  if (!services || services.length === 0) {
    return null;
  }

  return (
    <section className='section-container relative pt-96 pb-20 lg:py-32'>
      <LeavesAnimation />
      <Image
        src='/images/leaves.webp'
        alt='Decorative leaves'
        width={300}
        height={300}
        className='absolute top-0 right-0 z-10 h-auto min-w-[26.8rem] shrink-0 translate-x-16 -translate-y-20 -scale-x-100 rotate-[260deg] lg:hidden'
      />
      <div className='relative z-10 flex max-w-[42.6875rem] flex-col gap-35 lg:ml-30'>
        {services.map((service) => (
          <div
            key={service.id}
            className='flex flex-col gap-7'
          >
            {/* Nadpis */}
            <h2>{czechTypography(service.title)}</h2>

            {/* Popis */}
            {service.sluzbyAcf?.introText && <p className='text-lg'>{czechTypography(service.sluzbyAcf.introText)}</p>}

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
