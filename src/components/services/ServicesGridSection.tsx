import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { czechTypography } from '@/lib/utils';

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
  baseUrl?: string;
}

const ServicesGridSection = ({ title, description, services }: ServicesGridSectionProps) => {
  if (!services || services.length === 0) {
    return null;
  }

  return (
    <section className='section-container py-20 md:py-32'>
      {/* Nadpis a popis sekce */}
      <div className='mb-16 flex max-w-[42.6875rem] flex-col gap-8'>
        <h2>{czechTypography(title)}</h2>
        <p className='text-lg leading-relaxed'>{czechTypography(description)}</p>
      </div>

      {/* Grid služeb */}
      <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4'>
        {services.map((service) => {
          const imageUrl = service.featuredImage?.node?.sourceUrl || '/images/placeholder.webp';
          const imageAlt = service.featuredImage?.node?.altText || service.title;

          return (
            <Link
              key={service.id}
              href={`/${service.slug}`}
              className='group flex flex-col gap-8 transition-opacity duration-300 hover:opacity-80'
            >
              {/* Obrázek */}
              <div className='relative aspect-square w-full overflow-hidden'>
                <Image
                  src={imageUrl}
                  alt={imageAlt}
                  fill
                  sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
                  className='object-cover'
                />
              </div>

              {/* Nadpis */}
              <h3 className='text-2xl leading-tight font-black tracking-wide'>{czechTypography(service.title)}</h3>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default ServicesGridSection;
