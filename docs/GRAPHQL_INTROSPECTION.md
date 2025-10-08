# GraphQL API Introspection - Pegas

Tento dokument obsahuje přehled dostupných GraphQL queries a mutations na endpointu:
**https://pegas.antstudio.dev/cz/graphql**

## 📁 Vygenerované soubory

- `graphql-schema.json` - Kompletní GraphQL schéma (1.2 MB)
- `graphql-operations-summary.json` - Přehled queries a mutations (~32 KB)
- `GRAPHQL_INTROSPECTION.md` - Tento dokument s lidsky čitelným přehledem

## 🔍 Klíčové Query Typy

### Posts a Content Types

#### **posts**

```graphql
posts(
  first: Int
  last: Int
  after: String
  before: String
  where: RootQueryToPostConnectionWhereArgs
): RootQueryToPostConnection
```

Získání seznamu běžných WordPress postů s podporou paginace.

#### **post**

```graphql
post(
  id: ID!
  idType: PostIdType
  asPreview: Boolean
): Post
```

Získání jednoho postu podle ID.

#### **pages**

```graphql
pages(
  first: Int
  last: Int
  after: String
  before: String
  where: RootQueryToPageConnectionWhereArgs
): RootQueryToPageConnection
```

Získání seznamu WordPress stránek (pages).

#### **page**

```graphql
page(
  id: ID!
  idType: PageIdType
  asPreview: Boolean
): Page
```

Získání jedné stránky podle ID.

#### **referencePosts**

```graphql
referencePosts(
  first: Int
  last: Int
  after: String
  before: String
  where: RootQueryToReferencePostConnectionWhereArgs
): RootQueryToReferencePostConnection
```

Custom post type pro reference.

#### **referencePost**

```graphql
referencePost(
  id: ID!
  idType: ReferencePostIdType
  asPreview: Boolean
): ReferencePost
```

Získání jedné reference podle ID.

#### **sluzbyPosts**

```graphql
sluzbyPosts(
  first: Int
  last: Int
  after: String
  before: String
  where: RootQueryToSluzbyPostConnectionWhereArgs
): RootQueryToSluzbyPostConnection
```

Custom post type pro služby.

#### **sluzbyPost**

```graphql
sluzbyPost(
  id: ID!
  idType: SluzbyPostIdType
  asPreview: Boolean
): SluzbyPost
```

Získání jedné služby podle ID.

### Media

#### **mediaItems**

```graphql
mediaItems(
  first: Int
  last: Int
  after: String
  before: String
  where: RootQueryToMediaItemConnectionWhereArgs
): RootQueryToMediaItemConnection
```

Získání seznamu media items (obrázky, soubory).

#### **mediaItem**

```graphql
mediaItem(
  id: ID!
  idType: MediaItemIdType
  asPreview: Boolean
): MediaItem
```

Získání jednoho media item podle ID.

### Taxonomies

#### **categories**

```graphql
categories(
  first: Int
  last: Int
  after: String
  before: String
  where: RootQueryToCategoryConnectionWhereArgs
): RootQueryToCategoryConnection
```

Získání seznamu kategorií.

#### **category**

```graphql
category(
  id: ID!
  idType: CategoryIdType
): Category
```

Získání jedné kategorie podle ID.

#### **tags**

```graphql
tags(
  first: Int
  last: Int
  after: String
  before: String
  where: RootQueryToTagConnectionWhereArgs
): RootQueryToTagConnection
```

Získání seznamu tagů.

#### **tag**

```graphql
tag(
  id: ID!
  idType: TagIdType
): Tag
```

Získání jednoho tagu podle ID.

### Users & Comments

#### **users**

```graphql
users(
  first: Int
  last: Int
  after: String
  before: String
  where: RootQueryToUserConnectionWhereArgs
): RootQueryToUserConnection
```

Získání seznamu uživatelů.

#### **user**

```graphql
user(
  id: ID!
  idType: UserNodeIdTypeEnum
): User
```

Získání jednoho uživatele podle ID.

#### **viewer**

```graphql
viewer: User
```

Získání aktuálně přihlášeného uživatele.

#### **comments**

```graphql
comments(
  first: Int
  last: Int
  after: String
  before: String
  where: RootQueryToCommentConnectionWhereArgs
): RootQueryToCommentConnection
```

Získání seznamu komentářů.

#### **comment**

```graphql
comment(
  id: ID!
  idType: CommentNodeIdTypeEnum
): Comment
```

Získání jednoho komentáře podle ID.

### Menus

#### **menus**

```graphql
menus(
  first: Int
  last: Int
  after: String
  before: String
  where: RootQueryToMenuConnectionWhereArgs
): RootQueryToMenuConnection
```

Získání seznamu menu.

#### **menu**

```graphql
menu(
  id: ID!
  idType: MenuNodeIdTypeEnum
): Menu
```

Získání jednoho menu podle ID.

#### **menuItems**

```graphql
menuItems(
  first: Int
  last: Int
  after: String
  before: String
  where: RootQueryToMenuItemConnectionWhereArgs
): RootQueryToMenuItemConnection
```

Získání položek menu.

