import Link from 'next/link';
import React from 'react';

import Button from '@/components/_shared/Button';

interface OtherService {
  id: string;
  title: string;
  slug: string;
}

interface OtherServicesSectionProps {
  services: OtherService[];
  baseUrl?: string;
}

const OtherServicesSection = ({ services, baseUrl = '/sluzby' }: OtherServicesSectionProps) => {
  if (!services || services.length === 0) {
    return null;
  }

  return (
    <section className='section-container py-20 md:py-32'>
      <div className='mx-auto flex max-w-[42.6875rem] flex-col gap-32'>
        {services.map((service) => (
          <div
            key={service.id}
            className='flex flex-col gap-9'
          >
            {/* Nadpis */}
            <h2>{service.title}</h2>

            {/* CTA tlačítko */}
            <Link href={`${baseUrl}/${service.slug}`}>
              <Button buttonText='Detail služby' />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OtherServicesSection;
