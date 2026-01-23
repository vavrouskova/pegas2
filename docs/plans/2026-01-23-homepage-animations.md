# Homepage Scroll Animations Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add scroll-based fade-in animations to all homepage sections while maximizing server-side rendering performance.

**Architecture:** Create a lightweight `FadeInOnScroll` client component using IntersectionObserver. Server components import this wrapper and pass children to it - children remain server-rendered, only animation logic is client-side. This follows the same pattern already used in `MainHeroSection`.

**Tech Stack:** Framer Motion, IntersectionObserver API, React Server Components

**⚠️ IMPORTANT:** Do NOT commit anything until user explicitly approves. All commits are in Task 7.

---

## Current State Analysis

| Component | Type | Has Animations |
|-----------|------|----------------|
| MainHeroSection | Server | Yes (FadeIn, FadeInOnActivity) |
| ContentSection | Server | No |
| HomepageSliderSection | Client | No |
| ReferencesCarouselSection | Client | No |
| ServicesSection | Server | No |
| FooterClaim | Server | No |

---

## Task 1: Create FadeInOnScroll Component

**Files:**
- Create: `src/components/_shared/FadeInOnScroll.tsx`

**Step 1: Create the FadeInOnScroll component**

```tsx
'use client';

import { motion } from 'framer-motion';
import { ReactNode, useRef, useState, useEffect } from 'react';

interface FadeInOnScrollProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  threshold?: number;
  translateY?: number;
}

const FadeInOnScroll = ({
  children,
  delay = 0,
  duration = 0.6,
  className,
  threshold = 0.1,
  translateY = 20,
}: FadeInOnScrollProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: translateY }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: translateY }}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default FadeInOnScroll;
```

**Step 2: Verify file was created correctly**

Run: `bun run lint:file src/components/_shared/FadeInOnScroll.tsx`
Expected: No errors

---

## Task 2: Add Animations to ContentSection

**Files:**
- Modify: `src/components/_shared/ContentSection.tsx`

**Step 1: Import FadeInOnScroll and wrap content**

Update imports at top of file:

```tsx
import Image from 'next/image';
import React from 'react';

import ContentBox from '@/components/_shared/ContentBox';
import FadeInOnScroll from '@/components/_shared/FadeInOnScroll';
import FeatherAnimation from '@/components/_shared/FeatherAnimation';
import FeatherStatic from '@/components/_shared/FeatherStatic';
import { cn } from '@/lib/utils';
```

**Step 2: Wrap ContentBox in the no-image variant (lines 43-65)**

Replace the no-image section return:

```tsx
if (!hasImage) {
  return (
    <section
      className={cn(
        'section-container relative',
        withFeathers && featherPosition === 'right' ? '!pt-[26rem] lg:!pt-[12rem]' : '',
        sectionClassName
      )}
    >
      <FadeInOnScroll>
        <ContentBox
          title={title}
          description={description}
          buttonText={buttonText}
          link={link}
          className={cn('max-w-content relative z-20 lg:mx-auto', contentBoxClassName)}
        />
      </FadeInOnScroll>
      {withFeathers && (
        <>
          <FeatherAnimation featherPosition={featherPosition} />
          <FeatherStatic featherPosition={featherPosition} />
        </>
      )}
    </section>
  );
}
```

**Step 3: Wrap ContentBox and Image in the with-image variant (lines 73-100)**

Replace the with-image section return:

```tsx
return (
  <section
    className={cn(
      'section-container flex flex-col-reverse justify-between gap-7.5 lg:gap-28',
      isImageLeft ? 'lg:flex-row-reverse lg:items-center' : 'lg:flex-row lg:items-center',
      sectionClassName,
      className
    )}
  >
    <FadeInOnScroll delay={0.1}>
      <ContentBox
        title={title}
        description={description}
        buttonText={buttonText}
        link={link}
        className={cn('max-w-content lg:flex-shrink-0', contentBoxClassName)}
      />
    </FadeInOnScroll>
    <FadeInOnScroll className='lg:max-w-content min-w-0 lg:flex-1'>
      <Image
        src={imageSource}
        alt={imageAlt}
        width={1400}
        height={1400}
        sizes='(min-width: 1024px) 50vw, 100vw'
        className='h-auto w-full'
      />
    </FadeInOnScroll>
  </section>
);
```

