# DataLayer Tracking & ServiceCard Bug Fix Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix undefined class bug in ServiceCard and implement GA4 ecommerce tracking (select_item, view_item) for service/product tiles and detail pages.

**Architecture:** Create a reusable DataLayer utility, convert ServiceCard to client component with click tracking, and add view_item tracking wrapper for detail pages. Pass section context (title, type) through component props.

**Tech Stack:** Next.js 16, React 19, TypeScript, GA4 DataLayer

---

## Task 1: Fix undefined className Bug in ServiceCard

**Files:**
- Modify: `src/components/_shared/ServiceCard.tsx:30`

**Step 1: Fix the className interpolation**

Change line 30 from:
```tsx
className={`group flex flex-col gap-2.5 transition-opacity duration-300 hover:opacity-80 ${className}`}
```

To:
```tsx
className={`group flex flex-col gap-2.5 transition-opacity duration-300 hover:opacity-80${className ? ` ${className}` : ''}`}
```

**Step 2: Verify fix**

Run: `bun run lint`
Expected: No errors related to ServiceCard

**Step 3: Commit**

```bash
git add src/components/_shared/ServiceCard.tsx
git commit -m "fix: resolve undefined class in ServiceCard className interpolation"
```

---

## Task 2: Create DataLayer Utility Functions

**Files:**
- Create: `src/utils/datalayer.ts`

**Step 1: Create the DataLayer utility file**

```typescript
/**
 * DataLayer utility functions for GA4 ecommerce tracking
 */

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

export interface DataLayerItem {
  item_id: string;
  item_name: string;
  item_category: string;
  item_category2: 'Produkty' | 'Služby';
  index?: number;
  price?: number;
}

/**
 * Push select_item event when user clicks on a service/product tile
 */
export const pushSelectItem = (item: DataLayerItem): void => {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'select_item',
    ecommerce: {
      items: [item],
    },
  });
};

/**
 * Push view_item event when user views a service/product detail page
 */
export const pushViewItem = (item: Omit<DataLayerItem, 'index'>): void => {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'view_item',
    ecommerce: {
      items: [item],
    },
  });
};
```

**Step 2: Verify file was created**

Run: `bun run lint src/utils/datalayer.ts`
Expected: No lint errors

**Step 3: Commit**

```bash
git add src/utils/datalayer.ts
git commit -m "feat: add DataLayer utility functions for GA4 ecommerce tracking"
```

---

## Task 3: Convert ServiceCard to Client Component with Tracking

**Files:**
- Modify: `src/components/_shared/ServiceCard.tsx`

**Step 1: Add 'use client' directive and imports**

Add at the top of the file:
```tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';

import { FormattedText } from '@/components/_shared/FormattedText';
import { pushSelectItem } from '@/utils/datalayer';
```

**Step 2: Update interface with tracking props**

Replace interface:
```tsx
interface ServiceCardProps {
  id: string;
  title: string;
  slug: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
      altText: string;
      mediaDetails?: {
        width: number;
        height: number;
      };
    };
  };
  className?: string;
  // Tracking props
  sectionTitle?: string;
  type?: 'product' | 'service';
  index?: number;
}
```

**Step 3: Update component with click handler**

Replace component implementation:
```tsx
const ServiceCard = ({
  id,
  title,
  slug,
  featuredImage,
  className,
  sectionTitle,
  type = 'service',
  index,
}: ServiceCardProps) => {
  const imageUrl = featuredImage?.node?.sourceUrl || '/images/placeholder.webp';
  const imageAlt = featuredImage?.node?.altText || title;

  const handleClick = () => {
    if (sectionTitle) {
      pushSelectItem({
        item_id: id,
        item_name: title,
        item_category: sectionTitle,
        item_category2: type === 'product' ? 'Produkty' : 'Služby',
        index,
      });
    }
  };

  return (
    <Link
      href={`/${slug}`}
      onClick={handleClick}
      className={`group flex flex-col gap-2.5 transition-opacity duration-300 hover:opacity-80${className ? ` ${className}` : ''}`}
    >
      <div className='bg-grey-warm p-[13%]'>
        <div className='relative aspect-square w-full overflow-hidden'>
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
            className='object-cover'
          />
        </div>
      </div>

      {/* Nadpis */}
      <FormattedText
        text={title}
        as='h3'
        className='text-lg leading-tight font-black tracking-wide'
      />
    </Link>
  );
};

export default ServiceCard;
```

**Step 4: Verify lint passes**

Run: `bun run lint src/components/_shared/ServiceCard.tsx`
Expected: No lint errors

**Step 5: Commit**

