# Header Megamenu Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add hover-activated megamenu to header navigation for "Služby" and "Blog" items with blur overlay.

**Architecture:** Extend HeaderLink interface with optional `id` and `children` fields. Create MegamenuDropdown component using Framer Motion AnimatePresence for smooth enter/exit animations. Add backdrop blur overlay (portal to body) when megamenu is open. Megamenu activates on mouseenter, closes on mouseleave with small delay for UX.

**Tech Stack:** React 19, Framer Motion, Tailwind CSS, next-intl

---

## Task 1: Extend HeaderLink Interface with ID and Children

**Files:**

- Modify: `src/components/header/HeaderContent.tsx:13-16`

**Step 1: Update HeaderLink interface**

Add `id` and `children` fields to support megamenu items:

```typescript
export interface HeaderLink {
  id?: string;
  href: string;
  label: string;
  children?: HeaderLink[];
}
```

**Step 2: Verify TypeScript compiles**

Run: `bun run lint`
Expected: No errors

**Step 3: Commit**

```bash
git add src/components/header/HeaderContent.tsx
git commit -m "feat(header): extend HeaderLink interface for megamenu support"
```

---

## Task 2: Add IDs to Header Links Data

**Files:**

- Modify: `src/utils/data.ts:5-35`

**Step 1: Add id field to each header link**

```typescript
export const getHeaderLinks = async () => {
  const tHeader = await getTranslations('header');
  const tRoutes = await getTranslations('routes');

  return [
    {
      id: 'faq',
      label: tHeader('faq'),
      href: `/${tRoutes('faq')}`,
    },
    {
      id: 'services',
      label: tHeader('services'),
      href: `/${tRoutes('services')}`,
    },
    {
      id: 'references',
      label: tHeader('references'),
      href: `/${tRoutes('references')}`,
    },
    {
      id: 'blog',
      label: tHeader('blog'),
      href: `/${tRoutes('blog')}`,
    },
    {
      id: 'about-us',
      label: tHeader('about-us'),
      href: `/${tRoutes('about-us')}`,
    },
    {
      id: 'contacts',
      label: tHeader('contacts'),
      href: `/${tRoutes('contacts')}`,
    },
  ];
};
```

**Step 2: Verify build passes**

Run: `bun run lint`
Expected: No errors

**Step 3: Commit**

```bash
git add src/utils/data.ts
git commit -m "feat(header): add id field to header links"
```

---

## Task 3: Create Megamenu Dummy Data

**Files:**

- Modify: `src/utils/data.ts`

**Step 1: Add dummy megamenu items for services and blog**

Add this after `getHeaderLinks` function:

```typescript
// Dummy data for megamenu - will be replaced with GraphQL data later
export const getMegamenuItems = (linkId: string): HeaderLink[] | undefined => {
  const megamenuData: Record<string, HeaderLink[]> = {
    services: [
      { id: 'all-services', label: 'Všechny služby', href: '/sluzby' },
      { id: 'prevoz', label: 'Převoz zesnulých', href: '/sluzby/prevoz-zesnulych' },
      { id: 'smutecni', label: 'Smuteční obřady', href: '/sluzby/smutecni-obrady' },
      { id: 'doplnkove', label: 'Doplňkové služby a produkty', href: '/sluzby/doplnkove-sluzby' },
      { id: 'vazby', label: 'Vazby květin', href: '/sluzby/vazby-kvetin' },
      { id: 'mista', label: 'Místa rozloučení', href: '/sluzby/mista-rozlouceni' },
    ],
    blog: [
      { id: 'all-blog', label: 'Všechny články', href: '/blog' },
      { id: 'rady', label: 'Rady a tipy', href: '/blog/kategorie/rady-a-tipy' },
      { id: 'novinky', label: 'Novinky', href: '/blog/kategorie/novinky' },
    ],
  };

  return megamenuData[linkId];
};
```

**Step 2: Add import for HeaderLink type at top of file**

```typescript
import { getTranslations } from 'next-intl/server';

import { HeaderLink } from '@/components/header/HeaderContent';
```

**Step 3: Verify lint passes**

Run: `bun run lint`
Expected: No errors

**Step 4: Commit**

```bash
git add src/utils/data.ts
git commit -m "feat(header): add dummy megamenu data for services and blog"
```

---

## Task 4: Create MegamenuOverlay Component (Backdrop Blur)

**Files:**

- Create: `src/components/header/MegamenuOverlay.tsx`

**Step 1: Create the overlay component**

