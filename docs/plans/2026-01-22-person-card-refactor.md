# PersonCard Refactor Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a single shared `PersonCard` component that replaces duplicate card implementations in `ContactPeopleSection` and `EmployeesSection`, supporting both email and quote display with equal-height card bodies.

**Architecture:** Extract `PersonCard` to `src/components/_shared/`, configure via props for email/quote visibility. Use CSS Grid with `grid-rows-subgrid` for equal-height card bodies across rows. Update both section components to use the shared card.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, Next.js Image

---

## Task 1: Create Shared PersonCard Component

**Files:**
- Create: `src/components/_shared/PersonCard.tsx`

**Step 1: Create the PersonCard component file**

```tsx
import Image from 'next/image';
import Link from 'next/link';

import { FormattedText } from '@/components/_shared/FormattedText';
import { cn } from '@/lib/utils';
import type { ZamestnanciPost } from '@/utils/wordpress-types';

interface PersonCardProps {
  person: ZamestnanciPost;
  className?: string;
  showQuote?: boolean;
  showEmail?: boolean;
}

const PersonCard = ({ person, className, showQuote = false, showEmail = false }: Readonly<PersonCardProps>) => {
  const { zamestnanciACF } = person;
  const imageUrl = zamestnanciACF?.profileImage?.node?.sourceUrl;
  const imageAlt = zamestnanciACF?.profileImage?.node?.altText || person.title || 'Person';
  const email = zamestnanciACF?.employeeEmail;
  const quote = zamestnanciACF?.employeeQuote;

  return (
    <article className={cn('group row-span-4 grid grid-rows-subgrid', className)}>
      <div className='relative aspect-square w-full overflow-hidden'>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            sizes='(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw'
            className='object-cover'
          />
        ) : (
          <Image
            src='/images/placeholder.webp'
            alt={imageAlt}
            fill
            sizes='(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw'
            className='object-cover'
          />
        )}
      </div>
      <div className='bg-white px-3.5 pt-6'>
        {person.title && (
          <FormattedText
            text={person.title}
            as='h3'
            className='text-xl'
          />
        )}
      </div>
      <div className='bg-white px-3.5'>
        {zamestnanciACF?.positionDescription && (
          <FormattedText
            text={zamestnanciACF.positionDescription}
            as='p'
            className='text-lg'
          />
        )}
      </div>
      <div className='bg-white px-3.5 pb-6'>
        {showQuote && quote && (
          <p className='font-italic mt-7.5 text-sm tracking-[0.03125rem]'>
            &bdquo;{quote}&ldquo;
          </p>
        )}
        {showEmail && email && (
          <Link
            href={`mailto:${email}`}
            className='mt-5 inline-block text-sm break-all underline hover:no-underline'
          >
            {email}
          </Link>
        )}
      </div>
    </article>
  );
};

export default PersonCard;
```

**Step 2: Verify the file was created correctly**

Run: `bunx tsc --noEmit src/components/_shared/PersonCard.tsx`
Expected: No errors

**Step 3: Commit**

```bash
git add src/components/_shared/PersonCard.tsx
git commit -m "feat: add shared PersonCard component with email and quote support"
```

---

## Task 2: Update EmployeesSection to Use Shared PersonCard

**Files:**
- Modify: `src/components/about-us/EmployeesSection.tsx`

**Step 1: Update imports and remove local EmployeeCard**

Replace the file content. Remove the `EmployeeCard` component and its interface. Add import for shared `PersonCard`.