**Step 4: Verify lint passes**

Run: `bun run lint:file src/components/_shared/ContentSection.tsx`
Expected: No errors

---

## Task 3: Add Animations to GenericCarouselSection

**Files:**
- Modify: `src/components/_shared/GenericCarouselSection.tsx`

**Step 1: Import FadeInOnScroll**

Add import after existing imports:

```tsx
import FadeInOnScroll from '@/components/_shared/FadeInOnScroll';
```

**Step 2: Wrap the carousel container**

Replace the section return (lines 55-100) - wrap the inner container with FadeInOnScroll:

```tsx
return (
  <section className={cn('pt-12.5 pb-20.5 lg:pt-35 lg:pb-43', sectionClassName)}>
    <FadeInOnScroll>
      <div
        ref={carouselRef}
        className='relative'
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <Carousel
          opts={{ align: 'start', loop: true }}
          className={cn('mx-auto', carouselMaxWidth)}
          setApi={setApi}
        >
          <CarouselContent className='-ml-0'>
            {data.map((item) => (
              <CarouselItem
                key={item.id}
                className='basis-full pl-0'
              >
                <article className={cn('bg-primary group h-full overflow-hidden', articleClassName)}>
                  {imageFirst ? (
                    <>
                      {renderImage ? renderImage(item) : defaultRenderImage(item)}
                      {renderContent(item, t)}
                    </>
                  ) : (
                    <>
                      {renderContent(item, t)}
                      {renderImage ? renderImage(item) : defaultRenderImage(item)}
                    </>
                  )}
                </article>
              </CarouselItem>
            ))}
          </CarouselContent>
          {data.length > 1 && (
            <CarouselNavigation
              itemsCount={data.length}
              currentIndex={currentIndex}
              onDotClick={goToSlide}
            />
          )}
        </Carousel>
      </div>
    </FadeInOnScroll>
  </section>
);
```

**Step 3: Verify lint passes**

Run: `bun run lint:file src/components/_shared/GenericCarouselSection.tsx`
Expected: No errors

---

## Task 4: Add Animations to ServicesSection

**Files:**
- Modify: `src/components/_shared/ServicesSection.tsx`

**Step 1: Import FadeInOnScroll**

Add import after existing imports:

```tsx
import FadeInOnScroll from '@/components/_shared/FadeInOnScroll';
```

**Step 2: Wrap the title and grid separately for staggered effect**

Replace the section return (lines 21-66):

```tsx
return (
  <section className='px-14 py-12.5 lg:py-35'>
    <FadeInOnScroll>
      <FormattedText
        text={t('home.services-nav.title')}
        as='h2'
        className='mb-12 text-center md:mb-25'
      />
    </FadeInOnScroll>
    <FadeInOnScroll delay={0.15}>
      <div className='grid grid-cols-1 gap-7.5 md:grid-cols-2 lg:flex'>
        {services.map((service, index) => (
          <ServiceCard
            key={getUniqueId()}
            id={service.id}
            title={service.title}
            slug={service.slug}
            featuredImage={service.featuredImage}
            className='lg:flex-1'
            sectionTitle={t('tracking.section-our-services')}
            type='service'
            itemCategory2={t('tracking.category-services')}
            index={index}
          />
        ))}
        <Link
          href={`/${t('routes.services')}`}
          className='flex flex-col gap-2.5 transition-opacity duration-300 hover:opacity-80 lg:flex-1'
        >
          <div className='bg-grey-warm p-[13%]'>
            <div className='relative aspect-square w-full overflow-hidden'>
              <Image
                src='/images/heart.webp'
                alt={t('home.services-nav.all-services')}
                fill
                sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
                className='object-cover'
              />
            </div>
          </div>
          <FormattedText
            text={t('home.services-nav.all-services')}
            as='h3'
            className='text-lg'
          />
        </Link>
      </div>
    </FadeInOnScroll>
  </section>
);
```

