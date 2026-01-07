# Project Refactoring & Code Review Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Complete project review and refactoring focusing on DRY principles, performance optimization, and code quality improvements before final release.

**Architecture:** Consolidate duplicated utilities/components, add memoization for performance, improve API layer with proper error handling, and split oversized components into manageable pieces.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, GraphQL (WordPress)

---

## Phase 1: Critical DRY Violations (High Priority)

### Task 1.1: Consolidate Pagination Helpers

**Files:**
- Delete: `src/utils/blog-helpers.ts`
- Delete: `src/utils/references-helpers.ts`
- Create: `src/utils/pagination-helpers.ts`
- Modify: `src/components/_shared/BlogPagination.tsx`
- Modify: `src/components/_shared/ReferencesPagination.tsx`

**Step 1: Create unified pagination helpers file**

```typescript
// src/utils/pagination-helpers.ts
/**
 * Generic pagination helper functions
 */

/**
 * Parses page number from URL params with validation
 */
export function parsePageNumber(pageParameter: string | undefined, defaultValue = 1): number {
  if (!pageParameter) {
    return defaultValue;
  }

  const parsed = Number.parseInt(pageParameter, 10);
  return Number.isNaN(parsed) || parsed < 1 ? defaultValue : parsed;
}

/**
 * Creates URL search params with updated values
 */
export function updateSearchParameters(
  currentParameters: URLSearchParams,
  updates: Record<string, string | null>
): URLSearchParams {
  const parameters = new URLSearchParams(currentParameters.toString());

  Object.entries(updates).forEach(([key, value]) => {
    if (value === null || value === '') {
      parameters.delete(key);
    } else {
      parameters.set(key, value);
    }
  });

  return parameters;
}

/**
 * Resets pagination parameter
 */
export function resetPagination(
  parameters: URLSearchParams,
  pageParam: string
): URLSearchParams {
  const newParameters = new URLSearchParams(parameters.toString());
  newParameters.delete(pageParam);
  return newParameters;
}
```

**Step 2: Run build to verify no TypeScript errors**

Run: `npm run build`
Expected: Build succeeds (may have warnings about unused imports temporarily)

**Step 3: Update BlogPagination imports**

Replace import in `src/components/_shared/BlogPagination.tsx`:
```typescript
// Before:
import { updateSearchParameters } from '@/utils/blog-helpers';

// After:
import { updateSearchParameters } from '@/utils/pagination-helpers';
```

**Step 4: Update ReferencesPagination imports**

Replace import in `src/components/_shared/ReferencesPagination.tsx`:
```typescript
// Before:
import { updateSearchParameters } from '@/utils/references-helpers';

// After:
import { updateSearchParameters } from '@/utils/pagination-helpers';
```

**Step 5: Update any other imports of blog-helpers/references-helpers**

Search for other usages and update:
- `src/components/_shared/Filter.tsx` - may import resetPagination

**Step 6: Delete old helper files**

```bash
rm src/utils/blog-helpers.ts src/utils/references-helpers.ts
```

**Step 7: Run lint and build**

Run: `npm run lint && npm run build`
Expected: PASS with no errors

**Step 8: Commit**

```bash
git add src/utils/pagination-helpers.ts src/components/_shared/BlogPagination.tsx src/components/_shared/ReferencesPagination.tsx
git add -u  # stages deletions
git commit -m "refactor: consolidate pagination helpers into single file

- Create src/utils/pagination-helpers.ts with generic functions
- Remove duplicate blog-helpers.ts and references-helpers.ts
- Update imports in pagination components"
```

---

### Task 1.2: Create Generic Pagination Component

**Files:**
- Create: `src/components/_shared/Pagination.tsx`
- Modify: `src/components/_shared/BlogPagination.tsx` (simplify to wrapper)
- Modify: `src/components/_shared/ReferencesPagination.tsx` (simplify to wrapper)

**Step 1: Create generic Pagination component**

