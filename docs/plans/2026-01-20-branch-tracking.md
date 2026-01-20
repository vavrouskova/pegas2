# Branch Tracking Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implementovat dataLayer tracking pro pobočky - select_item (kliknutí na detail), contact_click (kliknutí na telefon) a view_item (zobrazení detailu).

**Architecture:** Rozšíříme existující `datalayer.ts` utility o nové funkce pro pobočky. Komponenty BranchCardContent a BranchCardImage se stanou client komponenty pro podporu onClick handlerů. BranchDetailSection získá client wrapper pro view_item tracking.

**Tech Stack:** React 19, Next.js 16, TypeScript, GA4 dataLayer

---

## Task 1: Rozšíření datalayer.ts utility

**Files:**
- Modify: `src/utils/datalayer.ts`

**Step 1: Přidat nové typy a funkce**

Přidej na konec souboru:

```typescript
/**
 * DataLayer item for branch tracking
 */
export interface BranchDataLayerItem {
  item_id: string;
  item_name: string;
  item_category: string;
  item_list_name?: string;
  index?: number;
}

/**
 * Push select_item event when user clicks on a branch card
 */
export const pushBranchSelectItem = (item: BranchDataLayerItem): void => {
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
 * Push view_item event when user views a branch detail page
 */
export const pushBranchViewItem = (item: Omit<BranchDataLayerItem, 'index' | 'item_list_name'>): void => {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'view_item',
    ecommerce: {
      items: [item],
    },
  });
};

/**
 * Push contact_click event when user clicks on phone number
 */
export const pushContactClick = (contactValue: string, contactSection: string): void => {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'contact_click',
    contact_type: 'phone',
    contact_value: contactValue,
    contact_section: contactSection,
  });
};
```

**Step 2: Commit**

```bash
git add src/utils/datalayer.ts
git commit -m "feat: add branch tracking utilities to datalayer"
```

---

## Task 2: Přidat tracking props do BranchCard

**Files:**
- Modify: `src/components/branches/BranchCard.tsx`

**Step 1: Přidat tracking props do interface**

Změň interface `BranchCardProps`:

```typescript
interface BranchCardProps {
  branch: PobockaPost;
  className?: string;
  layout?: 'vertical' | 'horizontal';
  showClosedInfo?: boolean;
  showParking?: boolean;
  translations: {
    closed: string;
    detailButton: string;
  };
  // Tracking props
  index?: number;
}
```

**Step 2: Předat tracking props do child komponent**

Přidej `index` do destrukturování a předej do `BranchCardContent` a `BranchCardImage`:

```typescript
const BranchCard = ({
  branch,
  className,
  layout = 'vertical',
  showClosedInfo = true,
  showParking = true,
  translations,
  index,
}: Readonly<BranchCardProps>) => {
```

A pro obě `BranchCardImage` a `BranchCardContent` volání přidej:

```typescript
<BranchCardImage
  // ...existing props
  branchId={branch.id}
  branchTitle={branch.title}
  index={index}
/>

<BranchCardContent
  // ...existing props
  branchId={branch.id}
  branchTitle={branch.title}
  index={index}
/>
```

**Step 3: Commit**

```bash
git add src/components/branches/BranchCard.tsx
git commit -m "feat: add tracking props to BranchCard"
```

---

## Task 3: Přidat index do BranchCardClient

**Files:**
- Modify: `src/components/branches/BranchCardClient.tsx`

**Step 1: Přidat index prop**

```typescript
interface BranchCardClientProps {
  branch: PobockaPost;
  className?: string;
  layout?: 'vertical' | 'horizontal';
  showClosedInfo?: boolean;
  showParking?: boolean;
  index?: number;
}

const BranchCardClient = (props: BranchCardClientProps) => {
  const t = useTranslations('branches');

  return (
    <BranchCard
      {...props}
      translations={{
        closed: t('closed'),
        detailButton: t('detail-button'),
      }}
    />
  );
};
```

**Step 2: Commit**