```typescript
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

interface MegamenuOverlayProps {
  isVisible: boolean;
}

export const MegamenuOverlay = ({ isVisible }: MegamenuOverlayProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className='fixed inset-0 top-[var(--header-height,80px)] z-40 bg-black/20 backdrop-blur-sm'
          aria-hidden='true'
        />
      )}
    </AnimatePresence>,
    document.body
  );
};
```

**Step 2: Verify lint passes**

Run: `bun run lint`
Expected: No errors

**Step 3: Commit**

```bash
git add src/components/header/MegamenuOverlay.tsx
git commit -m "feat(header): add MegamenuOverlay component with backdrop blur"
```

---

## Task 5: Create MegamenuDropdown Component

**Files:**

- Create: `src/components/header/MegamenuDropdown.tsx`

**Step 1: Create the dropdown component**

```typescript
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';

import { HeaderLink } from '@/components/header/HeaderContent';
import { cn } from '@/lib/utils';

interface MegamenuDropdownProps {
  items: HeaderLink[];
  isOpen: boolean;
}

export const MegamenuDropdown = ({ items, isOpen }: MegamenuDropdownProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className='absolute left-0 top-full z-50 min-w-[200px] pt-2'
        >
          <div className='bg-white-smoke rounded-sm py-4 shadow-lg'>
            <ul className='flex flex-col'>
              {items.map((item, index) => (
                <motion.li
                  key={item.id || item.href}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      'text-secondary hover:text-primary block px-6 py-2 text-sm transition-colors duration-200',
                      index === 0 && 'font-cta'
                    )}
                  >
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
```

**Step 2: Verify lint passes**

Run: `bun run lint`
Expected: No errors

**Step 3: Commit**

```bash
git add src/components/header/MegamenuDropdown.tsx
git commit -m "feat(header): add MegamenuDropdown component with animations"
```

---

## Task 6: Create NavItem Component with Megamenu Support

**Files:**

- Create: `src/components/header/NavItem.tsx`

**Step 1: Create the NavItem component**

```typescript
'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

import { HeaderLink } from '@/components/header/HeaderContent';
import { MegamenuDropdown } from '@/components/header/MegamenuDropdown';
import { cn } from '@/lib/utils';

interface NavItemProps {
  link: HeaderLink;
  isActive: boolean;
  megamenuItems?: HeaderLink[];
  onMegamenuOpen?: () => void;
  onMegamenuClose?: () => void;
}

export const NavItem = ({
  link,
  isActive,
  megamenuItems,
  onMegamenuOpen,
  onMegamenuClose,
}: NavItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasMegamenu = megamenuItems && megamenuItems.length > 0;

  const handleMouseEnter = () => {
    if (!hasMegamenu) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setIsOpen(true);
    onMegamenuOpen?.();
  };

  const handleMouseLeave = () => {
    if (!hasMegamenu) return;

    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      onMegamenuClose?.();
    }, 150);
  };

  const linkClassName = cn(
    'hover:text-secondary flex items-center gap-1 text-sm transition-all duration-300 hover:opacity-70 xl:text-base',
    isActive ? 'font-cta' : 'font-text'
  );

  if (!hasMegamenu) {
    return (
      <Link href={link.href} className={linkClassName}>
        {link.label}
      </Link>
    );
  }

  return (
    <div
      className='relative'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link href={link.href} className={linkClassName}>
        {link.label}
        <ChevronDown
          className={cn(
            'h-4 w-4 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </Link>
      <MegamenuDropdown items={megamenuItems} isOpen={isOpen} />
    </div>
  );
};
```

**Step 2: Verify lint passes**

Run: `bun run lint`
Expected: No errors

**Step 3: Commit**

```bash
git add src/components/header/NavItem.tsx
git commit -m "feat(header): add NavItem component with megamenu hover logic"
```

---

## Task 7: Integrate Megamenu into HeaderContent

**Files:**

- Modify: `src/components/header/HeaderContent.tsx`

**Step 1: Update imports**

Add at top of file:

```typescript
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import Logo from '@/components/header/Logo';
import { MegamenuOverlay } from '@/components/header/MegamenuOverlay';
import MobileMenu from '@/components/header/MobileMenu';
import { NavItem } from '@/components/header/NavItem';
import { SearchTriggerButton } from '@/components/header/SearchTriggerButton';
import Search from '@/components/icons/Search';
import { cn } from '@/lib/utils';
import { getMegamenuItems } from '@/utils/data';
```

**Step 2: Update HeaderContent component**

Replace the entire component:

