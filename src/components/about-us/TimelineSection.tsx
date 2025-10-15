import Image from 'next/image';
import React from 'react';

import type { TimelineItem } from '@/utils/wordpress-types';

interface TimelineSectionProps {
  timeline: TimelineItem[];
}

const TimelineSection = ({ timeline }: TimelineSectionProps) => {
  if (!timeline || timeline.length === 0) {
    return null;
  }

  return (
    <section className='section-container py-16'>
      <div className='mx-auto max-w-7xl'>
        <div className='relative'>
          {/* Central vertical line */}
          <div className='bg-tertiary absolute top-0 left-1/2 hidden h-full w-[1px] -translate-x-1/2 md:block' />

          <div className='space-y-12 md:space-y-24'>
            {timeline.map((item, index) => {
              const isEven = index % 2 === 0;

              return (
                <div
                  key={index}
                  className='relative'
                >
                  {/* Mobile layout */}
                  <div className='block md:hidden'>
                    <div className='flex gap-6'>
                      <div className='flex-shrink-0'>
                        <span className='font-heading text-primary text-lg font-bold'>{item.year}</span>
                      </div>
                      <div className='flex-1 space-y-4'>
                        {item.titulek && <h3 className='font-heading text-2xl'>{item.titulek}</h3>}
                        {item.description && <p>{item.description}</p>}
                        {item.image?.node && (
                          <div className='relative aspect-video w-full overflow-hidden rounded-lg'>
                            <Image
                              src={item.image.node.sourceUrl}
                              alt={item.image.node.altText || item.titulek || 'Timeline image'}
                              fill
                              className='object-cover'
                              sizes='(max-width: 768px) 100vw, 50vw'
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Desktop layout - alternating */}
                  <div className='hidden md:block'>
                    {/* Dot on the timeline */}
                    <div className='bg-primary absolute top-1/2 left-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full' />

                    <div className='grid grid-cols-2 gap-12 lg:gap-24'>
                      {isEven ? (
                        <>
                          {/* Year on the left */}
                          <div className='flex items-center justify-end'>
                            <span className='font-heading text-primary font-heading text-lg'>{item.year}</span>
                          </div>
                          {/* Content on the right */}
                          <div className='space-y-6'>
                            {item.image?.node && (
                              <div className='relative aspect-[120/67] w-60 overflow-hidden'>
                                <Image
                                  src={item.image.node.sourceUrl}
                                  alt={item.image.node.altText || item.titulek || 'Timeline image'}
                                  fill
                                  className='object-cover transition-transform duration-300 hover:scale-105'
                                  sizes='(max-width: 768px) 100vw, 50vw'
                                />
                              </div>
                            )}
                            {item.titulek && <h3 className='font-heading text-2xl'>{item.titulek}</h3>}
                            {item.description && <p>{item.description}</p>}
                          </div>
                        </>
                      ) : (
                        <>
                          {/* Content on the left */}
                          <div className='space-y-6 text-right'>
                            {item.image?.node && (
                              <div className='relative ml-auto aspect-[120/67] w-60 overflow-hidden'>
                                <Image
                                  src={item.image.node.sourceUrl}
                                  alt={item.image.node.altText || item.titulek || 'Timeline image'}
                                  fill
                                  className='object-cover transition-transform duration-300 hover:scale-105'
                                  sizes='(max-width: 768px) 100vw, 50vw'
                                />
                              </div>
                            )}
                            {item.titulek && <h3 className='font-heading text-2xl'>{item.titulek}</h3>}
                            {item.description && <p>{item.description}</p>}
                          </div>
                          {/* Year on the right */}
                          <div className='flex items-center justify-start'>
                            <span className='font-heading text-primary font-heading text-lg'>{item.year}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