```bash
git add src/components/branches/BranchCardClient.tsx
git commit -m "feat: add index prop to BranchCardClient"
```

---

## Task 4: Implementovat tracking v BranchCardImage

**Files:**
- Modify: `src/components/branches/BranchCardImage.tsx`

**Step 1: Přidat 'use client' a tracking**

```typescript
'use client';

import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { pushBranchSelectItem } from '@/utils/datalayer';

interface BranchCardImageProps {
  imageUrl?: string;
  imageAlt: string;
  layout: 'vertical' | 'horizontal';
  slug?: string;
  linkToDetail?: boolean;
  // Tracking props
  branchId?: string;
  branchTitle?: string;
  index?: number;
}

const BranchCardImage = ({
  imageUrl,
  imageAlt,
  layout,
  slug,
  linkToDetail = false,
  branchId,
  branchTitle,
  index,
}: BranchCardImageProps) => {
  const containerClasses = cn(
    'relative overflow-hidden block',
    layout === 'vertical' && 'aspect-square w-full',
    layout === 'horizontal' && 'max-lg:hidden size-[13.25rem]'
  );

  const sizes = layout === 'vertical' ? '(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw' : '120px';

  const handleClick = () => {
    if (branchId && branchTitle) {
      pushBranchSelectItem({
        item_id: branchId,
        item_name: branchTitle,
        item_category: 'Pobočky',
        item_list_name: 'Pobočky',
        index,
      });
    }
  };

  const content = (
    <>
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          sizes={sizes}
          className='object-cover'
        />
      ) : (
        <Image
          src='/images/placeholder.webp'
          alt={imageAlt}
          fill
          sizes={sizes}
          className='object-cover'
        />
      )}
    </>
  );

  if (linkToDetail && slug) {
    return (
      <Link
        href={`/${slug}`}
        className={containerClasses}
        onClick={handleClick}
      >
        {content}
      </Link>
    );
  }

  return <div className={containerClasses}>{content}</div>;
};

export default BranchCardImage;
```

**Step 2: Commit**

```bash
git add src/components/branches/BranchCardImage.tsx
git commit -m "feat: add select_item tracking to BranchCardImage"
```

---

## Task 5: Implementovat tracking v BranchCardContent

**Files:**
- Modify: `src/components/branches/BranchCardContent.tsx`

**Step 1: Přidat 'use client' a tracking**

```typescript
'use client';

import Link from 'next/link';

import Button from '@/components/_shared/Button';
import { FormattedText } from '@/components/_shared/FormattedText';
import { cn } from '@/lib/utils';
import { pushBranchSelectItem, pushContactClick } from '@/utils/datalayer';

interface BranchCardContentProps {
  city?: string;
  title?: string;
  openDaysWorking?: string;
  openDaysWeekend?: string;
  phoneNumber?: string;
  slug: string;
  detailButtonText: string;
  layout: 'vertical' | 'horizontal';
  // Tracking props
  branchId?: string;
  branchTitle?: string;
  index?: number;
}

const BranchCardContent = ({
  city,
  title,
  openDaysWorking,
  openDaysWeekend,
  phoneNumber,
  slug,
  detailButtonText,
  layout,
  branchId,
  branchTitle,
  index,
}: BranchCardContentProps) => {
  const containerClasses = cn('flex flex-1 flex-col', layout === 'vertical' ? 'py-5 px-4' : 'py-1');

  const handleDetailClick = () => {
    if (branchId && branchTitle) {
      pushBranchSelectItem({
        item_id: branchId,
        item_name: branchTitle,
        item_category: 'Pobočky',
        item_list_name: 'Pobočky',
        index,
      });
    }
  };

  const handlePhoneClick = () => {
    if (phoneNumber) {
      pushContactClick(phoneNumber, 'Pobočky');
    }
  };

  return (
    <div className={containerClasses}>
      <Link
        href={`/${slug}`}
        onClick={handleDetailClick}
      >
        {city && (
          <FormattedText
            text={city}
            as='p'
            className='font-heading text-lg'
          />
        )}
        {title && (
          <FormattedText
            text={title}
            as='h3'
            className='mb-2 text-lg'
          />
        )}
      </Link>

      {openDaysWorking && (
        <FormattedText
          text={openDaysWorking}
          as='p'
          className={cn('text-sm', !openDaysWeekend && 'mb-12')}
        />
      )}

      {openDaysWeekend && (
        <FormattedText
          text={openDaysWeekend}
          as='p'
          className='mb-12 text-sm'
        />
      )}

      {phoneNumber && (
        <Link
          href={`tel:${phoneNumber}`}
          className='text-lg underline hover:no-underline'
          onClick={handlePhoneClick}
        >
          {phoneNumber}
        </Link>
      )}

      <Link
        href={`/${slug}`}
        className='mt-2 -ml-4 lg:-ml-8'
        onClick={handleDetailClick}
      >
        <Button
          buttonText={detailButtonText}
          size='small'
          variant='destructive'
        />
      </Link>
    </div>
  );
};

export default BranchCardContent;
```