```typescript
const HeaderContent = ({ headerLinks }: HeaderContentProps) => {
  const pathname = usePathname();
  const [isMegamenuOpen, setIsMegamenuOpen] = useState(false);

  const isActiveLink = (href: string) => {
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, '') || '/';
    const hrefWithoutLocale = href.replace(/^\/[a-z]{2}(?=\/|$)/, '') || '/';

    if (hrefWithoutLocale === '/') {
      return pathWithoutLocale === '/';
    }
    return pathWithoutLocale.startsWith(hrefWithoutLocale);
  };

  const handleMegamenuOpen = () => setIsMegamenuOpen(true);
  const handleMegamenuClose = () => setIsMegamenuOpen(false);

  return (
    <>
      <Logo className='lg:mb-[0.19rem]' />
      <nav className='2lg:gap-8 hidden gap-6 lg:flex'>
        {headerLinks.map((link) => (
          <NavItem
            key={link.id || link.href}
            link={link}
            isActive={isActiveLink(link.href)}
            megamenuItems={link.id ? getMegamenuItems(link.id) : undefined}
            onMegamenuOpen={handleMegamenuOpen}
            onMegamenuClose={handleMegamenuClose}
          />
        ))}
      </nav>
      <div className='flex items-center gap-4'>
        <SearchTriggerButton>
          <Search className='h-6 w-6' />
        </SearchTriggerButton>
        <MobileMenu headerLinks={headerLinks} />
      </div>
      <MegamenuOverlay isVisible={isMegamenuOpen} />
    </>
  );
};

export default HeaderContent;
```

**Step 3: Remove unused import**

Remove `getUniqueId` import since we now use `link.id || link.href` as key.

**Step 4: Verify lint passes**

Run: `bun run lint`
Expected: No errors

**Step 5: Commit**

```bash
git add src/components/header/HeaderContent.tsx
git commit -m "feat(header): integrate megamenu into HeaderContent"
```

---

## Task 8: Add CSS Variable for Header Height

**Files:**

- Modify: `src/components/header/Header.tsx` (check exact file name)

**Step 1: Check Header component**

First, read the Header.tsx file to see current structure.

**Step 2: Add CSS variable to header wrapper**

Add `style={{ '--header-height': '80px' } as React.CSSProperties}` to the header element, or add via Tailwind class if using CSS.

Alternative approach - add to global CSS in `src/styles/globals.css`:

```css
:root {
  --header-height: 80px;
}

@media (min-width: 1024px) {
  :root {
    --header-height: 100px;
  }
}
```

**Step 3: Verify styles apply correctly**

Run dev server and check overlay positioning.

**Step 4: Commit**

```bash
git add src/styles/globals.css
git commit -m "feat(header): add --header-height CSS variable for overlay positioning"
```

---

## Task 9: Visual Testing and Polish

**Files:**

- May require adjustments to multiple files

**Step 1: Test megamenu on dev server**

Verify:

- Služby shows dropdown on hover with 6 items
- Blog shows dropdown on hover with 3 items
- Other nav items have no dropdown
- Blur overlay appears when megamenu opens
- Chevron rotates on open
- Smooth animations on enter/exit
- First item in dropdown is bold (font-cta)

**Step 2: Adjust styling if needed**

Common adjustments:

- Dropdown min-width
- Padding values
- Animation timing
- Overlay opacity/blur intensity

**Step 3: Test sticky header**

Verify megamenu works in StickyHeader as well (uses same HeaderContent).

**Step 4: Test responsive**

Verify megamenu is hidden on mobile (lg:flex handles this).

**Step 5: Final commit**

```bash
git add .
git commit -m "feat(header): polish megamenu styling and animations"
```

---

## Summary

| Task | Description                        | Files                      |
| ---- | ---------------------------------- | -------------------------- |
| 1    | Extend HeaderLink interface        | HeaderContent.tsx          |
| 2    | Add IDs to header links            | data.ts                    |
| 3    | Create megamenu dummy data         | data.ts                    |
| 4    | Create MegamenuOverlay component   | MegamenuOverlay.tsx (new)  |
| 5    | Create MegamenuDropdown component  | MegamenuDropdown.tsx (new) |
| 6    | Create NavItem component           | NavItem.tsx (new)          |
| 7    | Integrate into HeaderContent       | HeaderContent.tsx          |
| 8    | Add CSS variable for header height | globals.css                |
| 9    | Visual testing and polish          | various                    |

---

## Future Work (Not in Scope)

- Replace dummy data with GraphQL query
- Add keyboard navigation (arrow keys, escape)
- Mobile accordion version (if needed)
- Analytics tracking on megamenu clicks
