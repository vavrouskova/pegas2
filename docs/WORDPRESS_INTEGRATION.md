# WordPress GraphQL Integration - Přehled

Tento dokument obsahuje přehled integrace WordPress GraphQL API v projektu Pegas.

## 🏗️ Architektura

```
┌─────────────────────────────────────────────────────┐
│  Next.js App (Next.js 15 + App Router)             │
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │  Server Components                           │  │
│  │  - app/[locale]/page.tsx                     │  │
│  │  - Async/await data fetching                 │  │
│  └──────────────────────────────────────────────┘  │
│                       │                             │
│                       ▼                             │
│  ┌──────────────────────────────────────────────┐  │
│  │  API Layer                                   │  │
│  │  - src/api/wordpress-api.ts                  │  │
│  │  - Native fetch() API                        │  │
│  │  - TypeScript functions                      │  │
│  └──────────────────────────────────────────────┘  │
│                       │                             │
│                       ▼                             │
│  ┌──────────────────────────────────────────────┐  │
│  │  Types                                       │  │
│  │  - src/utils/wordpress-types.ts              │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │  WordPress GraphQL API       │
        │  wp.pohrebpegas.cz/cz/     │
        │  /graphql                    │
        └──────────────────────────────┘
```

## 📁 Struktura souborů

```
src/
├── api/
│   └── wordpress-api.ts              # API funkce (getHomepageWithSelectedPosts)
├── components/
│   └── _shared/
│       └── ReferencesCarouselSection.tsx  # Carousel komponenta
└── utils/
    └── wordpress-types.ts            # TypeScript typy

app/
└── [locale]/
    └── page.tsx                      # Homepage (používá API)
```

## 🚀 Aktuálně implementováno

### Homepage Reference Posts (ACF)

**Endpoint:** `getHomepageWithSelectedPosts()`

**Použití:**

```tsx
// app/[locale]/page.tsx
const Homepage = async () => {
  const homepageData = await getHomepageWithSelectedPosts();
  const referencePosts = homepageData.homepageACF?.selectedPosts?.nodes || [];
  return <ReferencesCarouselSection referencePosts={referencePosts} />;
};
```

**Funkce:**

- ✅ Načítání vybraných reference postů z Homepage ACF (ID: 5)
- ✅ ACF pole `selectedPosts` - admin může vybrat konkrétní posty
- ✅ Zobrazení featured obrázků
- ✅ Datum a čas rozloučení (`farewellDate`) - formátováno do češtiny
- ✅ Místo konání (`farewellPlace`)
- ✅ Carousel s navigací
- ✅ Responsivní design
- ✅ Hover efekty
- ✅ Fallback data pokud nejsou vybrány žádné posty

## 🛠️ Technologie

| Komponenta           | Technologie               | Proč                           |
| -------------------- | ------------------------- | ------------------------------ |
| **Data fetching**    | Native `fetch()`          | Zero dependencies, Next.js ISR |
| **Type safety**      | TypeScript interfaces     | Type-safe API calls            |
| **Server rendering** | Next.js Server Components | SEO, performance               |
| **Revalidation**     | ISR (3600s)               | Fresh data bez build           |
| **Styling**          | Tailwind CSS              | Utility-first CSS              |
| **Images**           | Next.js Image             | Optimalizace, lazy loading     |

## 📊 Výhody tohoto řešení

### ✅ Oproti Apollo Client:

```
Bundle size:     0KB vs ~500KB
Setup:           Jednoduchý vs Komplexní
Server Components: ✅ Nativní vs ⚠️ Komplikované
ISR:             ✅ Built-in vs ❌ Custom
Dependencies:    0 vs 2+
Learning curve:  Nízká vs Střední
```

### ✅ Next.js optimalizace:

- **ISR**: Automatická revalidace každou hodinu
- **Server-side**: SEO-friendly, rychlé načítání
- **Image optimization**: Automatické WebP, lazy loading
- **TypeScript**: Plná type safety

## 📚 Dokumentace

| Dokument                            | Popis                              |
| ----------------------------------- | ---------------------------------- |
| **WPGRAPHQL_SETUP.md**              | Návod k použití, příklady kódu     |
| **GRAPHQL_INTROSPECTION.md**        | Kompletní GraphQL schema reference |
| **graphql-schema.json**             | Raw schema (1.2 MB)                |
| **graphql-operations-summary.json** | Přehled queries/mutations          |

## 🔧 Environment proměnné

```env
# .env
NEXT_PUBLIC_GRAPHQL_URL=https://wp.pohrebpegas.cz/cz/graphql
```

**Poznámka:** Po změně `.env` vždy restartujte dev server!

## 🎯 Další možná rozšíření

### 1. Blog posty

```typescript
export async function getBlogPosts(first = 10) {
  // Implementace similar to getReferencePosts
}
```

### 2. Služby (sluzbyPosts)

```typescript
export async function getServices(first = 10) {
  // Custom post type sluzbyPosts
}
```

### 3. Stránky

```typescript
export async function getPageBySlug(slug: string) {
  // Detail stránky
}
```

### 4. Menu

```typescript
export async function getMenu(location: string) {
  // WordPress menu
}
```

## 🐛 Debugging

### Test GraphQL dotazu

```bash
# Test reference postů
curl -X POST https://wp.pohrebpegas.cz/cz/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ referencePosts(first: 5) { nodes { id title } } }"}' \
  | jq '.'
```

### Introspection

```bash
# Zjistit dostupná pole
curl -X POST https://wp.pohrebpegas.cz/cz/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ __type(name: \"ReferencePost\") { fields { name } } }"}' \
  | jq '.'
```

## 🔗 Užitečné odkazy

- [Next.js Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [WPGraphQL Docs](https://www.wpgraphql.com/)
- [GraphQL Docs](https://graphql.org/)

## 📝 Changelog

### 2025-10-08

- ✅ Implementace Homepage ACF s vybraným reference posty
- ✅ Integrace ReferencesCarouselSection s WordPress daty
- ✅ Podpora ACF polí: farewellDate, farewellPlace, description
- ✅ Fix časových zón (UTC → lokální čas)
- ✅ Odstranění ReferencePostsSection (nahrazena carousel řešením)
- ✅ Přejmenování OrganizedCarouselSection → ReferencesCarouselSection

### 2025-01-08

- ✅ Přechod z Apollo Client na Native Fetch
- ✅ Odstranění ~500KB dependencies
- ✅ Implementace Reference Posts
- ✅ Aktualizace dokumentace

### 2025-10-07

- 📝 Initial WordPress GraphQL setup
- 📝 Apollo Client konfigurace (později odstraněno)

---

**Status:** ✅ Aktivní a funkční  
**Maintenance:** Minimální (zero dependencies)  
**Performance:** ⚡ Optimální (SSR + ISR)