#### **menuItem**

```graphql
menuItem(
  id: ID!
  idType: MenuItemNodeIdTypeEnum
): MenuItem
```

Získání jedné položky menu podle ID.

### Other Queries

#### **contentNode**

```graphql
contentNode(
  id: ID!
  idType: ContentNodeIdTypeEnum
  contentType: ContentTypeEnum
  asPreview: Boolean
): ContentNode
```

Univerzální query pro získání jakéhokoliv content node.

#### **contentNodes**

```graphql
contentNodes(
  first: Int
  last: Int
  after: String
  before: String
  where: RootQueryToContentNodeConnectionWhereArgs
): RootQueryToContentNodeConnection
```

Získání seznamu všech content nodes.

#### **node**

```graphql
node(
  id: ID
): Node
```

Univerzální query pro získání jakéhokoliv node podle global ID.

#### **allSettings**

```graphql
allSettings: Settings
```

Získání všech nastavení webu.

#### **discussionSettings**

```graphql
discussionSettings: DiscussionSettings
```

Získání nastavení diskuzí.

#### **generalSettings**

```graphql
generalSettings: GeneralSettings
```

Získání obecných nastavení.

#### **readingSettings**

```graphql
readingSettings: ReadingSettings
```

Získání nastavení čtení.

#### **writingSettings**

```graphql
writingSettings: WritingSettings
```

Získání nastavení psaní.

## 🔧 Mutations

### Posts

#### **createPost**

```graphql
createPost(input: CreatePostInput!): CreatePostPayload
```

#### **updatePost**

```graphql
updatePost(input: UpdatePostInput!): UpdatePostPayload
```

#### **deletePost**

```graphql
deletePost(input: DeletePostInput!): DeletePostPayload
```

### Pages

#### **createPage**

```graphql
createPage(input: CreatePageInput!): CreatePagePayload
```

#### **updatePage**

```graphql
updatePage(input: UpdatePageInput!): UpdatePagePayload
```

#### **deletePage**

```graphql
deletePage(input: DeletePageInput!): DeletePagePayload
```

### Reference Posts

#### **createReferencePost**

```graphql
createReferencePost(input: CreateReferencePostInput!): CreateReferencePostPayload
```

#### **updateReferencePost**

```graphql
updateReferencePost(input: UpdateReferencePostInput!): UpdateReferencePostPayload
```

#### **deleteReferencePost**

```graphql
deleteReferencePost(input: DeleteReferencePostInput!): DeleteReferencePostPayload
```

### Sluzby Posts

#### **createSluzbyPost**

```graphql
createSluzbyPost(input: CreateSluzbyPostInput!): CreateSluzbyPostPayload
```

#### **updateSluzbyPost**

```graphql
updateSluzbyPost(input: UpdateSluzbyPostInput!): UpdateSluzbyPostPayload
```

#### **deleteSluzbyPost**

```graphql
deleteSluzbyPost(input: DeleteSluzbyPostInput!): DeleteSluzbyPostPayload
```

### Media

#### **createMediaItem**

```graphql
createMediaItem(input: CreateMediaItemInput!): CreateMediaItemPayload
```

#### **updateMediaItem**

```graphql
updateMediaItem(input: UpdateMediaItemInput!): UpdateMediaItemPayload
```

#### **deleteMediaItem**

```graphql
deleteMediaItem(input: DeleteMediaItemInput!): DeleteMediaItemPayload
```

### Comments

#### **createComment**

```graphql
createComment(input: CreateCommentInput!): CreateCommentPayload
```

#### **updateComment**

```graphql
updateComment(input: UpdateCommentInput!): UpdateCommentPayload
```

#### **deleteComment**

```graphql
deleteComment(input: DeleteCommentInput!): DeleteCommentPayload
```

### Categories

#### **createCategory**

```graphql
createCategory(input: CreateCategoryInput!): CreateCategoryPayload
```

#### **updateCategory**

```graphql
updateCategory(input: UpdateCategoryInput!): UpdateCategoryPayload
```

#### **deleteCategory**

```graphql
deleteCategory(input: DeleteCategoryInput!): DeleteCategoryPayload
```

### Tags

#### **createTag**

```graphql
createTag(input: CreateTagInput!): CreateTagPayload
```

#### **updateTag**

```graphql
updateTag(input: UpdateTagInput!): UpdateTagPayload
```

#### **deleteTag**

```graphql
deleteTag(input: DeleteTagInput!): DeleteTagPayload
```

### Users

#### **registerUser**

```graphql
registerUser(input: RegisterUserInput!): RegisterUserPayload
```

#### **updateUser**

```graphql
updateUser(input: UpdateUserInput!): UpdateUserPayload
```

#### **deleteUser**

```graphql
deleteUser(input: DeleteUserInput!): DeleteUserPayload
```

#### **sendPasswordResetEmail**

```graphql
sendPasswordResetEmail(input: SendPasswordResetEmailInput!): SendPasswordResetEmailPayload
```

#### **resetUserPassword**

```graphql
resetUserPassword(input: ResetUserPasswordInput!): ResetUserPasswordPayload
```

## 🎨 ACF (Advanced Custom Fields)