```typescript
// src/components/_shared/Pagination.tsx
'use client';

import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

import ArrowRight from '@/components/icons/ArrowRight';
import { cn } from '@/lib/utils';
import { updateSearchParameters } from '@/utils/pagination-helpers';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  pageParam: string;
}

const Pagination = ({ totalPages, currentPage, pageParam }: PaginationProps) => {
  const router = useRouter();
  const searchParameters = useSearchParams();
  const t = useTranslations('common');

  const handlePageChange = useCallback(
    (page: number) => {
      if (page < 1 || page > totalPages || page === currentPage) {
        return;
      }

      const updatedParameters = updateSearchParameters(searchParameters, {
        [pageParam]: page === 1 ? null : page.toString(),
      });

      router.push(`?${updatedParameters.toString()}`);
    },
    [router, searchParameters, totalPages, currentPage, pageParam]
  );

  const handlePrevious = useCallback(() => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  }, [currentPage, handlePageChange]);

  const handleNext = useCallback(() => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  }, [currentPage, totalPages, handlePageChange]);

  if (totalPages <= 1) {
    return null;
  }

  const canScrollPrevious = currentPage > 1;
  const canScrollNext = currentPage < totalPages;

  const getVisiblePages = (): number[] => {
    const maxVisible = 7;
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const pages: number[] = [];
    const sidePages = Math.floor((maxVisible - 3) / 2);

    let start = Math.max(1, currentPage - sidePages);
    let end = Math.min(totalPages, currentPage + sidePages);

    if (end - start < maxVisible - 2) {
      if (start === 1) {
        end = Math.min(totalPages, start + maxVisible - 2);
      } else if (end === totalPages) {
        start = Math.max(1, end - maxVisible + 2);
      }
    }

    if (start > 1) {
      pages.push(1);
      if (start > 2) {
        pages.push(-1);
      }
    }

    for (let index = start; index <= end; index++) {
      pages.push(index);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push(-1);
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className='relative mt-34'>
      <div className='flex items-center justify-center gap-4 md:gap-10'>
        <button
          onClick={handlePrevious}
          disabled={!canScrollPrevious}
          className={cn(
            'flex h-8 w-8 items-center justify-center',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'transition-opacity hover:opacity-80'
          )}
          aria-label={t('previous-page')}
        >
          <ArrowRight className='h-6 w-6 rotate-180' />
        </button>

        <div className='flex items-center gap-2 md:hidden'>
          <span className='text-base'>
            {currentPage} / {totalPages}
          </span>
        </div>

        <div className='hidden items-center space-x-2.5 md:flex'>
          {visiblePages.map((pageNumber, index) => {
            if (pageNumber === -1) {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className='flex min-w-[24px] items-center justify-center px-2 py-1 text-base'
                >
                  ...
                </span>
              );
            }

            const isActive = currentPage === pageNumber;

            return (
              <button
                key={`page-${pageNumber}`}
                onClick={() => handlePageChange(pageNumber)}
                className={cn(
                  'flex cursor-pointer items-center justify-center transition-all duration-500 hover:opacity-80',
                  'min-w-[24px] px-2 py-1',
                  isActive && 'bg-primary'
                )}
                aria-label={`${t('go-to-page')} ${pageNumber}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className={cn('text-base leading-normal', isActive ? 'text-white' : '')}>
                  {pageNumber}
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={handleNext}
          disabled={!canScrollNext}
          className={cn(
            'flex h-8 w-8 items-center justify-center',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'transition-opacity hover:opacity-80'
          )}
          aria-label={t('next-page')}
        >
          <ArrowRight className='h-6 w-6' />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
```

**Step 2: Simplify BlogPagination to thin wrapper**

```typescript
// src/components/_shared/BlogPagination.tsx
import { BLOG_QUERY_PARAMS } from '@/constants/blog';

import Pagination from '@/components/_shared/Pagination';

interface BlogPaginationProps {
  totalPages: number;
  currentPage: number;
}

const BlogPagination = ({ totalPages, currentPage }: BlogPaginationProps) => {
  return (
    <Pagination
      totalPages={totalPages}
      currentPage={currentPage}
      pageParam={BLOG_QUERY_PARAMS.PAGE}
    />
  );
};

export default BlogPagination;
```

**Step 3: Simplify ReferencesPagination to thin wrapper**

```typescript
// src/components/_shared/ReferencesPagination.tsx
import { REFERENCES_QUERY_PARAMS } from '@/constants/references';

import Pagination from '@/components/_shared/Pagination';

interface ReferencesPaginationProps {
  totalPages: number;
  currentPage: number;
}

const ReferencesPagination = ({ totalPages, currentPage }: ReferencesPaginationProps) => {
  return (
    <Pagination
      totalPages={totalPages}
      currentPage={currentPage}
      pageParam={REFERENCES_QUERY_PARAMS.PAGE}
    />
  );
};