**Step 2: Commit**

```bash
git add src/components/branches/BranchCardContent.tsx
git commit -m "feat: add select_item and contact_click tracking to BranchCardContent"
```

---

## Task 6: Přidat index do BranchesSection

**Files:**
- Modify: `src/components/branches/BranchesSection.tsx`

**Step 1: Přidat index do mapování**

Změň mapování v `BranchesSection`:

```typescript
{filteredBranches.map((branch, index) => (
  <BranchCardClient
    key={branch.id}
    branch={branch}
    className='w-full max-w-[15.75rem] min-w-[15.75rem]'
    index={index}
  />
))}
```

**Step 2: Commit**

```bash
git add src/components/branches/BranchesSection.tsx
git commit -m "feat: pass index to BranchCardClient in BranchesSection"
```

---

## Task 7: Přidat index do BranchesMap

**Files:**
- Modify: `src/components/branches/BranchesMap.tsx`

**Step 1: Přidat index do mapování**

Změň mapování v `BranchesMap`:

```typescript
{branchesWithCoords.map((branch, index) => (
  <Marker
    key={branch.id}
    position={[branch.coords.lat, branch.coords.lng]}
    icon={markerIcon}
  >
    <Popup>
      <BranchCardClient
        branch={branch}
        layout='horizontal'
        showClosedInfo={false}
        showParking={false}
        className='w-80 gap-7.5 px-5.5 py-6.5 lg:w-150'
        index={index}
      />
    </Popup>
  </Marker>
))}
```

**Step 2: Commit**

```bash
git add src/components/branches/BranchesMap.tsx
git commit -m "feat: pass index to BranchCardClient in BranchesMap"
```

---

## Task 8: Vytvořit BranchDetailTracker komponentu

**Files:**
- Create: `src/components/branches/BranchDetailTracker.tsx`

**Step 1: Vytvořit client komponentu pro view_item tracking**

```typescript
'use client';

import { useEffect } from 'react';

import { pushBranchViewItem } from '@/utils/datalayer';

interface BranchDetailTrackerProps {
  branchId: string;
  branchTitle: string;
}

const BranchDetailTracker = ({ branchId, branchTitle }: BranchDetailTrackerProps) => {
  useEffect(() => {
    pushBranchViewItem({
      item_id: branchId,
      item_name: branchTitle,
      item_category: 'Pobočky',
    });
  }, [branchId, branchTitle]);

  return null;
};

export default BranchDetailTracker;
```

**Step 2: Commit**

```bash
git add src/components/branches/BranchDetailTracker.tsx
git commit -m "feat: create BranchDetailTracker component for view_item tracking"
```

---

## Task 9: Přidat tracking do BranchDetailSection

**Files:**
- Modify: `src/components/branches/BranchDetailSection.tsx`

**Step 1: Importovat a použít BranchDetailTracker**

Přidej import:

