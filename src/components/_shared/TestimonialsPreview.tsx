import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

import TestimonialCard, { Testimonial } from '@/components/_shared/TestimonialCard';

// TODO: Replace with WordPress API call when napsaliPost type is available
const getPreviewTestimonials = (): Testimonial[] => [
  {
    id: 'hp-1',
    date: '12. dubna 2026',
    greeting: 'Dobrý den,',
    content:
      'Poslední rozloučení s paní Hanou Novotnou se konalo v obřadní síni ve Strašnicích. Obřad byl laděn do světlých tónů, které odrážely radostné vzpomínky rodiny a přátel. Prostor zdobily jemné květiny v bílé a růžové barvě.',
    signature: 'S úctou, A. N.',
    variant: 'light',
  },
  {
    id: 'hp-2',
    date: '5. dubna 2026',
    greeting: 'Vážený pane Hamane,',
    content:
      'rád bych Vám touto cestou poděkoval a zároveň se s Vámi podělil o svou osobní zkušenost.\n\nNavštívili jsme pobočku U Vinohradské nemocnice, kde se nám věnovala paní Barbora Kovářová. Rád bych vyjádřil své upřímné uznání za její mimořádně profesionální, lidský a vstřícný přístup.',
    signature: 'S pozdravem, R. K.',
    variant: 'dark',
  },
];

const TestimonialsPreview = async () => {
  const t = await getTranslations();
  const testimonials = getPreviewTestimonials();

  return (
    <section className='section-container'>
      <div className='mb-10 flex flex-col gap-2.5 lg:mb-16'>
        <h2 className='font-heading text-primary text-2xl lg:text-3xl'>
          {t('wrote-about-us.page-title')}
        </h2>
        <p className='font-text text-primary/70 max-w-content'>
          {t('wrote-about-us.hero.description')}
        </p>
      </div>

      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8'>
        {testimonials.map((testimonial) => (
          <TestimonialCard
            key={testimonial.id}
            testimonial={testimonial}
          />
        ))}

        {/* CTA Card */}
        <Link
          href={`/${t('routes.references-wrote-about-us')}`}
          className='border-primary/15 hover:bg-primary/5 group flex flex-col items-center justify-center gap-4 border border-dashed p-8 transition-colors lg:p-12'
        >
          <p className='font-heading text-primary text-center text-lg'>
            {t('home.testimonials.cta-title')}
          </p>
          <span className='font-heading text-primary flex items-center gap-2 text-sm transition-colors group-hover:opacity-70'>
            {t('home.testimonials.cta-link')}
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
        </Link>
      </div>
    </section>
  );
};

export default TestimonialsPreview;