```tsx
'use client';

import { CarouselNavigation } from '@/components/_shared/CarouselNavigation';
import { FormattedText } from '@/components/_shared/FormattedText';
import LeavesAnimation from '@/components/_shared/LeavesAnimation';
import PersonCard from '@/components/_shared/PersonCard';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { useCarouselAutoplay } from '@/hooks/useCarouselAutoplay';
import { filterEmployeesByPosition } from '@/utils/helper';
import type { ZamestnanciPost } from '@/utils/wordpress-types';

const POSITION_TYPE_MANAGEMENT = 'company_management';

interface EmployeesSectionProps {
  employees: ZamestnanciPost[];
  managementTitle: string;
  teamTitle: string;
}

interface ManagementGridProps {
  employees: ZamestnanciPost[];
  title: string;
}

const ManagementGrid = ({ employees, title }: Readonly<ManagementGridProps>) => {
  if (employees.length === 0) return null;

  return (
    <div className='relative z-10 pb-16 lg:pt-40'>
      <div className='mx-auto max-w-7xl'>
        <FormattedText
          text={title}
          as='h2'
          className='mb-12'
        />
        <div className='grid grid-cols-[repeat(auto-fill,minmax(16.625rem,16.625rem))] grid-rows-[auto_auto_auto_1fr] gap-4 lg:gap-8'>
          {employees.map((employee) => (
            <PersonCard
              key={employee.id}
              person={employee}
              showQuote
              className='max-lg:max-w-[16.625rem]'
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface TeamCarouselProps {
  employees: ZamestnanciPost[];
  title: string;
}

const TeamCarousel = ({ employees, title }: Readonly<TeamCarouselProps>) => {
  const { currentIndex, setApi, carouselRef, setIsHovering, goToSlide } = useCarouselAutoplay();

  if (employees.length === 0) return null;

  return (
    <div className='relative z-10 pt-16 pb-40'>
      <div className='mx-auto max-w-7xl'>
        <FormattedText
          text={title}
          as='h2'
          className='mb-12'
        />
      </div>
      <div
        ref={carouselRef}
        className='relative -mr-4 sm:-mr-14 lg:mx-auto lg:max-w-7xl'
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <Carousel
          opts={{ align: 'start', loop: true }}
          setApi={setApi}
        >
          <CarouselContent className='-ml-4 lg:-ml-8'>
            {employees.map((employee) => (
              <CarouselItem
                key={employee.id}
                className='grid basis-full grid-rows-[auto_auto_auto_1fr] pl-4 max-lg:max-w-[16.625rem] sm:basis-1/2 lg:basis-1/3 lg:pl-8 xl:basis-1/4'
              >
                <PersonCard person={employee} />
              </CarouselItem>
            ))}
          </CarouselContent>
          {employees.length > 1 && (
            <CarouselNavigation
              itemsCount={employees.length}
              currentIndex={currentIndex}
              onDotClick={goToSlide}
            />
          )}
        </Carousel>
      </div>
    </div>
  );
};

const EmployeesSection = ({ employees, managementTitle, teamTitle }: Readonly<EmployeesSectionProps>) => {
  const { management, team } = filterEmployeesByPosition(employees, POSITION_TYPE_MANAGEMENT);

  if (employees.length === 0) return null;

  return (
    <section className='section-container relative'>
      <LeavesAnimation
        leaves1ClassName='w-[44.6875rem] rotate-[-20deg]'
        motionDiv1ClassName='top-0 left-1/2 translate-x-[26rem]'
        leaves2ClassName='w-[34.8125rem] rotate-[260deg]'
        motionDiv2ClassName='top-64 left-1/2 translate-x-[34.5rem]'
      />
      <ManagementGrid
        employees={management}
        title={managementTitle}
      />
      <TeamCarousel
        employees={team}
        title={teamTitle}
      />
    </section>
  );
};

export default EmployeesSection;
```

**Step 2: Verify TypeScript compiles**

Run: `bunx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add src/components/about-us/EmployeesSection.tsx
git commit -m "refactor: use shared PersonCard in EmployeesSection"
```

---

## Task 3: Update ContactPeopleSection to Use Shared PersonCard

**Files:**
- Modify: `src/components/contacts/ContactPeopleSection.tsx`

**Step 1: Update the file to use shared PersonCard**

Replace the file content. Remove the local `PersonCard` component and use the shared one.

```tsx
'use client';

import { FormattedText } from '@/components/_shared/FormattedText';
import PersonCard from '@/components/_shared/PersonCard';
import type { ZamestnanciPost } from '@/utils/wordpress-types';

interface ContactPeopleSectionProps {
  people: ZamestnanciPost[];
  title?: string;
}

const ContactPeopleSection = ({ people, title }: Readonly<ContactPeopleSectionProps>) => {
  if (people.length === 0) return null;

  return (
    <section className='section-container'>
      <div className='max-w-container mx-auto'>
        {title && (
          <FormattedText
            text={title}
            as='h2'
            className='mb-25 text-center'
          />
        )}

        <div className='grid grid-cols-[repeat(auto-fill,minmax(16.625rem,16.625rem))] grid-rows-[auto_auto_auto_1fr] justify-center gap-x-7.5 gap-y-12.5 lg:gap-7.5'>
          {people.map((person) => (
            <PersonCard
              key={person.id}
              person={person}
              showEmail
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactPeopleSection;
```

**Step 2: Verify TypeScript compiles**

Run: `bunx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add src/components/contacts/ContactPeopleSection.tsx
git commit -m "refactor: use shared PersonCard in ContactPeopleSection"
```

---

## Task 4: Run Linter and Fix Issues

**Files:**
- Possibly: `src/components/_shared/PersonCard.tsx`
- Possibly: `src/components/about-us/EmployeesSection.tsx`
- Possibly: `src/components/contacts/ContactPeopleSection.tsx`

**Step 1: Run linter**

Run: `bun run lint`
Expected: No errors or warnings

**Step 2: Fix any linting issues if present**

Apply fixes as needed based on linter output.

**Step 3: Commit if changes were made**

```bash
git add -A
git commit -m "fix: resolve linting issues in PersonCard refactor"
```

---

## Task 5: Visual Verification

**Step 1: Start dev server (if not running)**

Run: `bun run dev`
Expected: Server starts successfully

**Step 2: Verify About Us page**

Navigate to: `/o-nas` (About Us page)
Expected:
- Management section shows cards with quotes
- Team carousel shows cards without quotes
- All cards in a row have equal height bodies

**Step 3: Verify Contacts page**

Navigate to: `/kontakty` (Contacts page)
Expected:
- People section shows cards with email links
- All cards in a row have equal height bodies
- Email links are clickable and open mail client

**Step 4: Commit verification complete message (optional)**

No commit needed if visual verification passes.

---

## Summary

This refactor:
1. Creates a single `PersonCard` component in `src/components/_shared/`
2. Uses props (`showQuote`, `showEmail`) to control optional content display
3. Uses CSS Grid with `grid-rows-subgrid` for equal-height card bodies
4. Removes duplicate code from both section components
5. Maintains existing functionality while following DRY principles