export default ReferencesPagination;
```

**Step 4: Run lint and build**

Run: `npm run lint && npm run build`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/_shared/Pagination.tsx src/components/_shared/BlogPagination.tsx src/components/_shared/ReferencesPagination.tsx
git commit -m "refactor: extract generic Pagination component

- Create reusable Pagination component with pageParam prop
- Simplify BlogPagination and ReferencesPagination to thin wrappers
- Eliminates ~300 lines of duplicated code"
```

---

### Task 1.3: Consolidate Date Formatting Functions

**Files:**
- Modify: `src/utils/helper.ts` (lines 300-340)

**Step 1: Consolidate formatFarewellDate and formatSimpleDate**

In `src/utils/helper.ts`, replace both functions with single implementation:

```typescript
/**
 * Formats date to Czech format: "D. M. YYYY"
 * @param dateString - ISO date string or Date object
 * @returns Formatted date string or empty string if invalid
 */
export function formatCzechDate(dateString: string | Date | null | undefined): string {
  if (!dateString) return '';

  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    if (Number.isNaN(date.getTime())) return '';

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${day}. ${month}. ${year}`;
  } catch {
    return '';
  }
}

// Keep backwards compatibility aliases
export const formatFarewellDate = formatCzechDate;
export const formatSimpleDate = formatCzechDate;
```

**Step 2: Run lint and build**

Run: `npm run lint && npm run build`
Expected: PASS

**Step 3: Commit**

```bash
git add src/utils/helper.ts
git commit -m "refactor: consolidate duplicate date formatting functions

- Create single formatCzechDate function
- Add backwards-compatible aliases for existing usages"
```

---

## Phase 2: Performance Optimizations (High Priority)

### Task 2.1: Fix checkSlugType Double Call

**Files:**
- Modify: `app/[locale]/[slug]/page.tsx`

**Step 1: Cache checkSlugType result using React cache**

```typescript
// At top of app/[locale]/[slug]/page.tsx, add:
import { cache } from 'react';

// Wrap checkSlugType with React cache
const getCachedSlugType = cache(async (slug: string) => {
  return checkSlugType(slug);
});

// Then replace all calls to checkSlugType(slug) with getCachedSlugType(slug)
```

**Step 2: Update generateMetadata to use cached function**

```typescript
export async function generateMetadata({ params }: SlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const slugType = await getCachedSlugType(slug);
  // ... rest of function
}
```

**Step 3: Update page component to use cached function**

```typescript
const SlugPage = async ({ params }: SlugPageProps) => {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  const slugType = await getCachedSlugType(slug);
  // ... rest of component
}
```

**Step 4: Run build**

Run: `npm run build`
Expected: PASS

**Step 5: Commit**

```bash
git add app/[locale]/[slug]/page.tsx
git commit -m "perf: cache checkSlugType to prevent duplicate API calls

- Use React cache() to deduplicate checkSlugType calls
- Reduces GraphQL queries per page render from 2 to 1"
```

---

### Task 2.2: Add Memoization to Image Hooks

**Files:**
- Modify: `src/hooks/useImageZoom.ts`
- Modify: `src/hooks/useImagePan.ts`

**Step 1: Add useCallback to useImageZoom**

```typescript
// src/hooks/useImageZoom.ts
import { useCallback, useState } from 'react';

import { IMAGE_GALLERY_CONFIG } from '@/utils/imageGalleryNavigation';

export const useImageZoom = () => {
  const [scale, setScale] = useState(1);

  const setScaleClamped = useCallback((newScale: number) => {
    setScale(Math.min(Math.max(newScale, IMAGE_GALLERY_CONFIG.MIN_ZOOM), IMAGE_GALLERY_CONFIG.MAX_ZOOM));
  }, []);

  const resetZoom = useCallback(() => {
    setScale(1);
  }, []);

  const handleWheel = useCallback(
    (event: React.WheelEvent) => {
      event.preventDefault();
      const delta = event.deltaY > 0 ? -IMAGE_GALLERY_CONFIG.ZOOM_STEP : IMAGE_GALLERY_CONFIG.ZOOM_STEP;
      setScaleClamped(scale + delta);
    },
    [scale, setScaleClamped]
  );

  const handleDoubleClick = useCallback(() => {
    if (scale > 1) {
      resetZoom();
    } else {
      setScaleClamped(IMAGE_GALLERY_CONFIG.DOUBLE_CLICK_ZOOM);
    }
  }, [scale, resetZoom, setScaleClamped]);

  return {
    scale,
    setScale: setScaleClamped,
    resetZoom,
    handleWheel,
    handleDoubleClick,
  };
};
```

**Step 2: Add useCallback to useImagePan**

```typescript
// src/hooks/useImagePan.ts
import { useCallback, useState } from 'react';