```typescript
import BranchDetailTracker from '@/components/branches/BranchDetailTracker';
```

Přidej komponentu hned za otevírací `<>` fragment:

```typescript
return (
  <>
    <BranchDetailTracker
      branchId={branchData.id}
      branchTitle={title || ''}
    />
    <Breadcrumbs
      // ...rest
```

**Step 2: Commit**

```bash
git add src/components/branches/BranchDetailSection.tsx
git commit -m "feat: add view_item tracking to BranchDetailSection"
```

---

## Task 10: Přidat tracking pro telefon na detailu pobočky

**Files:**
- Modify: `src/components/branches/BranchContactInfo.tsx`

**Step 1: Přidat 'use client' a tracking**

```typescript
'use client';

import Link from 'next/link';

import { pushContactClick } from '@/utils/datalayer';

interface BranchContactInfoProps {
  phoneNumber?: string;
  email?: string;
}

const CONTACT_LINK_CLASS = 'text-lg underline hover:no-underline';

export const BranchContactInfo = ({ phoneNumber, email }: BranchContactInfoProps) => {
  if (!phoneNumber && !email) return null;

  const handlePhoneClick = () => {
    if (phoneNumber) {
      pushContactClick(phoneNumber, 'Pobočky - Detail');
    }
  };

  return (
    <>
      {phoneNumber && (
        <div>
          <Link
            href={`tel:${phoneNumber.replace(/\s/g, '')}`}
            className={CONTACT_LINK_CLASS}
            onClick={handlePhoneClick}
          >
            {phoneNumber}
          </Link>
        </div>
      )}
      {email && (
        <div>
          <Link
            href={`mailto:${email}`}
            className={CONTACT_LINK_CLASS}
          >
            {email}
          </Link>
        </div>
      )}
    </>
  );
};
```

**Step 2: Commit**

```bash
git add src/components/branches/BranchContactInfo.tsx
git commit -m "feat: add contact_click tracking to BranchContactInfo"
```

---

## Task 11: Finální ověření a commit

**Step 1: Spustit lint**

```bash
bun run lint
```

Expected: Žádné errory (možná pouze existující warning)

**Step 2: Otestovat na localhostu**

1. Otevři konzoli (F12)
2. Vlož snippet pro sledování dataLayer:
```javascript
(function() {
  const originalPush = window.dataLayer.push;
  window.dataLayer.push = function(...args) {
    console.log('📊 dataLayer push:', args);
    return originalPush.apply(this, args);
  };
})();
```
3. Klikni na pobočku - měl bys vidět `select_item` event
4. Klikni na telefon - měl bys vidět `contact_click` event
5. Otevři detail pobočky - měl bys vidět `view_item` event

**Step 3: Finální commit (pokud byly nějaké opravy)**

```bash
git add .
git commit -m "fix: address lint issues in branch tracking"
```

---

## Shrnutí změn

| Soubor | Změna |
|--------|-------|
| `src/utils/datalayer.ts` | Přidány `pushBranchSelectItem`, `pushBranchViewItem`, `pushContactClick` |
| `src/components/branches/BranchCard.tsx` | Přidán `index` prop |
| `src/components/branches/BranchCardClient.tsx` | Přidán `index` prop |
| `src/components/branches/BranchCardImage.tsx` | Přidán `'use client'`, tracking props, `handleClick` |
| `src/components/branches/BranchCardContent.tsx` | Přidán `'use client'`, tracking props, `handleDetailClick`, `handlePhoneClick` |
| `src/components/branches/BranchesSection.tsx` | Přidán `index` do mapování |
| `src/components/branches/BranchesMap.tsx` | Přidán `index` do mapování |
| `src/components/branches/BranchDetailTracker.tsx` | **Nový soubor** - client komponenta pro view_item |
| `src/components/branches/BranchDetailSection.tsx` | Přidán `BranchDetailTracker` |
| `src/components/branches/BranchContactInfo.tsx` | Přidán `'use client'`, `handlePhoneClick` |
