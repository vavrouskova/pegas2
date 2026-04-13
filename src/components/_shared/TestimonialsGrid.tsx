import TestimonialCard, { Testimonial } from '@/components/_shared/TestimonialCard';

interface TestimonialsGridProps {
  testimonials: Testimonial[];
}

const TestimonialsGrid = ({ testimonials }: TestimonialsGridProps) => {
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  // Distribute testimonials across 3 columns for masonry layout
  const columns: Testimonial[][] = [[], [], []];
  testimonials.forEach((testimonial, index) => {
    columns[index % 3].push(testimonial);
  });

  return (
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
  );
};

export default TestimonialsGrid;