interface Position {
  x: number;
  y: number;
}

export const useImagePan = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [startPosition, setStartPosition] = useState<Position>({ x: 0, y: 0 });

  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    setIsDragging(true);
    setStartPosition({
      x: event.clientX - position.x,
      y: event.clientY - position.y,
    });
  }, [position]);

  const handleMouseMove = useCallback(
    (event: React.MouseEvent) => {
      if (!isDragging) return;
      setPosition({
        x: event.clientX - startPosition.x,
        y: event.clientY - startPosition.y,
      });
    },
    [isDragging, startPosition]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const resetPosition = useCallback(() => {
    setPosition({ x: 0, y: 0 });
  }, []);

  const getCursor = useCallback(
    (scale: number) => {
      if (scale <= 1) return 'default';
      return isDragging ? 'grabbing' : 'grab';
    },
    [isDragging]
  );

  return {
    position,
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    resetPosition,
    getCursor,
  };
};
```

**Step 3: Run lint and build**

Run: `npm run lint && npm run build`
Expected: PASS

**Step 4: Commit**

```bash
git add src/hooks/useImageZoom.ts src/hooks/useImagePan.ts
git commit -m "perf: add useCallback memoization to image hooks

- Memoize handlers in useImageZoom and useImagePan
- Prevents unnecessary re-renders in ImageLightbox component"
```

---

### Task 2.3: Fix useMouseActivity Memory Leak

**Files:**
- Modify: `src/hooks/useMouseActivity.ts`

**Step 1: Fix event listener recreation issue**

```typescript
// src/hooks/useMouseActivity.ts
'use client';

import { useEffect, useState, useCallback } from 'react';

export const useMouseActivity = () => {
  const [hasMouseActivity, setHasMouseActivity] = useState(false);

  const handleMouseActivity = useCallback(() => {
    setHasMouseActivity(true);
  }, []);

  useEffect(() => {
    // Only add listeners if we haven't detected activity yet
    if (hasMouseActivity) return;

    const options = { once: true };
    document.addEventListener('mousemove', handleMouseActivity, options);
    document.addEventListener('touchstart', handleMouseActivity, options);

    return () => {
      document.removeEventListener('mousemove', handleMouseActivity);
      document.removeEventListener('touchstart', handleMouseActivity);
    };
  }, [hasMouseActivity, handleMouseActivity]);

  return hasMouseActivity;
};
```

**Step 2: Run lint and build**

Run: `npm run lint && npm run build`
Expected: PASS

**Step 3: Commit**

```bash
git add src/hooks/useMouseActivity.ts
git commit -m "fix: prevent memory leak in useMouseActivity hook

- Add guard to prevent listener recreation after activity detected
- Add useCallback memoization for handler"
```

---

## Phase 3: API Layer Improvements (Medium Priority)

### Task 3.1: Create GraphQL Fetch Wrapper with Better Error Handling

**Files:**
- Create: `src/api/graphql-client.ts`
- Modify: `src/api/wordpress-api.ts` (gradually migrate functions)

**Step 1: Create GraphQL client wrapper**

```typescript
// src/api/graphql-client.ts
interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

interface FetchOptions {
  revalidate?: number;
  tags?: string[];
}

const GRAPHQL_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'https://pegas.antstudio.dev/cz/graphql';

export class GraphQLError extends Error {
  constructor(
    message: string,
    public errors?: Array<{ message: string }>
  ) {
    super(message);
    this.name = 'GraphQLError';
  }
}

export async function graphqlFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
  options: FetchOptions = {}
): Promise<T> {
  const { revalidate = 3600, tags = ['wordpress'] } = options;

  const response = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
    next: { tags, revalidate },
  });

  if (!response.ok) {
    throw new GraphQLError(`HTTP error: ${response.status}`);
  }

  const result: GraphQLResponse<T> = await response.json();

  if (result.errors?.length) {
    console.error('GraphQL errors:', result.errors);
    throw new GraphQLError('GraphQL query failed', result.errors);
  }

  if (!result.data) {
    throw new GraphQLError('No data returned from GraphQL');
  }

  return result.data;
}

