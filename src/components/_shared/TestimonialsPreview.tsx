'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { CarouselNavigation } from '@/components/_shared/CarouselNavigation';
import TestimonialCard, { Testimonial } from '@/components/_shared/TestimonialCard';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { useCarouselAutoplay } from '@/hooks/useCarouselAutoplay';

// TODO: Replace with WordPress API call when napsaliPost type is available
const previewTestimonials: Testimonial[] = [
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
  {
    id: 'hp-3',
    date: '22. března 2026',
    greeting: 'Dobrá paní Kovářová,',
    content:
      'chtěla bych Vám poděkovat za citlivý přístup při zajištění rozloučení s mým dědečkem. Celé setkání proběhlo v tichosti a s úctou, s důrazem na zachování vzpomínek, které rodina i přátelé nesou ve svých srdcích.',
    signature: 'Se srdečným pozdravem, E. V.',
    variant: 'light',
  },
];

const TestimonialsPreview = () => {
  const t = useTranslations();
  const { currentIndex, setApi, carouselRef, setIsHovering, goToSlide } = useCarouselAutoplay({
    autoplayInterval: 5000,
  });

  // All slides = testimonials + CTA
  const totalSlides = previewTestimonials.length + 1;

  return (
    <section className='pt-12.5 pb-20.5 lg:pt-35 lg:pb-43'>
      <div className='section-container mb-10 flex flex-col gap-2.5 lg:mb-16'>
        <h2 className='font-heading text-primary text-2xl lg:text-3xl'>
          {t('wrote-about-us.page-title')}
        </h2>
        <p className='font-text text-primary/70 max-w-content'>
          {t('wrote-about-us.hero.description')}
        </p>
      </div>

      <div
        ref={carouselRef}
        className='relative'
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <Carousel
          opts={{ align: 'start', loop: true }}
          className='mx-auto max-w-[28rem] lg:max-w-[32rem]'
          setApi={setApi}
        >
          <CarouselContent className='-ml-0'>
            {previewTestimonials.map((testimonial) => (
              <CarouselItem
                key={testimonial.id}
                className='basis-full pl-0'
              >
                <div className='px-4'>
                  <TestimonialCard testimonial={testimonial} />
                </div>
              </CarouselItem>
            ))}

            {/* CTA slide */}
            <CarouselItem className='basis-full pl-0'>
              <div className='px-4'>
                <Link
                  href={`/${t('routes.references-wrote-about-us')}`}
                  className='border-primary/15 hover:bg-primary/5 group flex min-h-[280px] flex-col items-center justify-center gap-4 border border-dashed p-8 transition-colors lg:p-12'
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
            </CarouselItem>
          </CarouselContent>

          <CarouselNavigation
            itemsCount={totalSlides}
            currentIndex={currentIndex}
            onDotClick={goToSlide}
          />
        </Carousel>
      </div>
    </section>
  );
};

export default TestimonialsPreview;
