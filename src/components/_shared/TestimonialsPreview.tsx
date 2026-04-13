'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { CarouselNavigation } from '@/components/_shared/CarouselNavigation';
import { Testimonial } from '@/components/_shared/TestimonialCard';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { useCarouselAutoplay } from '@/hooks/useCarouselAutoplay';
import ArrowRight from '@/components/icons/ArrowRight';
import { cn, czechTypography } from '@/lib/utils';

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
      'rád bych Vám touto cestou poděkoval a zároveň se s Vámi podělil o svou osobní zkušenost. Navštívili jsme pobočku U Vinohradské nemocnice, kde se nám věnovala paní Barbora Kovářová. Rád bych vyjádřil své upřímné uznání za její mimořádně profesionální přístup.',
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

  const totalSlides = previewTestimonials.length + 1;

  return (
    <section className='pt-12.5 pb-20.5 lg:pt-35 lg:pb-43'>
      <div className='section-container mb-10 lg:mb-16'>
        <h2 className='font-heading text-primary mb-2.5 text-2xl lg:text-3xl'>
          {t('wrote-about-us.page-title')}
        </h2>
        <p className='font-text text-primary/70 text-base leading-relaxed lg:text-lg'>
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
          className='mx-auto max-w-[23.125rem] lg:max-w-[59rem]'
          setApi={setApi}
        >
          <CarouselContent className='-ml-0'>
            {previewTestimonials.map((testimonial) => {
              const isDark = testimonial.variant === 'dark';

              return (
                <CarouselItem
                  key={testimonial.id}
                  className='basis-full pl-0'
                >
                  <article
                    className={cn(
                      'flex min-h-[10rem] items-stretch overflow-hidden max-lg:flex-col lg:max-h-[14.375rem]',
                      isDark ? 'bg-primary' : 'bg-white'
                    )}
                  >
                    <div className='flex flex-1 flex-col justify-between px-6 py-6 lg:px-12 lg:py-8'>
                      <div className='flex flex-col gap-2'>
                        <span className={cn('font-text text-xs', isDark ? 'text-white/50' : 'text-primary/40')}>
                          {testimonial.date}
                        </span>
                        <p className={cn('font-heading text-lg', isDark ? 'text-white' : 'text-primary')}>
                          {czechTypography(testimonial.greeting)}
                        </p>
                        <p
                          className={cn(
                            'font-italic line-clamp-4 text-sm leading-relaxed',
                            isDark ? 'text-white/80' : 'text-primary/70'
                          )}
                        >
                          {czechTypography(testimonial.content)}
                        </p>
                      </div>
                      <p className={cn('font-text mt-3 text-right text-xs', isDark ? 'text-white/50' : 'text-primary/40')}>
                        {czechTypography(testimonial.signature)}
                      </p>
                    </div>
                  </article>
                </CarouselItem>
              );
            })}

            {/* CTA slide */}
            <CarouselItem className='basis-full pl-0'>
              <Link
                href={`/${t('routes.references-wrote-about-us')}`}
                className='bg-primary group flex min-h-[10rem] items-center justify-center overflow-hidden max-lg:flex-col lg:max-h-[14.375rem]'
              >
                <div className='text-white-smoke flex items-center gap-3'>
                  <span className='text-white-smoke font-heading text-lg'>
                    {t('home.testimonials.cta-read-more')}
                  </span>
                  <ArrowRight className='size-5 shrink-0' />
                </div>
              </Link>
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