```bash
git add src/components/_shared/ServiceCard.tsx
git commit -m "feat: add DataLayer select_item tracking to ServiceCard"
```

---

## Task 4: Update ServicesGridSection to Pass Tracking Props

**Files:**
- Modify: `src/components/services/ServicesGridSection.tsx`

**Step 1: Update interface with type prop**

Update interface:
```tsx
interface ServicesGridSectionProps {
  title: string;
  description: string;
  services: ServicePost[];
  id?: string;
  type?: 'product' | 'service';
}
```

**Step 2: Update component to pass tracking props**

Update component signature and ServiceCard usage:
```tsx
const ServicesGridSection = ({ title, description, services, id, type = 'service' }: ServicesGridSectionProps) => {
```

Update the ServiceCard mapping (replace existing map):
```tsx
{services.map((service, index) => (
  <ServiceCard
    key={getUniqueId()}
    id={service.id}
    title={service.title}
    slug={service.slug}
    featuredImage={service.featuredImage}
    sectionTitle={title}
    type={type}
    index={index}
  />
))}
```

**Step 3: Verify lint passes**

Run: `bun run lint src/components/services/ServicesGridSection.tsx`
Expected: No lint errors

**Step 4: Commit**

```bash
git add src/components/services/ServicesGridSection.tsx
git commit -m "feat: pass tracking props to ServiceCard in ServicesGridSection"
```

---

## Task 5: Update Services Page to Specify Content Types

**Files:**
- Modify: `app/[locale]/services/page.tsx`

**Step 1: Add type prop to funeral ceremonies section**

Update the first ServicesGridSection (line 67-72):
```tsx
<ServicesGridSection
  id='smutecni-obrady'
  title={funeralCeremonies.taxonomy?.name || 'Smuteční obřady'}
  description={funeralCeremonies.taxonomy?.description || ''}
  services={funeralCeremonies.posts}
  type='service'
/>
```

**Step 2: Add type prop to funeral essentials section**

Update the second ServicesGridSection (line 83-88):
```tsx
<ServicesGridSection
  id='nalezitosti-pohrbu'
  title={funeralEssentials.taxonomy?.name || 'Náležitosti pohřbu'}
  description={funeralEssentials.taxonomy?.description || ''}
  services={funeralEssentials.posts}
  type='product'
/>
```

**Step 3: Verify lint passes**

Run: `bun run lint app/[locale]/services/page.tsx`
Expected: No lint errors

**Step 4: Commit**

```bash
git add app/[locale]/services/page.tsx
git commit -m "feat: specify content types for DataLayer tracking on services page"
```

---

## Task 6: Create ViewItemTracker Client Component

**Files:**
- Create: `src/components/_shared/ViewItemTracker.tsx`

**Step 1: Create the client component**

```tsx
'use client';

import { useEffect } from 'react';

import { pushViewItem } from '@/utils/datalayer';

interface ViewItemTrackerProps {
  itemId: string;
  itemName: string;
  itemCategory: string;
  itemCategory2: 'Produkty' | 'Služby';
  price?: number;
}

const ViewItemTracker = ({ itemId, itemName, itemCategory, itemCategory2, price }: ViewItemTrackerProps) => {
  useEffect(() => {
    pushViewItem({
      item_id: itemId,
      item_name: itemName,
      item_category: itemCategory,
      item_category2: itemCategory2,
      price,
    });
  }, [itemId, itemName, itemCategory, itemCategory2, price]);

  return null;
};

export default ViewItemTracker;
```

**Step 2: Verify lint passes**

Run: `bun run lint src/components/_shared/ViewItemTracker.tsx`
Expected: No lint errors

**Step 3: Commit**

```bash
git add src/components/_shared/ViewItemTracker.tsx
git commit -m "feat: add ViewItemTracker client component for detail page tracking"
```

---

## Task 7: Add view_item Tracking to Service Detail Pages

**Files:**
- Modify: `app/[locale]/[slug]/page.tsx`

**Step 1: Add ViewItemTracker import**

Add to imports (around line 19):
```tsx
import ViewItemTracker from '@/components/_shared/ViewItemTracker';
```

**Step 2: Add tracking to sluzbyPost detail (service pages)**

Find the return statement for service detail (around line 345) and add ViewItemTracker after opening `<main>`:
```tsx
return (
  <main className='max-w-container mx-auto'>
    <ViewItemTracker
      itemId={serviceData.id}
      itemName={title}
      itemCategory={typSluzby?.nodes?.[0]?.name || 'Služby'}
      itemCategory2={typSluzby?.nodes?.[0]?.slug === 'nalezitosti-pohrbu' ? 'Produkty' : 'Služby'}
    />
    <BasicHeroSection
```