// Safe wrapper that returns null on error (for backwards compatibility)
export async function graphqlFetchSafe<T>(
  query: string,
  variables?: Record<string, unknown>,
  options: FetchOptions = {}
): Promise<T | null> {
  try {
    return await graphqlFetch<T>(query, variables, options);
  } catch (error) {
    console.error('GraphQL fetch error:', error);
    return null;
  }
}
```

**Step 2: Run build**

Run: `npm run build`
Expected: PASS

**Step 3: Commit**

```bash
git add src/api/graphql-client.ts
git commit -m "feat: add GraphQL client wrapper with typed error handling

- Create graphqlFetch with proper error throwing
- Create graphqlFetchSafe for backwards-compatible null returns
- Centralize fetch configuration"
```

---

### Task 3.2: Add Server-Side Pagination to WordPress API

**Files:**
- Modify: `src/api/wordpress-api.ts` (getReferencePosts and getBlogPosts)

**Step 1: Update getReferencePosts to use GraphQL offset pagination**

```typescript
// In src/api/wordpress-api.ts, update getReferencePosts function
// Change the query to use WordPress offset pagination instead of fetching all 1000

export async function getReferencePosts(referencesPerPage = 9, page = 1, categoryId?: string, search?: string) {
  const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'https://pegas.antstudio.dev/cz/graphql';

  const offset = (page - 1) * referencesPerPage;

  // Build where clause for server-side filtering
  const whereConditions: string[] = [];
  if (categoryId) {
    whereConditions.push(`taxQuery: { taxArray: [{ taxonomy: TYPREFERENCE, terms: ["${categoryId}"], field: DATABASE_ID }] }`);
  }
  if (search) {
    whereConditions.push(`search: "${search}"`);
  }

  const whereClause = whereConditions.length > 0
    ? `where: { ${whereConditions.join(', ')} }`
    : '';

  const query = `
    query GetReferencePosts($first: Int!, $offset: Int!) {
      referencePosts(first: $first, ${whereClause}, after: null) {
        pageInfo {
          hasNextPage
          hasPreviousPage
          total
        }
        nodes {
          id
          databaseId
          title
          slug
          date
          featuredImage {
            node {
              sourceUrl
              altText
              mediaDetails {
                width
                height
              }
            }
          }
          referenceACF {
            farewellDate
            farewellPlace
            introImage {
              node {
                sourceUrl
                altText
              }
            }
          }
          typReference {
            nodes {
              id
              databaseId
              name
              slug
            }
          }
        }
      }
    }
  `;

  // ... rest of implementation
}
```

**Note:** This task requires testing against the actual WordPress GraphQL API to verify pagination support. The exact query syntax depends on the WPGraphQL configuration.

**Step 2: Test with actual API**

Run: `npm run dev`
Expected: Verify pagination works correctly

**Step 3: Commit**

```bash
git add src/api/wordpress-api.ts
git commit -m "perf: implement server-side pagination for references

- Use GraphQL offset pagination instead of client-side slicing
- Reduces payload size significantly for paginated views"
```

---

## Phase 4: Code Organization (Medium Priority)

### Task 4.1: Split helper.ts into Domain Files

**Files:**
- Create: `src/utils/html-helpers.ts`
- Create: `src/utils/date-helpers.ts`
- Create: `src/utils/formatting-helpers.ts`
- Modify: `src/utils/helper.ts` (re-export from new files)

**Step 1: Create html-helpers.ts**

```typescript
// src/utils/html-helpers.ts
/**
 * HTML and text processing utilities
 */

/**
 * Removes HTML tags from string
 */
export function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

/**
 * Truncates text to specified length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Decodes HTML entities (client-side only)
 */
export function decodeHtmlEntities(text: string): string {
  if (typeof document === 'undefined') return text;
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}

/**
 * Decodes HTML entities (server-side safe)
 */
export function decodeHtmlEntitiesServer(text: string): string {
  const entities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#039;': "'",
    '&apos;': "'",
    '&nbsp;': ' ',
    '&#8211;': '-',
    '&#8212;': '--',
    '&#8216;': "'",
    '&#8217;': "'",
    '&#8220;': '"',
    '&#8221;': '"',
  };

  let result = text;
  for (const [entity, char] of Object.entries(entities)) {
    result = result.replace(new RegExp(entity, 'g'), char);
  }
  return result;
}
```

**Step 2: Create date-helpers.ts**

```typescript
// src/utils/date-helpers.ts
/**
 * Date formatting utilities
 */

