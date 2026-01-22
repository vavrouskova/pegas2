# Carousel Components Refactor Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refactor carousel sections so `ReferencesCarouselSection` uses new `homepageACF.slider` data and the old reference posts functionality moves to a renamed `BlogCarouselSection`.

**Architecture:**
- Create `HomepageSliderSection` component for new slider data from WordPress ACF
- Rename current `ReferencesCarouselSection` → `HomepageSliderSection` (new slider data)
- Rename current `BlogCarouselSection` → `ReferencesCarouselSection` (for reference posts)
- Update Homepage to use the new component structure

**Tech Stack:** Next.js, React 19, TypeScript, WordPress GraphQL, GenericCarouselSection

---

## Task 1: Add Slider TypeScript Types

**Files:**
- Modify: `src/utils/wordpress-types.ts:141-148`

**Step 1: Add SliderSlide interface**

Add after line 139 (before HomepageACF):

```typescript
// Homepage Slider Types
export interface SliderSlide {
  slideTitle?: string;
  slideDescription?: string;
  slideImage?: {
    node: {
      altText: string;
      sourceUrl: string;
    };
  };
  slideLink?: {
    target?: string;
    title?: string;
    url?: string;
  };
}
```

**Step 2: Update HomepageACF interface**

Replace existing HomepageACF (lines 141-148) with:

```typescript
export interface HomepageACF {
  slider?: SliderSlide[];
  selectedReference?: {
    nodes: ReferencePost[];
  };
  selectedSluzby?: {
    nodes: SluzbyPost[];
  };
}
```

**Step 3: Verify TypeScript compiles**

Run: `bunx tsc --noEmit`
Expected: No errors

**Step 4: Commit**

```bash
git add src/utils/wordpress-types.ts
git commit -m "feat(types): add SliderSlide type and update HomepageACF"
```

---

## Task 2: Update GraphQL Query for Slider Data

**Files:**
- Modify: `src/api/wordpress-api.ts:134-195`

**Step 1: Update getHomepageData query**

Add slider fields to the GraphQL query inside `homepageACF` (after line 140, before `selectedReference`):

```graphql
slider {
  slideDescription
  slideImage {
    node {
      altText
      sourceUrl
    }
  }
  slideLink {
    target
    title
    url
  }
  slideTitle
}
```

**Step 2: Verify query works**

Run: `bun run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/api/wordpress-api.ts
git commit -m "feat(api): add slider fields to homepage GraphQL query"
```

---

## Task 3: Create HomepageSliderSection Component

**Files:**
- Create: `src/components/_shared/HomepageSliderSection.tsx`

**Step 1: Create the component file**

```typescript
'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import Button from '@/components/_shared/Button';
import { FormattedText } from '@/components/_shared/FormattedText';
import GenericCarouselSection from '@/components/_shared/GenericCarouselSection';
import type { SliderSlide } from '@/utils/wordpress-types';

interface SliderCarouselItemData {
  id: number;
  title: string;
  description?: string;
  image: string;
  link: string;
  linkTarget?: string;
  linkTitle?: string;
}

interface HomepageSliderSectionProps {
  slides?: SliderSlide[];
}

function convertToCarouselData(slides: SliderSlide[]): SliderCarouselItemData[] {
  return slides.map((slide, index) => ({
    id: index,
    title: slide.slideTitle || '',
    description: slide.slideDescription,
    image: slide.slideImage?.node.sourceUrl || '/images/placeholder.webp',
    link: slide.slideLink?.url || '#',
    linkTarget: slide.slideLink?.target,
    linkTitle: slide.slideLink?.title,
  }));
}

const HomepageSliderSection = ({ slides }: HomepageSliderSectionProps) => {
  if (!slides || slides.length === 0) {
    return null;
  }

  const data = convertToCarouselData(slides);

  return (
    <GenericCarouselSection
      data={data}
      carouselMaxWidth='max-w-88 lg:max-w-[48.1875rem]'
      articleClassName='flex min-h-[10rem] mx-auto items-stretch max-lg:flex-col lg:max-h-[14.375rem]'
      imageFirst
      renderImage={(item) => (
        <picture className='relative aspect-square h-auto w-full lg:max-h-[14.375rem] lg:max-w-[14.375rem]'>
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes='(max-width: 768px) 160px, 256px'
            className='object-cover'
          />
        </picture>
      )}
      renderContent={(item, t) => (
        <div className='flex flex-1 flex-col space-y-2 px-4 py-5 max-lg:h-full max-lg:justify-between lg:px-17.5 lg:py-7.5'>
          <div className='flex flex-col'>
            <FormattedText
              text={item.title}
              as='h3'
              className='text-white-smoke mb-2.5 text-xl'
            />
            {item.description && (
              <FormattedText
                text={item.description}
                as='p'
                className='text-lg text-white'
              />
            )}
          </div>
          <Link
            href={item.link}
            target={item.linkTarget}
          >
            <Button
              buttonText={item.linkTitle || t('find-out-more')}
              className='-ml-8 lg:-ml-16'
            />
          </Link>
        </div>
      )}
    />
  );
};

export default HomepageSliderSection;
```

