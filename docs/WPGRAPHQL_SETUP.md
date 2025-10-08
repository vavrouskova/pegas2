# WPGraphQL s Native Fetch API - Návod k použití

Tento projekt používá WordPress GraphQL API s nativním `fetch()` API pro data fetching.

## 🔗 Endpoint

GraphQL endpoint: `https://pegas.antstudio.dev/cz/graphql`

**Poznámka:** Endpoint obsahuje `/cz/` pro českou lokalizaci.

## 📁 Struktura souborů

### API Functions

- **`src/api/wordpress-api.ts`** - Funkce pro načítání dat z WordPressu

### Types

- **`src/utils/wordpress-types.ts`** - TypeScript typy pro WordPress GraphQL data

### Components

- **`src/components/_shared/ReferencesCarouselSection.tsx`** - Carousel komponenta pro zobrazení vybraných reference postů

## 🚀 Jak používat WordPress GraphQL API

### Server Components (doporučeno)

Pro Next.js App Router používáme Server Components s async/await:

```tsx
// app/[locale]/page.tsx
import { getHomepageWithSelectedPosts } from '@/api/wordpress-api';
import ReferencesCarouselSection from '@/components/_shared/ReferencesCarouselSection';

const Homepage = async () => {
  // Načtení vybraných reference postů z Homepage ACF
  let referencePosts = [];
  try {
    const homepageData = await getHomepageWithSelectedPosts();
    if (homepageData.homepageACF?.selectedPosts?.nodes) {
      referencePosts = homepageData.homepageACF.selectedPosts.nodes;
    }
  } catch (error) {
    console.error('Chyba při načítání dat:', error);
  }

  return (
    <main>
      <ReferencesCarouselSection referencePosts={referencePosts} />
    </main>
  );
};

export default Homepage;
```

### Vytvoření nové API funkce

```tsx
// src/api/wordpress-api.ts

export async function getPages(first = 10) {
  const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'https://pegas.antstudio.dev/cz/graphql';

  const query = `
    query GetPages($first: Int!) {
      pages(first: $first) {
        nodes {
          id
          title
          slug
          content
          date
        }
      }
    }
  `;

  try {
    const response = await fetch(graphqlUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { first },
      }),
      // Next.js ISR - revalidate každou hodinu
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      throw new Error('GraphQL query failed');
    }

    return result.data.pages;
  } catch (error) {
    console.error('Error fetching pages:', error);
    throw error;
  }
}
```

### TypeScript typy

```tsx
// src/utils/wordpress-types.ts

export interface MediaItem {
  id: string;
  sourceUrl: string;
  altText: string;
  mediaDetails: {
    width: number;
    height: number;
  };
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  date: string;
  featuredImage?: {
    node: MediaItem;
  };
}

export interface PagesResponse {
  pages: {
    nodes: Page[];
  };
}
```

## ⚙️ Nastavení environment proměnných

V `.env` souboru:

```env
# WordPress GraphQL API Configuration
NEXT_PUBLIC_GRAPHQL_URL=https://pegas.antstudio.dev/cz/graphql
```

**DŮLEŽITÉ:** Po změně `.env` souboru restartujte dev server!

## 🔍 Testování GraphQL dotazů

### 1. Pomocí curl

```bash
curl -X POST https://pegas.antstudio.dev/cz/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { referencePosts(first: 5) { nodes { id title } } }"
  }' | jq '.'
```

### 2. WPGraphQL IDE

WPGraphQL poskytuje GraphiQL rozhraní v WordPress adminu:

- URL: `https://pegas.antstudio.dev/wp-admin` → GraphQL IDE

### 3. GraphQL Introspection

Pro zjištění dostupných polí:

```bash
curl -X POST https://pegas.antstudio.dev/cz/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ __type(name: \"ReferencePost\") { fields { name type { name } } } }"}' \
  | jq '.'
```

## 📊 Dostupné custom post types

### Reference Posts

```graphql
query GetReferencePosts {
  referencePosts(first: 10) {
    nodes {
      id
      databaseId
      title
      slug
      link
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
    }
  }
}
```

## 🎯 Výhody tohoto přístupu

### ✅ Oproti Apollo Client:

1. **Zero dependencies** - žádné extra knihovny
2. **Perfektní integrace s Next.js** - Server Components, ISR
3. **Menší bundle size** - žádný overhead
4. **Jednodušší** - méně boilerplate kódu
5. **Next.js features** - `next: { revalidate }` pro ISR

### 📦 Bundle Size Comparison:

```
Apollo Client:  ~500KB (minified)
Native Fetch:   0KB (built-in browser API)
```

## 🔄 Revalidace dat (ISR)

Next.js Incremental Static Regeneration:

```typescript
// Revalidace každou hodinu (3600 sekund)
next: {
  revalidate: 3600;
}

// Revalidace každých 5 minut
next: {
  revalidate: 300;
}

// Žádná cache (vždy fresh data)
cache: 'no-store';
```

## 🐛 Error Handling

```tsx
export async function getReferencePosts(first = 10) {
  try {
    const response = await fetch(graphqlUrl, {
      method: 'POST',
      body: JSON.stringify({ query, variables }),
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // GraphQL chyby
    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      throw new Error('GraphQL query failed');
    }

    // Ověření dat
    if (!result.data?.referencePosts) {
      throw new Error('No data returned');
    }

    return result.data.referencePosts;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error; // nebo return fallback data
  }
}
```

## 📚 Užitečné odkazy

- [WPGraphQL dokumentace](https://www.wpgraphql.com/)
- [GraphQL dokumentace](https://graphql.org/)
- [Next.js Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [Next.js ISR](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating)

## 📝 Poznámky

- **Server Components** jsou výchozí v Next.js App Router
- Pro client-side fetching použijte `useEffect` nebo TanStack Query
- GraphQL queries jsou inline v funkcích (ne v separátních souborech)
- Typy jsou definované v `wordpress-types.ts`