API obsahuje podporu pro ACF pole. Typické pole dostupné přes interface `WithAcfACF`:

```graphql
interface WithAcfACF {
  aCF: ACF
}
```

### ACF Fields Interface

```graphql
interface ACF_Fields {
  description: String # Doplňte libovolné informace k rozloučení
  farewellDate: String # Datum a čas rozloučení (RFC3339)
  farewellPlace: String # Název místa (např. Obřadní síň)
  gallery: AcfMediaItemConnection # Fotografie z rozloučení (max 12)
  introImage: AcfMediaItemConnectionEdge # Úvodní obrázek stránky
}
```

## 📝 Příklady použití

### 1. Získání reference postů (aktuálně používaná implementace)

**TypeScript s Native Fetch API:**

```typescript
// src/api/wordpress-api.ts
export async function getReferencePosts(first = 10, after?: string) {
  const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'https://pegas.antstudio.dev/cz/graphql';

  const query = `
    query GetReferencePosts($first: Int!, $after: String) {
      referencePosts(first: $first, after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
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
  `;

  const response = await fetch(graphqlUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { first, after } }),
    next: { revalidate: 3600 }, // ISR - revalidace každou hodinu
  });

  const result = await response.json();
  return result.data.referencePosts;
}
```

**Použití v Server Component:**

```tsx
// app/[locale]/page.tsx
import { getHomepageWithSelectedPosts } from '@/api/wordpress-api';
import ReferencesCarouselSection from '@/components/_shared/ReferencesCarouselSection';

const Homepage = async () => {
  const homepageData = await getHomepageWithSelectedPosts();
  const referencePosts = homepageData.homepageACF?.selectedPosts?.nodes || [];

  return <ReferencesCarouselSection referencePosts={referencePosts} />;
};
```

### 2. Získání seznamu postů

**GraphQL Query:**

```graphql
query GetPosts {
  posts(first: 10) {
    nodes {
      id
      title
      excerpt
      date
      slug
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
    }
  }
}
```

**TypeScript implementace:**

```typescript
export async function getPosts(first = 10) {
  const query = `
    query GetPosts($first: Int!) {
      posts(first: $first) {
        nodes {
          id
          title
          excerpt
          date
          slug
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
        }
      }
    }
  `;

  const response = await fetch(graphqlUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { first } }),
    next: { revalidate: 3600 },
  });

  const result = await response.json();
  return result.data.posts;
}
```

### 3. Získání stránky podle slug

**GraphQL Query:**

```graphql
query GetPageBySlug($slug: ID!) {
  page(id: $slug, idType: URI) {
    id
    title
    content
    date
    featuredImage {
      node {
        sourceUrl
        altText
      }
    }
  }
}
```

**TypeScript implementace:**

```typescript
export async function getPageBySlug(slug: string) {
  const query = `
    query GetPageBySlug($slug: ID!) {
      page(id: $slug, idType: URI) {
        id
        title
        content
        date
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
  `;

  const response = await fetch(graphqlUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { slug } }),
    next: { revalidate: 3600 },
  });

  const result = await response.json();
  return result.data.page;
}
```

### 4. Získání menu

**GraphQL Query:**

```graphql
query GetMenu($location: MenuLocationEnum!) {
  menu(id: $location, idType: LOCATION) {
    id
    name
    menuItems {
      nodes {
        id
        label
        url
        path
        target
        parentId
        cssClasses
      }
    }
  }
}
```

### 5. Test pomocí curl

```bash
# Získání reference postů
curl -X POST https://pegas.antstudio.dev/cz/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query GetReferencePosts { referencePosts(first: 5) { nodes { id title slug } } }"
  }' | jq '.'

# Získání stránky
curl -X POST https://pegas.antstudio.dev/cz/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query GetPage { page(id: \"5\", idType: DATABASE_ID) { id title } }"
  }' | jq '.'
```

## 🔐 Autentizace

Pro operace vyžadující autentizaci (mutations) je potřeba použít JWT token nebo jiný autentizační mechanismus nakonfigurovaný ve WordPressu.

## 📚 Další zdroje

- **Kompletní schéma:** `graphql-schema.json` (1.2 MB)
- **Detailní přehled operací:** `graphql-operations-summary.json` (~32 KB)
- **Setup dokumentace:** `WPGRAPHQL_SETUP.md`
- **WPGraphQL dokumentace:** [wpgraphql.com](https://www.wpgraphql.com/)
- **GraphQL dokumentace:** [graphql.org](https://graphql.org/)

## 🛠️ Implementace v projektu

Projekt používá **Native Fetch API** místo Apollo Client pro:

- ✅ Zero dependencies
- ✅ Perfektní integrace s Next.js Server Components
- ✅ Menší bundle size (~500KB úspora)
- ✅ Jednodušší maintenance
- ✅ ISR (Incremental Static Regeneration) podpora

Viz `src/api/wordpress-api.ts` pro implementaci.

## ⚙️ Vygenerováno

Tento dokument byl vygenerován pomocí GraphQL Introspection Query dne 8. října 2025.
Aktualizováno pro použití s Native Fetch API.
