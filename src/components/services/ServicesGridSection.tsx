import React from 'react';

import { FormattedText } from '@/components/_shared/FormattedText';
import ServiceCard from '@/components/_shared/ServiceCard';
import { getUniqueId } from '@/utils/helper';

interface ServicePost {
  id: string;
  title: string;
  slug: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
      altText: string;
      mediaDetails?: {
        width: number;
        height: number;
      };
    };
  };
}

interface ServicesGridSectionProps {
  title: string;
  description: string;
  services: ServicePost[];
  id?: string;
}

const ServicesGridSection = ({ title, description, services, id }: ServicesGridSectionProps) => {
  if (!services || services.length === 0) {
    return null;
  }

  return (
    <section
      id={id}
      className='section-container'
    >
      {/* Nadpis a popis sekce */}
      <div className='max-w-lg-content mb-16 flex flex-col gap-8 lg:ml-30'>
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

      {/* Grid služeb */}
      <div className='grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-4'>
        {services.map((service) => (
          <ServiceCard
            key={getUniqueId()}
            id={service.id}
            title={service.title}
            slug={service.slug}
            featuredImage={service.featuredImage}
          />
        ))}
      </div>
    </section>
  );
};

export default ServicesGridSection;
