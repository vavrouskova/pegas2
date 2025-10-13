# SEO Data Integration Guide

Tento dokument popisuje, jak používat univerzální SEO modul využívající GraphQL API pro načítání SEO dat z WordPressu (Yoast SEO).

## Přehled

Modul `src/utils/seo.ts` poskytuje univerzální funkcionalitu pro načítání SEO dat z WordPress GraphQL API a jejich konverzi do Next.js Metadata formátu. Podporuje různé typy obsahu (Page, Post, Custom Post Types) a různé způsoby identifikace obsahu.

## Základní použití

### 1. Homepage SEO (pomocí Database ID)

```typescript
// app/[locale]/page.tsx
import { getSeoDataById } from '@/utils/seo';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return getSeoDataById('page', 5); // Homepage má database ID = 5
}

export default function HomePage() {
  // ... komponenta
}
```

### 2. Dynamická stránka (pomocí Slug)

```typescript
// app/[locale]/blog/[slug]/page.tsx
import { getSeoDataBySlug } from '@/utils/seo';
import type { Metadata } from 'next';

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return getSeoDataBySlug('post', params.slug);
}

export default function BlogPost({ params }: PageProps) {
  // ... komponenta
}
```

### 3. Custom Post Type (Reference)

```typescript
// app/[locale]/reference/[slug]/page.tsx
import { getSeoDataBySlug } from '@/utils/seo';
import type { Metadata } from 'next';

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return getSeoDataBySlug('referencePost', params.slug);
}

export default function ReferencePage({ params }: PageProps) {
  // ... komponenta
}
```

### 4. Pokročilé použití s vlastní revalidací

```typescript
// app/[locale]/sluzby/[slug]/page.tsx
import { getSeoDataBySlug } from '@/utils/seo';
import type { Metadata } from 'next';

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // Custom revalidace - 1 hodina místo defaultních 24 hodin
  return getSeoDataBySlug('sluzbyPost', params.slug, 3600);
}

export default function SluzbyPage({ params }: PageProps) {
  // ... komponenta
}
```

## Dostupné funkce

### `getSeoData(options)`

Hlavní univerzální funkce pro načítání SEO dat.

```typescript
interface GetSeoDataOptions {
  contentType: 'page' | 'post' | 'referencePost' | 'sluzbyPost' | 'pobockaPost';
  id: string | number;
  idType?: 'DATABASE_ID' | 'SLUG' | 'URI';
  revalidate?: number; // v sekundách, default: 86400 (24 hodin)
}

const metadata = await getSeoData({
  contentType: 'page',
  id: 5,
  idType: 'DATABASE_ID',
  revalidate: 3600,
});
```

### `getSeoDataById(contentType, id, revalidate?)`

Helper funkce pro načítání podle Database ID.

```typescript
const metadata = await getSeoDataById('page', 5);
// s custom revalidací
const metadata = await getSeoDataById('post', 123, 3600);
```

### `getSeoDataBySlug(contentType, slug, revalidate?)`

Helper funkce pro načítání podle slug.

```typescript
const metadata = await getSeoDataBySlug('post', 'muj-clanek');
// s custom revalidací
const metadata = await getSeoDataBySlug('referencePost', 'moje-reference', 7200);
```

### `getSeoDataByUri(contentType, uri, revalidate?)`

Helper funkce pro načítání podle URI.

```typescript
const metadata = await getSeoDataByUri('page', '/o-nas');
```

## Podporované typy obsahu

- `page` - WordPress stránky
- `post` - WordPress příspěvky (blog)
- `referencePost` - Custom Post Type: Reference
- `sluzbyPost` - Custom Post Type: Služby
- `pobockaPost` - Custom Post Type: Pobočky

## Návratová hodnota

Funkce vrací Next.js `Metadata` objekt, který obsahuje:

- `title` - Název stránky
- `description` - Meta popis
- `robots` - Robots direktivy (index/noindex, follow/nofollow)
- `canonical` - Kanonická URL
- `openGraph` - Open Graph metadata pro social media
- `twitter` - Twitter Card metadata
- `authors` - Informace o autorech
- `applicationName` - Název aplikace
- `icons` - Favicon

## Fallback metadata

Pokud se nepodaří načíst SEO data z WordPress API (např. při výpadku), funkce automaticky vrátí výchozí metadata s `noindex` a `nofollow` direktivami, aby se zabránilo indexování stránek s chybějícími daty.

## Environment proměnné

Ujistěte se, že máte nastavené následující environment proměnné:

```env
NEXT_PUBLIC_GRAPHQL_URL=https://your-wordpress-site.com/graphql
NEXT_PUBLIC_APP_NAME=Pegas
```

## Příklad kompletní implementace

```typescript
// app/[locale]/blog/[slug]/page.tsx
import { getSeoDataBySlug } from '@/utils/seo';
import { getBlogPost } from '@/api/wordpress-api';
import type { Metadata } from 'next';

interface PageProps {
  params: { slug: string };
}

// Generování SEO metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return getSeoDataBySlug('post', params.slug);
}

// Generování statických paths (pro SSG)
export async function generateStaticParams() {
  // Získání všech blog postů
  const posts = await getAllBlogPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Page komponenta
export default async function BlogPostPage({ params }: PageProps) {
  const post = await getBlogPost(params.slug);

  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
```

## Best Practices

1. **Vždy používejte správný content type** - ujistěte se, že používáte správný content type pro daný obsah
2. **Nastavte vhodnou revalidaci** - pro často měněný obsah použijte kratší revalidaci (např. 3600s = 1h)
3. **Využívejte helper funkce** - místo volání `getSeoData` přímo, používejte `getSeoDataById`, `getSeoDataBySlug` nebo `getSeoDataByUri`
4. **Testujte fallback** - ověřte, že vaše aplikace správně funguje i když WordPress API není dostupné
5. **Kombinujte s generateStaticParams** - pro statické stránky použijte `generateStaticParams` společně s `generateMetadata`

## Troubleshooting

### SEO data se nenačítají

1. Zkontrolujte, že `NEXT_PUBLIC_GRAPHQL_URL` je správně nastavena
2. Ověřte, že WordPress má nainstalovaný a aktivovaný Yoast SEO plugin
3. Zkontrolujte GraphQL endpoint na WordPress (měl by odpovídat na `/graphql`)
4. Podívejte se do konzole na případné error zprávy

### Custom Post Type není podporován

1. Přidejte nový content type do `ContentType` typu v `src/utils/seo.ts`
2. Přidejte mapování do `contentTypeMap` objektu
3. Ujistěte se, že Custom Post Type je registrován v GraphQL (WPGraphQL plugin)

### Metadata se neaktualizují

1. Zkontrolujte nastavení revalidace
2. V development módu zkuste vyčistit `.next` cache: `rm -rf .next`
3. V production použijte On-Demand Revalidation API pokud potřebujete okamžitou aktualizaci