**Step 3: Verify lint passes**

Run: `bun run lint:file src/components/_shared/ServicesSection.tsx`
Expected: No errors

---

## Task 5: Add Animations to FooterClaim

**Files:**
- Modify: `src/components/_shared/FooterClaim.tsx`

**Step 1: Import FadeInOnScroll**

Add import after existing imports:

```tsx
import FadeInOnScroll from '@/components/_shared/FadeInOnScroll';
```

**Step 2: Wrap content elements with FadeInOnScroll**

Replace the section return (lines 11-30):

```tsx
return (
  <section
    className={cn('max-w-container relative z-5 -mx-4 h-[25rem] w-screen overflow-hidden sm:-mx-14', className)}
  >
    <FadeInOnScroll translateY={0} duration={0.8}>
      <Image
        src='/images/feather-bg.webp'
        alt={t('alt')}
        className='absolute bottom-0 left-1/2 z-0 h-auto w-full max-w-[900px] min-w-[900px] translate-x-[-60%] lg:max-w-[1400px] lg:-translate-x-1/2'
        width={1400}
        height={1400}
      />
    </FadeInOnScroll>
    <div className='absolute right-8 bottom-0 flex h-full w-fit items-center justify-end max-md:mb-24 sm:right-14 lg:right-[10%]'>
      <FadeInOnScroll delay={0.2}>
        <FormattedText
          text={t('claim')}
          as='h2'
          className='font-text text-3xl'
        />
      </FadeInOnScroll>
    </div>
  </section>
);
```

**Step 3: Verify lint passes**

Run: `bun run lint:file src/components/_shared/FooterClaim.tsx`
Expected: No errors

---

## Task 6: Final Verification

**Step 1: Run full lint**

Run: `bun run lint`
Expected: No errors

**Step 2: Run build**

Run: `bun run build`
Expected: Build succeeds without errors

**Step 3: Visual verification**

Run: `bun run dev`
- Navigate to homepage
- Scroll down slowly
- Verify each section fades in as it enters viewport
- Verify no layout shifts or jank
- Verify page loads quickly (server components still SSR)

**Step 4: Report to user**

Show user the results and ask for approval before committing.

---

## Task 7: Commit Changes (REQUIRES USER APPROVAL)

**⚠️ DO NOT EXECUTE THIS TASK UNTIL USER EXPLICITLY APPROVES**

**Step 1: Stage all changes**

```bash
git add src/components/_shared/FadeInOnScroll.tsx \
        src/components/_shared/ContentSection.tsx \
        src/components/_shared/GenericCarouselSection.tsx \
        src/components/_shared/ServicesSection.tsx \
        src/components/_shared/FooterClaim.tsx
```

**Step 2: Create commit**

```bash
git commit -m "feat(animations): add scroll-based fade-in animations to homepage sections

- Add FadeInOnScroll component using IntersectionObserver
- Add animations to ContentSection (both variants)
- Add animations to GenericCarouselSection (affects both carousels)
- Add animations to ServicesSection with staggered title/grid
- Add animations to FooterClaim

Server components remain server-side, only animation wrapper is client."
```

---

## Performance Notes

- **Server Components Preserved**: ContentSection, ServicesSection, and FooterClaim remain server components. Only the small FadeInOnScroll wrapper is client-side.
- **No Additional Bundle Size**: FadeInOnScroll uses framer-motion which is already in the bundle.
- **Lazy Animation**: IntersectionObserver only triggers animations when elements are about to be visible, not on page load.
- **Single Observer per Component**: Each FadeInOnScroll creates one observer and disconnects after triggering.