import { format, isValid, parseISO } from 'date-fns';
import { cs } from 'date-fns/locale';

/**
 * Formats date to Czech format: "D. M. YYYY"
 */
export function formatCzechDate(dateString: string | Date | null | undefined): string {
  if (!dateString) return '';

  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    if (Number.isNaN(date.getTime())) return '';

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${day}. ${month}. ${year}`;
  } catch {
    return '';
  }
}

// Backwards compatibility aliases
export const formatFarewellDate = formatCzechDate;
export const formatSimpleDate = formatCzechDate;

/**
 * Formats date with time for blog posts
 */
export function formatBlogDate(dateString: string): string {
  if (!dateString) return '';

  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return '';
    return format(date, 'd. MMMM yyyy, HH:mm', { locale: cs });
  } catch {
    return '';
  }
}

/**
 * Formats farewell date with time
 */
export function formatFarewellDateTime(dateTimeString: string | undefined): string {
  if (!dateTimeString) return '';

  try {
    const date = new Date(dateTimeString);
    if (Number.isNaN(date.getTime())) return '';

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day}. ${month}. ${year} v ${hours}:${minutes}`;
  } catch {
    return '';
  }
}

/**
 * Formats date range for branch closures
 */
export function formatDateRange(
  fromDateString: string | undefined,
  toDateString: string | undefined
): string {
  if (!fromDateString || !toDateString) return '';

  const from = formatCzechDate(fromDateString);
  const to = formatCzechDate(toDateString);

  if (!from || !to) return '';
  return `${from} - ${to}`;
}

/**
 * Checks if date string is valid expiry date
 */
export function isValidExpiryDate(dateString: string | undefined): boolean {
  if (!dateString) return false;
  const date = new Date(dateString);
  return !Number.isNaN(date.getTime());
}

/**
 * Checks if offer/closure has expired
 */
export function isOfferExpired(expiryDateString: string | undefined): boolean {
  if (!expiryDateString) return true;
  const expiryDate = new Date(expiryDateString);
  const now = new Date();
  return expiryDate < now;
}
```

**Step 3: Update helper.ts to re-export**

```typescript
// src/utils/helper.ts
// Re-export from domain files for backwards compatibility
export * from '@/utils/html-helpers';
export * from '@/utils/date-helpers';
export * from '@/utils/formatting-helpers';

// Keep only functions that don't fit other categories
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// ... other utility functions that don't belong to specific domains
```

**Step 4: Run lint and build**

Run: `npm run lint && npm run build`
Expected: PASS

**Step 5: Commit**

```bash
git add src/utils/html-helpers.ts src/utils/date-helpers.ts src/utils/formatting-helpers.ts src/utils/helper.ts
git commit -m "refactor: split helper.ts into domain-specific files

- Create html-helpers.ts for HTML/text processing
- Create date-helpers.ts for date formatting
- Create formatting-helpers.ts for number/text formatting
- Re-export from helper.ts for backwards compatibility"
```

---

## Phase 5: Component Refactoring (Lower Priority)

### Task 5.1: Split DynamicContentSection into Smaller Components

**Files:**
- Create: `src/components/_shared/dynamic-content/WysiwygSection.tsx`
- Create: `src/components/_shared/dynamic-content/MediaSection.tsx`
- Create: `src/components/_shared/dynamic-content/GallerySection.tsx`
- Create: `src/components/_shared/dynamic-content/ImageBoxesSection.tsx`
- Create: `src/components/_shared/dynamic-content/ImageSliderSection.tsx`
- Create: `src/components/_shared/dynamic-content/ButtonSection.tsx`
- Create: `src/components/_shared/dynamic-content/index.ts`
- Modify: `src/components/_shared/DynamicContentSection.tsx`

**Note:** This is a larger refactoring task. Each step should be done incrementally:

1. Extract one component type at a time
2. Test after each extraction
3. Update imports in parent component
4. Commit after each successful extraction

**Step 1: Create directory structure**

```bash
mkdir -p src/components/_shared/dynamic-content
```

**Step 2: Extract WysiwygSection first (simplest)**

```typescript
// src/components/_shared/dynamic-content/WysiwygSection.tsx
import FormattedText from '@/components/_shared/FormattedText';

interface WysiwygSectionProps {
  editor: string;
}

