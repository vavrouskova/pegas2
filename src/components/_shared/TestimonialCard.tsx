import Image from 'next/image';
import Link from 'next/link';

import { cn, czechTypography } from '@/lib/utils';

export interface Testimonial {
  id: string;
  date: string;
  greeting: string;
  content: string;
  signature: string;
  variant?: 'light' | 'dark' | 'promo';
  image?: {
    src: string;
    alt: string;
  };
  promoLink?: {
    href: string;
    label: string;
  };
}

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard = ({ testimonial }: TestimonialCardProps) => {
  const isDark = testimonial.variant === 'dark';
  const isPromo = testimonial.variant === 'promo';

  if (isPromo) {
    return (
      <Link
        href={testimonial.promoLink?.href || '#'}
        className='group flex flex-col overflow-hidden '
      >
        {testimonial.image && (
          <div className='relative aspect-[4/3] w-full overflow-hidden'>
            <Image
              src={testimonial.image.src}
              alt={testimonial.image.alt}
              fill
              className='object-cover transition-transform duration-500 group-hover:scale-105'
            />
          </div>
        )}
        <div className='bg-primary flex flex-col gap-2 p-6 lg:p-8'>
          <p className='font-heading text-lg text-white lg:text-xl'>{czechTypography(testimonial.greeting)}</p>
          <p className='font-text text-sm leading-relaxed text-white/80'>{czechTypography(testimonial.content)}</p>
          <span className='font-heading mt-2 inline-flex items-center gap-1.5 text-sm text-white underline underline-offset-4 transition-colors group-hover:text-white/70'>
            {testimonial.promoLink?.label || 'Zobrazit více'}
            <svg
              width='14'
              height='14'
              viewBox='0 0 14 14'
              fill='none'
              className='transition-transform group-hover:translate-x-0.5'
            >
              <path
                d='M5 3L9 7L5 11'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </span>
        </div>
      </Link>
    );
  }

  return (
    <div
      className={cn(
        'flex flex-col gap-4  p-6 lg:p-8',
        isDark ? 'bg-primary text-white' : 'bg-white text-primary'
      )}
    >
      <span className={cn('font-text text-sm', isDark ? 'text-white/70' : 'text-primary/60')}>
        {testimonial.date}
      </span>

      {testimonial.image && (
        <div className='relative aspect-[4/3] w-full overflow-hidden '>
          <Image
            src={testimonial.image.src}
            alt={testimonial.image.alt}
            fill
            className='object-cover'
          />
        </div>
      )}

      <div className='flex flex-1 flex-col gap-3'>
        <p className='font-heading'>{czechTypography(testimonial.greeting)}</p>
        <p className={cn('font-italic text-sm leading-relaxed whitespace-pre-line', isDark ? 'text-white/90' : 'text-primary/80')}>
          {czechTypography(testimonial.content)}
        </p>
      </div>

      <p className={cn('font-text mt-auto text-right text-sm', isDark ? 'text-white/70' : 'text-primary/60')}>
        {czechTypography(testimonial.signature)}
      </p>
    </div>
  );
};

export default TestimonialCard;
