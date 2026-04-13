'use client';

import { useState } from 'react';

import TestimonialCard, { Testimonial } from '@/components/_shared/TestimonialCard';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
  initialCount?: number;
  batchSize?: number;
  expandLabel: string;
  collapseLabel: string;
}

const TestimonialsSection = ({
  testimonials,
  initialCount = 6,
  batchSize = 6,
  expandLabel,
  collapseLabel,
}: TestimonialsSectionProps) => {
  const [visibleCount, setVisibleCount] = useState(initialCount);

  const allVisible = visibleCount >= testimonials.length;
  const visibleTestimonials = testimonials.slice(0, visibleCount);

  // Distribute across 3 columns for masonry layout
  const columns: Testimonial[][] = [[], [], []];
  visibleTestimonials.forEach((testimonial, index) => {
    columns[index % 3].push(testimonial);
  });

  const handleExpand = () => {
    setVisibleCount((prev) => Math.min(prev + batchSize, testimonials.length));
  };

  const handleCollapse = () => {
    setVisibleCount(initialCount);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8'>
        {columns.map((column, colIndex) => (
          <div
            key={colIndex}
            className='flex flex-col gap-6 lg:gap-8'
          >
            {column.map((testimonial) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
              />
            ))}
          </div>
        ))}
      </div>

      <div className='mt-12 flex justify-center lg:mt-20'>
        <button
          type='button'
          className='text-primary hover:text-primary/70 font-heading flex items-center gap-2 text-lg transition-colors'
          onClick={allVisible ? handleCollapse : handleExpand}
        >
          {allVisible ? collapseLabel : expandLabel}
          <svg
            width='12'
            height='12'
            viewBox='0 0 12 12'
            fill='none'
            className={allVisible ? 'mb-0.5' : 'mt-0.5'}
          >
            <path
              d={allVisible ? 'M6 10L6 2M6 2L2 6M6 2L10 6' : 'M6 2L6 10M6 10L2 6M6 10L10 6'}
              stroke='currentColor'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </button>
      </div>
    </>
  );
};

export default TestimonialsSection;