const WysiwygSection = ({ editor }: WysiwygSectionProps) => {
  return <FormattedText content={editor} />;
};

export default WysiwygSection;
```

**Step 3-7: Extract remaining components following same pattern**

**Step 8: Create barrel export**

```typescript
// src/components/_shared/dynamic-content/index.ts
export { default as WysiwygSection } from './WysiwygSection';
export { default as MediaSection } from './MediaSection';
export { default as GallerySection } from './GallerySection';
export { default as ImageBoxesSection } from './ImageBoxesSection';
export { default as ImageSliderSection } from './ImageSliderSection';
export { default as ButtonSection } from './ButtonSection';
```

**Step 9: Update DynamicContentSection to use new components**

**Step 10: Run lint and build**

Run: `npm run lint && npm run build`
Expected: PASS

**Step 11: Commit**

```bash
git add src/components/_shared/dynamic-content/
git add src/components/_shared/DynamicContentSection.tsx
git commit -m "refactor: split DynamicContentSection into smaller components

- Extract each component type to separate file
- Reduces main file from 599 lines to ~100 lines
- Improves maintainability and testability"
```

---

## Phase 6: Type Safety Improvements (Lower Priority)

### Task 6.1: Add Missing Component Types to wordpress-types.ts

**Files:**
- Modify: `src/utils/wordpress-types.ts`

**Step 1: Add missing component interfaces**

```typescript
// Add to src/utils/wordpress-types.ts

export interface ImageBoxComponent {
  fieldGroupName: 'ComponentsComponentsImageBoxesLayout';
  imageBoxes: Array<{
    boxHeadline: string;
    boxDescription: string;
    imageBox: {
      node: MediaItem;
    };
  }>;
}

export interface ImageSliderComponent {
  fieldGroupName: 'ComponentsComponentsImageSliderLayout';
  imageSlider: {
    nodes: MediaItem[];
  };
}

export interface ButtonComponent {
  fieldGroupName: 'ComponentsComponentsButtonLayout';
  button: {
    target: string;
    title: string;
    url: string;
  };
}

// Update BlogComponent union to include all types
export type BlogComponent =
  | WysiwygComponent
  | MediaComponent
  | GalleryComponent
  | ImageBoxComponent
  | ImageSliderComponent
  | ButtonComponent;
```

**Step 2: Run build to verify type compatibility**

Run: `npm run build`
Expected: PASS (may surface type errors that need fixing)

**Step 3: Commit**

```bash
git add src/utils/wordpress-types.ts
git commit -m "types: add missing component interfaces to wordpress-types

- Add ImageBoxComponent, ImageSliderComponent, ButtonComponent
- Update BlogComponent union to include all ACF component types"
```

---

## Verification Checklist

After completing all tasks, run the following verification steps:

1. **Lint Check:**
   ```bash
   npm run lint
   ```
   Expected: No errors

2. **Build Check:**
   ```bash
   npm run build
   ```
   Expected: Build succeeds without errors

3. **Manual Testing:**
   - [ ] Homepage loads correctly
   - [ ] Blog pagination works
   - [ ] References pagination works
   - [ ] Dynamic slug pages load (blog posts, services, references, branches)
   - [ ] Search functionality works
   - [ ] Image lightbox works (zoom, pan)
   - [ ] Contact form works

4. **Performance Verification:**
   - [ ] Check Network tab for reduced API calls on [slug] pages
   - [ ] Verify React DevTools shows memoization working

---

## Summary of Changes

| Phase | Task | Lines Saved | Impact |
|-------|------|-------------|--------|
| 1.1 | Consolidate pagination helpers | ~55 | DRY |
| 1.2 | Generic Pagination component | ~300 | DRY |
| 1.3 | Consolidate date functions | ~40 | DRY |
| 2.1 | Cache checkSlugType | 0 | Performance (1 API call saved) |
| 2.2 | Memoize image hooks | 0 | Performance |
| 2.3 | Fix useMouseActivity | 0 | Memory leak fix |
| 3.1 | GraphQL client wrapper | +80 | Code quality |
| 3.2 | Server-side pagination | ~100 | Performance (payload reduction) |
| 4.1 | Split helper.ts | 0 | Organization |
| 5.1 | Split DynamicContentSection | ~500 | Maintainability |
| 6.1 | Add missing types | +30 | Type safety |

**Total estimated improvement:** ~400 lines removed, better performance, improved maintainability.