**Step 3: Add tracking to pobockaPost detail (branch pages)**

Find the return statement for pobockaPost (around line 205) and add ViewItemTracker:
```tsx
return (
  <main className='max-w-container mx-auto'>
    <ViewItemTracker
      itemId={slug}
      itemName={`Pobočka ${slug}`}
      itemCategory='Pobočky'
      itemCategory2='Služby'
    />
    <BranchDetailSection slug={slug} />
```

Note: Branch tracking requires fetching branch data first. Let me update this step.

**Step 3 (revised): Get branch data for proper tracking**

Since we need the branch title, we need to fetch the data. Update the pobockaPost section:
```tsx
if (slugType === 'pobockaPost') {
  const [funeralEssentials, branchData] = await Promise.all([
    getServicesByTaxonomy('nalezitosti-pohrbu'),
    getBranchBySlug(slug),
  ]);

  const branchTitle = branchData?.title || slug;
  const branchCity = branchData?.pobockyACF?.city || '';

  return (
    <main className='max-w-container mx-auto'>
      <ViewItemTracker
        itemId={slug}
        itemName={branchCity ? `${branchCity}, Pobočka ${branchTitle}` : `Pobočka ${branchTitle}`}
        itemCategory='Pobočky'
        itemCategory2='Služby'
      />
      <BranchDetailSection slug={slug} />
```

Also add the import at the top:
```tsx
import { getBranchBySlug } from '@/api/wordpress-api';
```

Wait - getBranchBySlug is already imported. Just need to call it.

**Step 4: Verify lint passes**

Run: `bun run lint app/[locale]/[slug]/page.tsx`
Expected: No lint errors

**Step 5: Commit**

```bash
git add app/[locale]/[slug]/page.tsx
git commit -m "feat: add view_item DataLayer tracking to service and branch detail pages"
```

---

## Task 8: Update ServicesSection (Homepage) with Tracking Props

**Files:**
- Modify: `src/components/_shared/ServicesSection.tsx`

**Step 1: Update ServiceCard usage with tracking props**

Update the ServiceCard mapping in the component:
```tsx
{services.map((service, index) => (
  <ServiceCard
    key={getUniqueId()}
    id={service.id}
    title={service.title}
    slug={service.slug}
    featuredImage={service.featuredImage}
    className='lg:flex-1'
    sectionTitle={t('home.services-nav.title')}
    type='service'
    index={index}
  />
))}
```

Note: This component uses `getTranslations()` which returns a Promise, but the `t` function is already available. The section title comes from translations.

Actually, looking at the file again, `ServicesSection` is an async server component that calls `getTranslations()`. The `t` function returns a string for `t('home.services-nav.title')` which can be passed to ServiceCard.

**Step 2: Verify lint passes**

Run: `bun run lint src/components/_shared/ServicesSection.tsx`
Expected: No lint errors

**Step 3: Commit**

```bash
git add src/components/_shared/ServicesSection.tsx
git commit -m "feat: add tracking props to ServiceCard in ServicesSection"
```

---

## Task 9: Final Verification

**Step 1: Run full lint check**

Run: `bun run lint`
Expected: No errors

**Step 2: Run build**

Run: `bun run build`
Expected: Build succeeds

**Step 3: Manual testing checklist**

- [ ] Visit `/sluzby` page - verify no "undefined" class in tiles
- [ ] Click a service tile in "Smuteční obřady" section - verify DataLayer push with `item_category: "Smuteční obřady"` and `item_category2: "Služby"`
- [ ] Click a product tile in "Náležitosti pohřbu" section - verify DataLayer push with `item_category: "Náležitosti pohřbu"` and `item_category2: "Produkty"`
- [ ] Visit a service detail page - verify `view_item` event in DataLayer
- [ ] Visit a branch detail page - verify `view_item` event in DataLayer

To check DataLayer in browser:
```javascript
// In browser console
console.log(window.dataLayer);
```

**Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete DataLayer GA4 ecommerce tracking implementation"
```

---

## Summary of Changes

| File | Change |
|------|--------|
| `src/components/_shared/ServiceCard.tsx` | Fixed undefined class bug, added click tracking |
| `src/utils/datalayer.ts` | New utility for DataLayer events |
| `src/components/services/ServicesGridSection.tsx` | Pass section title and type to ServiceCard |
| `app/[locale]/services/page.tsx` | Specify product vs service types |
| `src/components/_shared/ViewItemTracker.tsx` | New component for view_item tracking |
| `app/[locale]/[slug]/page.tsx` | Add view_item tracking to detail pages |
| `src/components/_shared/ServicesSection.tsx` | Add tracking to homepage services |