**Step 2: Verify TypeScript compiles**

Run: `bunx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add src/components/_shared/HomepageSliderSection.tsx
git commit -m "feat(components): add HomepageSliderSection for ACF slider data"
```

---

## Task 4: Rename BlogCarouselSection to ReferencesCarouselSection

**Files:**
- Rename: `src/components/_shared/BlogCarouselSection.tsx` → `src/components/_shared/ReferencesCarouselSection.tsx`
- Modify: Content to use ReferencePost data

**Step 1: Rename file using git mv**

```bash
git mv src/components/_shared/BlogCarouselSection.tsx src/components/_shared/ReferencesCarouselSection.tsx
```

**Step 2: Update the component to use ReferencePost**

Replace entire content of `src/components/_shared/ReferencesCarouselSection.tsx`:

```typescript
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';

import Button from '@/components/_shared/Button';
import { FormattedText } from '@/components/_shared/FormattedText';
import GenericCarouselSection from '@/components/_shared/GenericCarouselSection';
import { formatFarewellDateTime } from '@/utils/helper';
import type { ReferencePost } from '@/utils/wordpress-types';

interface ReferencesCarouselItemData {
  id: number;
  title: string;
  where?: string;
  when?: string;
  image: string;
  link: string;
}

interface ReferencesCarouselSectionProps {
  referencePosts?: ReferencePost[];
}

const ReferencesCarouselSection = ({ referencePosts = [] }: ReferencesCarouselSectionProps) => {
  const carouselData: ReferencesCarouselItemData[] = useMemo(() => {
    return referencePosts.map((post) => ({
      id: post.databaseId,
      title: post.title,
      where: post.referenceACF?.farewellPlace,
      when: formatFarewellDateTime(post.referenceACF?.farewellDate),
      image: post.featuredImage?.node.sourceUrl || '/images/placeholder.webp',
      link: `/${post.slug}`,
    }));
  }, [referencePosts]);

  if (carouselData.length === 0) {
    return null;
  }

  return (
    <GenericCarouselSection
      data={carouselData}
      carouselMaxWidth='max-w-88 lg:max-w-[48.1875rem]'
      articleClassName='flex min-h-[10rem] mx-auto items-stretch max-lg:flex-col lg:max-h-[14.375rem]'
      imageFirst
      renderImage={(item) => (
        <picture className='relative aspect-square h-auto w-full lg:max-h-[14.375rem] lg:max-w-[14.375rem]'>
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes='(max-width: 768px) 160px, 256px'
            className='object-cover'
          />
        </picture>
      )}
      renderContent={(item, t) => (
        <div className='flex flex-1 flex-col space-y-2 px-4 py-5 max-lg:h-full max-lg:justify-between lg:px-17.5 lg:py-7.5'>
          <div className='flex flex-col'>
            <FormattedText
              text={item.title}
              as='h3'
              className='text-white-smoke mb-2.5 text-xl'
            />
            {item.where && (
              <FormattedText
                text={item.where}
                as='span'
                className='text-lg text-white'
              />
            )}
            {item.when && (
              <FormattedText
                text={item.when}
                as='span'
                className='text-lg text-white'
              />
            )}
          </div>
          <Link href={item.link}>
            <Button
              buttonText={t('find-out-more')}
              className='-ml-8 lg:-ml-16'
            />
          </Link>
        </div>
      )}
    />
  );
};

export default ReferencesCarouselSection;
```

