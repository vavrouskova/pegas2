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
          <div className='from-primary/50 to-primary/10 absolute top-0 left-1/2 hidden h-full w-0.5 -translate-x-1/2 bg-gradient-to-b md:block' />

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
                        <div className='bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full'>
                          <span className='font-heading text-primary text-xl font-bold'>{item.year}</span>
                        </div>
                      </div>
                      <div className='flex-1 space-y-4'>
                        {item.titulek && <h3 className='font-heading text-2xl font-semibold'>{item.titulek}</h3>}
                        {item.description && (
                          <p className='text-muted-foreground text-lg leading-relaxed'>{item.description}</p>
                        )}
                        {item.obrazek?.node && (
                          <div className='relative aspect-video w-full overflow-hidden rounded-lg'>
                            <Image
                              src={item.obrazek.node.sourceUrl}
                              alt={item.obrazek.node.altText || item.titulek || 'Timeline image'}
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
                    <div className='grid grid-cols-2 gap-12 lg:gap-24'>
                      {isEven ? (
                        <>
                          {/* Year on the left */}
                          <div className='flex items-center justify-end'>
                            <div className='bg-primary/10 ring-background flex h-24 w-24 items-center justify-center rounded-full ring-4'>
                              <span className='font-heading text-primary text-3xl font-bold'>{item.year}</span>
                            </div>
                          </div>
                          {/* Content on the right */}
                          <div className='space-y-6'>
                            {item.titulek && <h3 className='font-heading text-3xl font-semibold'>{item.titulek}</h3>}
                            {item.description && (
                              <p className='text-muted-foreground text-lg leading-relaxed'>{item.description}</p>
                            )}
                            {item.obrazek?.node && (
                              <div className='relative aspect-video w-full overflow-hidden rounded-lg shadow-lg'>
                                <Image
                                  src={item.obrazek.node.sourceUrl}
                                  alt={item.obrazek.node.altText || item.titulek || 'Timeline image'}
                                  fill
                                  className='object-cover transition-transform duration-300 hover:scale-105'
                                  sizes='(max-width: 768px) 100vw, 50vw'
                                />
                              </div>
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          {/* Content on the left */}
                          <div className='space-y-6 text-right'>
                            {item.titulek && <h3 className='font-heading text-3xl font-semibold'>{item.titulek}</h3>}
                            {item.description && (
                              <p className='text-muted-foreground text-lg leading-relaxed'>{item.description}</p>
                            )}
                            {item.obrazek?.node && (
                              <div className='relative aspect-video w-full overflow-hidden rounded-lg shadow-lg'>
                                <Image
                                  src={item.obrazek.node.sourceUrl}
                                  alt={item.obrazek.node.altText || item.titulek || 'Timeline image'}
                                  fill
                                  className='object-cover transition-transform duration-300 hover:scale-105'
                                  sizes='(max-width: 768px) 100vw, 50vw'
                                />
                              </div>
                            )}
                          </div>
                          {/* Year on the right */}
                          <div className='flex items-center justify-start'>
                            <div className='bg-primary/10 ring-background flex h-24 w-24 items-center justify-center rounded-full ring-4'>
                              <span className='font-heading text-primary text-3xl font-bold'>{item.year}</span>
                            </div>
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