**Step 3: Verify TypeScript compiles**

Run: `bunx tsc --noEmit`
Expected: No errors (there will be import errors in other files - we'll fix in next task)

**Step 4: Commit**

```bash
git add -A
git commit -m "refactor(components): rename BlogCarouselSection to ReferencesCarouselSection with ReferencePost data"
```

---

## Task 5: Delete Old ReferencesCarouselSection

**Files:**
- Delete: `src/components/_shared/ReferencesCarouselSection.tsx` (the old one - should be gone after rename)

**Step 1: Verify old file was properly replaced**

The old `ReferencesCarouselSection.tsx` should have been replaced by the renamed `BlogCarouselSection.tsx` in Task 4. Verify:

```bash
ls -la src/components/_shared/ReferencesCarouselSection.tsx
```

Expected: File exists with new content

**Step 2: Commit (if any cleanup needed)**

Only commit if there were leftover files to remove.

---

## Task 6: Update Homepage to Use New Components

**Files:**
- Modify: `app/[locale]/page.tsx`

**Step 1: Update imports**

Replace import statements (around lines 6-10):

```typescript
import HomepageSliderSection from '@/components/_shared/HomepageSliderSection';
import ReferencesCarouselSection from '@/components/_shared/ReferencesCarouselSection';
```

Remove the old `BlogCarouselSection` import.

**Step 2: Update data extraction**

Replace line 28-29 with:

```typescript
const slides = homepageData?.homepageACF?.slider || [];
const referencePosts = homepageData?.homepageACF?.selectedReference?.nodes || [];
const services = homepageData?.homepageACF?.selectedSluzby?.nodes || [];
```

**Step 3: Update component usage**

Replace `<ReferencesCarouselSection referencePosts={referencePosts} />` (line 39) with:

```tsx
<HomepageSliderSection slides={slides} />
```

Replace `<BlogCarouselSection posts={blogPosts} />` (line 75) with:

```tsx
<ReferencesCarouselSection referencePosts={referencePosts} />
```

**Step 4: Remove unused blogPosts fetch**

Remove `getBlogPostsForCarousel` from the import (line 5) and from Promise.all (line 24).

Update Promise.all:

```typescript
const [homepageData, branchesCount, t] = await Promise.all([
  getHomepageData(),
  getBranchesCount(),
  getTranslations('home'),
]);
```

**Step 5: Verify TypeScript compiles**

Run: `bunx tsc --noEmit`
Expected: No errors

**Step 6: Verify lint passes**

Run: `bun run lint`
Expected: No errors

**Step 7: Commit**

```bash
git add app/[locale]/page.tsx
git commit -m "refactor(homepage): use HomepageSliderSection and updated ReferencesCarouselSection"
```

---

## Task 7: Update About Us Page (if using BlogCarouselSection)

**Files:**
- Check/Modify: `app/[locale]/about-us/page.tsx`

**Step 1: Check current usage**

Read the file to see if it uses BlogCarouselSection.

**Step 2: Update import if needed**

If it imports BlogCarouselSection, check what data it's using and update accordingly:
- If using blog posts → keep as is or create new BlogCarouselSection
- If using reference posts → update to use ReferencesCarouselSection

**Step 3: Verify TypeScript compiles**

Run: `bunx tsc --noEmit`
Expected: No errors

**Step 4: Commit if changes made**

```bash
git add app/[locale]/about-us/page.tsx
git commit -m "refactor(about-us): update carousel imports"
```

---

## Task 8: Final Verification

**Step 1: Run full build**

```bash
bun run build
```

Expected: Build succeeds without errors

**Step 2: Run lint**

```bash
bun run lint
```

Expected: No lint errors

**Step 3: Test locally (manual)**

```bash
bun run dev
```

Visit homepage and verify:
- New slider section appears with ACF slider data
- References carousel section appears with reference posts
- No console errors

**Step 4: Final commit if any fixes needed**

```bash
git add -A
git commit -m "fix: address any final issues from carousel refactor"
```

---

## Summary of Component Name Changes

| Old Name | New Name | Data Source |
|----------|----------|-------------|
| `ReferencesCarouselSection` | `HomepageSliderSection` | `homepageACF.slider` |
| `BlogCarouselSection` | `ReferencesCarouselSection` | `ReferencePost[]` |
