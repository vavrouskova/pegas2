import { MAX_POSTS_FETCH, POSTS_PER_PAGE } from '@/constants/blog';
import { MAX_REFERENCES_FETCH } from '@/constants/references';
import { formatFarewellDateTime, stripHtmlTags } from '@/utils/helper';
import type {
  BlogCategory,
  BlogPost,
  BlogPostDetail,
  PobockaPost,
  PostupPost,
  ReferenceCategory,
  ReferencePost,
  ZamestnanciPost,
} from '@/utils/wordpress-types';

/**
 * Získá počet poboček (pobockaPosts)
 * @returns Promise s počtem poboček
 */
export async function getBranchesCount(): Promise<number> {
  const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'https://pegas.antstudio.dev/cz/graphql';

  const query = `
    query GetBranchesCount {
      pobockaPosts(first: 100) {
        nodes {
          id
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
      }),
      next: { tags: ['wordpress'], revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      throw new Error('GraphQL query failed');
    }

    return result.data?.pobockaPosts?.nodes?.length || 0;
  } catch (error) {
    console.error('Error fetching branches count:', error);
    return 0;
  }
}

/**
 * Získá seznam poboček (pobockaPosts)
 * @param first - Počet poboček k načtení (výchozí 100)
 * @returns Promise se seznamem poboček
 */
export async function getPobockyPosts(first = 100) {
  const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'https://pegas.antstudio.dev/cz/graphql';

  const query = `
    query GetPobockyPosts($first: Int!) {
      pobockaPosts(first: $first) {
        nodes {
          id
          databaseId
          title
          slug
          pobockyACF {
            city
            openSwitcher
          }
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
      next: { tags: ['wordpress'], revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      throw new Error('GraphQL query failed');
    }

    return result.data?.pobockaPosts?.nodes || [];
  } catch (error) {
    console.error('Error fetching pobocky posts:', error);
    return [];
  }
}

/**
 * Získá homepage data s vybranými reference posty a službami z ACF
 * @returns Promise s homepage daty
 */
export async function getHomepageData() {
  const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'https://pegas.antstudio.dev/cz/graphql';

  const query = `
    query GetHomepage {
      page(id: "5", idType: DATABASE_ID) {
        id
        databaseId
        title
        homepageACF {
          selectedReference {
            nodes {
              ... on ReferencePost {
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
              }
            }
          }
          selectedSluzby {
            nodes {
              ... on SluzbyPost {
                id
                databaseId
                title
                slug
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
      }),
      // Next.js specific: revalidate every hour
      next: { tags: ['wordpress'], revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.errors) {
      console.error('GraphQL errors:', JSON.stringify(result.errors, null, 2));
      throw new Error(`GraphQL query failed: ${JSON.stringify(result.errors[0]?.message || result.errors)}`);
    }

    if (!result.data?.page) {
      throw new Error('No homepage data returned');
    }

    return result.data.page;
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    throw error;
  }
}

/**
 * Získá timeline data ze stránky O Nás
 * @returns Promise s timeline daty
 */
export async function getAboutUsTimeline() {
  const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'https://pegas.antstudio.dev/cz/graphql';

  const query = `
    query Page {
      page(id: "o-nas", idType: URI) {
        id
        oNasACF {
          timeline {
            description
            fieldGroupName
            titulek
            year
            image {
              node {
                altText
                sourceUrl
              }
            }
          }
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
      }),
      next: { tags: ['wordpress'], revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.errors) {
      console.error('GraphQL errors for timeline:', JSON.stringify(result.errors, null, 2));
      console.error('Query was:', query);
      throw new Error('GraphQL query failed');
    }

    return result.data?.page || null;
  } catch (error) {
    console.error('Error fetching about us timeline:', error);
    return null;
  }
}

/**
 * Získá seznam zaměstnanců (zamestnanciPosts)
 * @param first - Počet zaměstnanců k načtení (výchozí 100)
 * @returns Promise se seznamem zaměstnanců
 */
export async function getZamestnanciPosts(first = 100): Promise<ZamestnanciPost[]> {
  const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'https://pegas.antstudio.dev/cz/graphql';

  const query = `
    query ZamestnanciPosts($first: Int!) {
      zamestnanciPosts(first: $first) {
        nodes {
          id
          databaseId
          title
          zamestnanciACF {
            positionDescription
            positonType
            employeeQuote
            profileImage {
              node {
                altText
                sourceUrl
              }
            }
          }
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
      next: { tags: ['wordpress'], revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      throw new Error('GraphQL query failed');
    }

    return result.data?.zamestnanciPosts?.nodes || [];
  } catch (error) {
    console.error('Error fetching zamestnanci posts:', error);
    return [];
  }
}

/**
 * Získá všechna data služeb v jednom requestu (optimalizováno)
 * @param first - Počet služeb k načtení pro každou kategorii (výchozí 100)
 * @returns Promise s daty všech taxonomií a služeb
 */
export async function getAllServicesData(first = 100) {
  const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'https://pegas.antstudio.dev/cz/graphql';

  const query = `
    query GetAllServicesData($first: Int!) {
      funeralCeremonies: typSluzby(id: "smutecni-obrady", idType: SLUG) {
        name
        description
        sluzbyPosts(first: $first) {
          nodes {
            id
            title
            slug
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
      funeralEssentials: typSluzby(id: "nalezitosti-pohrbu", idType: SLUG) {
        name
        description
        sluzbyPosts(first: $first) {
          nodes {
            id
            title
            slug
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
      allServices: sluzbyPosts(first: $first) {
        nodes {
          id
          title
          slug
          sluzbyAcf {
            introText
          }
          typSluzby {
            nodes {
              id
            }
          }
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
      next: { tags: ['wordpress'], revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      throw new Error('GraphQL query failed');
    }

    const data = result.data;

    // Filtrujeme služby bez taxonomie
    const allPosts = data?.allServices?.nodes || [];
    const uncategorizedPosts = allPosts.filter(
      (post: { typSluzby?: { nodes?: unknown[] } }) => !post.typSluzby?.nodes || post.typSluzby.nodes.length === 0
    );

    return {
      funeralCeremonies: {
        taxonomy: data?.funeralCeremonies
          ? {
              name: data.funeralCeremonies.name,
              description: data.funeralCeremonies.description,
            }
          : null,
        posts: data?.funeralCeremonies?.sluzbyPosts?.nodes || [],
      },
      funeralEssentials: {
        taxonomy: data?.funeralEssentials
          ? {
              name: data.funeralEssentials.name,
              description: data.funeralEssentials.description,
            }
          : null,
        posts: data?.funeralEssentials?.sluzbyPosts?.nodes || [],
      },
      otherServices: uncategorizedPosts,
    };
  } catch (error) {
    console.error('Error fetching all services data:', error);
    return {
      funeralCeremonies: { taxonomy: null, posts: [] },
      funeralEssentials: { taxonomy: null, posts: [] },
      otherServices: [],
    };
  }
}

/**
 * Získá služby BEZ přiřazené taxonomie (služby, které nejsou v žádné kategorii)
 * @param first - Počet služeb k načtení (výchozí 100)
 * @returns Promise se seznamem služeb
 * @deprecated Použij getAllServicesData() pro lepší výkon
 */
export async function getUncategorizedServices(first = 100) {
  const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'https://pegas.antstudio.dev/cz/graphql';

  const query = `
    query GetUncategorizedServices($first: Int!) {
      sluzbyPosts(first: $first) {
        nodes {
          id
          title
          slug
          typSluzby {
            nodes {
              id
            }
          }
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
      next: { tags: ['wordpress'], revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      throw new Error('GraphQL query failed');
    }

    // Filtrujeme jen služby bez taxonomie (kde typSluzby.nodes je prázdné pole)
    const allPosts = result.data?.sluzbyPosts?.nodes || [];
    const uncategorizedPosts = allPosts.filter(
      (post: { typSluzby?: { nodes?: unknown[] } }) => !post.typSluzby?.nodes || post.typSluzby.nodes.length === 0
    );

    return uncategorizedPosts;
  } catch (error) {
    console.error('Error fetching uncategorized services:', error);
    return [];
  }
}

/**
 * Získá detail služby podle slugu
 * @param slug - Slug služby
 * @returns Promise s detailem služby
 */
export async function getServiceBySlug(slug: string) {
  const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'https://pegas.antstudio.dev/cz/graphql';

  const query = `
    query GetServiceBySlug($slug: ID!) {
      sluzbyPost(id: $slug, idType: SLUG) {
        id
        databaseId
        title
        slug
        typSluzby {
          nodes {
            name
            slug
          }
        }
        sluzbyAcf {
          introText
          introImageSluzby {
            node {
              altText
              sourceUrl
            }
          }
        }
        components {
          components {
            ... on ComponentsComponentsWysiwygLayout {
              fieldGroupName
              editor
            }
            ... on ComponentsComponentsMediaLayout {
              fieldGroupName
              mediaType
              youtubeEmbedLink
              image {
                node {
                  altText
                  sourceUrl
                }
              }
            }
            ... on ComponentsComponentsGalleryLayout {
              fieldGroupName
              gallery {
                nodes {
                  altText
                  sourceUrl
                }
              }
            }
            ... on ComponentsComponentsImageBoxesLayout {
              fieldGroupName
              imageBoxes {
                boxHeadline
                boxDescription
                imageBox {
                  node {
                    altText
                    sourceUrl
                  }
                }
              }
            }
            ... on ComponentsComponentsImageSliderLayout {
              fieldGroupName
              imageSlider {
                nodes {
                  altText
                  sourceUrl
                }
              }
            }
          }
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
        variables: { slug },
      }),
      next: { tags: ['wordpress'], revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      throw new Error('GraphQL query failed');
    }

    return result.data?.sluzbyPost || null;
  } catch (error) {
    console.error(`Error fetching service with slug ${slug}:`, error);
    return null;
  }
}

/**
 * Získá služby podle taxonomie (typSluzby)
 * @param taxonomySlug - Slug taxonomie (např. "smutecni-obrady")
 * @param first - Počet služeb k načtení (výchozí 100)
 * @returns Promise s daty taxonomie a seznamem služeb
 */
export async function getServicesByTaxonomy(taxonomySlug: string, first = 100) {
  const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'https://pegas.antstudio.dev/cz/graphql';

  const query = `
    query GetServicesByTaxonomy($slug: ID!, $first: Int!) {
      typSluzby(id: $slug, idType: SLUG) {
        name
        description
        sluzbyPosts(first: $first) {
          nodes {
            id
            title
            slug
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
        variables: { slug: taxonomySlug, first },
      }),
      next: { tags: ['wordpress'], revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      throw new Error('GraphQL query failed');
    }

    const taxonomyData = result.data?.typSluzby;

    return {
      taxonomy: taxonomyData
        ? {
            name: taxonomyData.name,
            description: taxonomyData.description,
          }
        : null,
      posts: taxonomyData?.sluzbyPosts?.nodes || [],
    };
  } catch (error) {
    console.error(`Error fetching services for taxonomy ${taxonomySlug}:`, error);
    return {
      taxonomy: null,
      posts: [],
    };
  }
}

/**
 * Získá seznam kategorií pro blog posty
 * @param first - Počet kategorií k načtení (výchozí 100)
 * @returns Promise se seznamem kategorií
 */
export async function getBlogCategories(first = 100) {
  const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'https://pegas.antstudio.dev/cz/graphql';

  const query = `
    query GetBlogCategories($first: Int!) {
      categories(first: $first) {
        nodes {
          id
          databaseId
          name
          slug
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
      next: { tags: ['wordpress'], revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      throw new Error('GraphQL query failed');
    }

    return result.data?.categories?.nodes || [];
  } catch (error) {
    console.error('Error fetching blog categories:', error);
    return [];
  }
}

/**
 * Získá kategorii podle slugu
 * @param slug - Slug kategorie
 * @returns Promise s detailem kategorie nebo null
 */
export async function getBlogCategoryBySlug(slug: string): Promise<BlogCategory | null> {
  const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'https://pegas.antstudio.dev/cz/graphql';

  const query = `
    query GetCategoryBySlug($slug: ID!) {
      category(id: $slug, idType: SLUG) {
        id
        databaseId
        name
        slug
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
        variables: { slug },
      }),
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data?.data?.category || null;
  } catch (error) {
    console.error('Error fetching category by slug:', error);
    return null;
  }
}

/**
 * Rychlá kontrola, zda slug existuje jako blog post, služba, reference, pobočka nebo postup
 * @param slug - Slug k ověření
 * @returns 'post' | 'sluzbyPost' | 'referencePost' | 'pobockaPost' | 'postupPost' | null
 */
export async function checkSlugType(
  slug: string
): Promise<'post' | 'sluzbyPost' | 'referencePost' | 'pobockaPost' | 'postupPost' | null> {
  const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'https://pegas.antstudio.dev/cz/graphql';

  // Jeden GraphQL dotaz, který zkontroluje všechny typy najednou
  const query = `
    query CheckSlugType($slug: ID!) {
      post(id: $slug, idType: SLUG) {
        id
      }
      sluzbyPost(id: $slug, idType: SLUG) {
        id
      }
      referencePost(id: $slug, idType: SLUG) {
        id
      }
      pobockaPost(id: $slug, idType: SLUG) {
        id
      }
      postupPost(id: $slug, idType: SLUG) {
        id
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
        variables: { slug },
      }),
      next: { tags: ['wordpress'], revalidate: 3600 },
    });

    if (!response.ok) {
      return null;
    }

    const result = await response.json();

    if (result.errors) {
      return null;
    }

    // Prioritizujeme blog post pokud existuje
    if (result.data?.post) {
      return 'post';
    }

    if (result.data?.sluzbyPost) {
      return 'sluzbyPost';
    }

    if (result.data?.referencePost) {
      return 'referencePost';
    }

    if (result.data?.pobockaPost) {
      return 'pobockaPost';
    }

    if (result.data?.postupPost) {
      return 'postupPost';
    }

    return null;
  } catch (error) {
    console.error(`Error checking slug type for ${slug}:`, error);
    return null;
  }
}

/**
 * Získá detail blog postu podle slugu
 * @param slug - Slug blog postu
 * @returns Promise s detailem blog postu
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPostDetail | null> {
  const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'https://pegas.antstudio.dev/cz/graphql';

  const query = `
    query GetBlogPostBySlug($slug: ID!) {
      post(id: $slug, idType: SLUG) {
        id
        databaseId
        title
        slug
        excerpt
        date
        categories {
          nodes {
            id
            databaseId
            name
            slug
          }
        }
        featuredImage {
          node {
            altText
            sourceUrl
            mediaDetails {
              width
              height
            }
          }
        }
        components {
          components {
            ... on ComponentsComponentsWysiwygLayout {
              fieldGroupName
              editor
            }
            ... on ComponentsComponentsMediaLayout {
              fieldGroupName
              mediaType
              youtubeEmbedLink
              image {
                node {
                  altText
                  sourceUrl
                }
              }
            }
            ... on ComponentsComponentsGalleryLayout {
              fieldGroupName
              gallery {
                nodes {
                  altText
                  sourceUrl
                }
              }
            }
            ... on ComponentsComponentsImageBoxesLayout {
              fieldGroupName
              imageBoxes {
                boxHeadline
                boxDescription
                imageBox {
                  node {
                    altText
                    sourceUrl
                  }
                }
              }
            }
            ... on ComponentsComponentsImageSliderLayout {
              fieldGroupName
              imageSlider {
                nodes {
                  altText
                  sourceUrl
                }
              }
            }
          }
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
        variables: { slug },
      }),
      next: { tags: ['wordpress'], revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      throw new Error('GraphQL query failed');
    }

    return result.data?.post || null;
  } catch (error) {
    console.error(`Error fetching blog post with slug ${slug}:`, error);
    return null;
  }
}

/**
 * Získá seznam taxonomií pro reference (typReference)
 * @param first - Počet taxonomií k načtení (výchozí 100)
 * @returns Promise se seznamem taxonomií
 */
export async function getReferenceTaxonomies(first = 100): Promise<ReferenceCategory[]> {
  const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'https://pegas.antstudio.dev/cz/graphql';

  const query = `
    query GetReferenceTaxonomies($first: Int!) {
      allTypReference(first: $first) {
        nodes {
          id
          databaseId
          name
          slug
          description
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
      next: { tags: ['wordpress'], revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      throw new Error('GraphQL query failed');
    }

    return result.data?.allTypReference?.nodes || [];
  } catch (error) {
    console.error('Error fetching reference taxonomies:', error);
    return [];
  }
}

/**
 * Získá seznam referenčních postů (referencePosts) s podporou paginace, filtrování podle kategorie a vyhledávání
 * @param referencesPerPage - Počet referencí na stránku (výchozí 9)
 * @param page - Číslo stránky (výchozí 1)
 * @param categoryId - ID kategorie pro filtrování (volitelné)
 * @param search - Vyhledávací dotaz (hledá v title a description, volitelné)
 * @returns Promise s daty referencí včetně paginace
 */
export async function getReferencePosts(referencesPerPage = 9, page = 1, categoryId?: string, search?: string) {
  const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'https://pegas.antstudio.dev/cz/graphql';

  // Získáme větší množství postů (max 1000) pro výpočet paginace
  const query = `
    query GetReferencePosts($first: Int!) {
      referencePosts(first: $first) {
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

  try {
    const response = await fetch(graphqlUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { first: MAX_REFERENCES_FETCH },
      }),
      next: { tags: ['wordpress'], revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      throw new Error('GraphQL query failed');
    }

    let allNodes = result.data?.referencePosts?.nodes || [];

    // Aplikujeme category filtr
    if (categoryId) {
      allNodes = allNodes.filter((reference: ReferencePost) =>
        reference.typReference?.nodes?.some((cat) => cat.databaseId.toString() === categoryId)
      );
    }

    // Aplikujeme search filtr
    if (search) {
      const searchLower = search.toLowerCase();
      allNodes = allNodes.filter(
        (reference: ReferencePost) =>
          reference.title.toLowerCase().includes(searchLower) ||
          reference.referenceACF?.description?.toLowerCase().includes(searchLower)
      );
    }

    const totalCount = allNodes.length;
    const totalPages = Math.ceil(totalCount / referencesPerPage);

    // Rozdělíme reference na stránky
    const startIndex = (page - 1) * referencesPerPage;
    const endIndex = startIndex + referencesPerPage;
    const nodes = allNodes.slice(startIndex, endIndex);

    const hasNextPage = endIndex < totalCount;
    const hasPreviousPage = page > 1;

    return {
      nodes,
      pageInfo: {
        hasNextPage,
        hasPreviousPage,
        startCursor: null,
        endCursor: null,
      },
      totalCount,
      totalPages,
      currentPage: page,
    };
  } catch (error) {
    console.error('Error fetching reference posts:', error);
    return {
      nodes: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: null,
        endCursor: null,
      },
      totalCount: 0,
      totalPages: 0,
      currentPage: page,
    };
  }
}

/**
 * Získá detail referenčního postu podle slugu
 * @param slug - Slug referenčního postu
 * @returns Promise s detailem referenčního postu
 */
export async function getReferenceBySlug(slug: string) {
  const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'https://pegas.antstudio.dev/cz/graphql';

  const query = `
    query GetReferenceBySlug($slug: ID!) {
      referencePost(id: $slug, idType: SLUG) {
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
        components {
          components {
            ... on ComponentsComponentsWysiwygLayout {
              fieldGroupName
              editor
            }
            ... on ComponentsComponentsMediaLayout {
              fieldGroupName
              mediaType
              youtubeEmbedLink
              image {
                node {
                  altText
                  sourceUrl
                }
              }
            }
            ... on ComponentsComponentsGalleryLayout {
              fieldGroupName
              gallery {
                nodes {
                  altText
                  sourceUrl
                }
              }
            }
            ... on ComponentsComponentsImageBoxesLayout {
              fieldGroupName
              imageBoxes {
                boxHeadline
                boxDescription
                imageBox {
                  node {
                    altText
                    sourceUrl
                  }
                }
              }
            }
            ... on ComponentsComponentsImageSliderLayout {
              fieldGroupName
              imageSlider {
                nodes {
                  altText
                  sourceUrl
                }
              }
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
  `;

  try {
    const response = await fetch(graphqlUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { slug },
      }),
      next: { tags: ['wordpress'], revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      throw new Error('GraphQL query failed');
    }

    return result.data?.referencePost || null;
  } catch (error) {
    console.error(`Error fetching reference post with slug ${slug}:`, error);
    return null;
  }
}

/**
 * Získá blog posty pro carousel (omezený počet s potřebnými daty)
 * @param first - Počet postů k načtení (výchozí 6)
 * @returns Promise se seznamem blog postů pro carousel
 */
export async function getBlogPostsForCarousel(first = 6): Promise<BlogPost[]> {
  const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'https://pegas.antstudio.dev/cz/graphql';

  const query = `
    query GetBlogPostsForCarousel($first: Int!) {
      posts(first: $first) {
        nodes {
          id
          databaseId
          title
          slug
          excerpt
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
      next: { tags: ['wordpress'], revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      throw new Error('GraphQL query failed');
    }

    return result.data?.posts?.nodes || [];
  } catch (error) {
    console.error('Error fetching blog posts for carousel:', error);
    return [];
  }
}

/**
 * Získá seznam blog postů (posts) s podporou filtrování a paginace
 * @param postsPerPage - Počet postů na stránku (výchozí 9)
 * @param page - Číslo stránky (výchozí 1)
 * @param categoryId - ID kategorie pro filtrování (volitelné)
 * @param search - Vyhledávací dotaz (volitelné)
 * @returns Promise s daty blog postů včetně paginace
 */
export async function getBlogPosts(postsPerPage = POSTS_PER_PAGE, page = 1, categoryId?: string, search?: string) {
  const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'https://pegas.antstudio.dev/cz/graphql';

  const whereClause: Record<string, unknown> = {};
  if (categoryId) {
    whereClause.categoryId = Number.parseInt(categoryId, 10);
  }

  const hasFilters = Object.keys(whereClause).length > 0;
  const finalWhereClause = hasFilters ? whereClause : undefined;

  // Získáme všechny posty najednou (max 1000) a pak je rozdělíme na stránky
  const query = `
    query GetBlogPosts($first: Int!, $where: RootQueryToPostConnectionWhereArgs) {
      posts(first: $first, where: $where) {
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        nodes {
          id
          databaseId
          title
          slug
          excerpt
          categories {
            nodes {
              id
              name
              slug
            }
          }
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

  try {
    // Získáme větší množství postů (max 1000) pro výpočet paginace
    const response = await fetch(graphqlUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: {
          first: MAX_POSTS_FETCH,
          where: finalWhereClause,
        },
      }),
      next: { tags: ['wordpress'], revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      throw new Error('GraphQL query failed');
    }

    let allNodes = result.data?.posts?.nodes || [];

    // Aplikujeme search filtr
    if (search) {
      const searchLower = search.toLowerCase();
      allNodes = allNodes.filter(
        (post: BlogPost) =>
          post.title.toLowerCase().includes(searchLower) || post.excerpt?.toLowerCase().includes(searchLower)
      );
    }

    const totalCount = allNodes.length;
    const totalPages = Math.ceil(totalCount / postsPerPage);

    // Rozdělíme posty na stránky
    const startIndex = (page - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const nodes = allNodes.slice(startIndex, endIndex);

    const hasNextPage = endIndex < totalCount;
    const hasPreviousPage = page > 1;

    return {
      nodes,
      pageInfo: {
        hasNextPage,
        hasPreviousPage,
        startCursor: null,
        endCursor: null,
      },
      totalCount,
      totalPages,
      currentPage: page,
    };
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return {
      nodes: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: null,
        endCursor: null,
      },
      totalCount: 0,
      totalPages: 0,
      currentPage: page,
    };
  }
}

/**
 * Získá seznam blog postů (posts) filtrovaných podle category slug s podporou paginace a vyhledávání
 * @param postsPerPage - Počet postů na stránku (výchozí 9)
 * @param page - Číslo stránky (výchozí 1)
 * @param categorySlug - Slug kategorie pro filtrování (volitelné)
 * @param search - Vyhledávací dotaz (volitelné)
 * @returns Promise s daty blog postů včetně paginace
 */
export async function getBlogPostsByCategorySlug(
  postsPerPage = POSTS_PER_PAGE,
  page = 1,
  categorySlug?: string,
  search?: string
) {
  const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'https://pegas.antstudio.dev/cz/graphql';

  const whereClause: Record<string, unknown> = {};
  if (categorySlug) {
    whereClause.categoryName = categorySlug;
  }

  const hasFilters = Object.keys(whereClause).length > 0;
  const finalWhereClause = hasFilters ? whereClause : undefined;

  const query = `
    query GetBlogPostsByCategorySlug($first: Int!, $where: RootQueryToPostConnectionWhereArgs) {
      posts(first: $first, where: $where) {
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        nodes {
          id
          databaseId
          title
          slug
          excerpt
          categories {
            nodes {
              id
              name
              slug
            }
          }
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

  try {
    const response = await fetch(graphqlUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: {
          first: 1000,
          where: finalWhereClause,
        },
      }),
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    let allPosts = data?.data?.posts?.nodes || [];

    // Apply search filter client-side if needed
    if (search && search.trim()) {
      const searchLower = search.toLowerCase().trim();
      allPosts = allPosts.filter(
        (post: BlogPost) =>
          post.title.toLowerCase().includes(searchLower) ||
          (post.excerpt && post.excerpt.toLowerCase().includes(searchLower))
      );
    }

    // Calculate pagination
    const totalPosts = allPosts.length;
    const totalPages = Math.ceil(totalPosts / postsPerPage);
    const startIndex = (page - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const paginatedPosts = allPosts.slice(startIndex, endIndex);

    return {
      nodes: paginatedPosts,
      totalPages,
      currentPage: page,
      totalPosts,
    };
  } catch (error) {
    console.error('Error fetching blog posts by category slug:', error);
    return {
      nodes: [],
      totalPages: 0,
      currentPage: 1,
      totalPosts: 0,
    };
  }
}

/**
 * Získá kontaktní osoby ze stránky "kontakty"
 * @returns Promise se seznamem kontaktních osob
 */
export async function getContactPeople(): Promise<ZamestnanciPost[]> {
  const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'https://pegas.antstudio.dev/cz/graphql';

  const query = `
    query Page {
      page(id: "kontakty", idType: URI) {
        kontaktyACF {
          personSelection {
            nodes {
              ... on ZamestnanecPost {
                id
                databaseId
                title
                zamestnanciACF {
                  employeeEmail
                  positionDescription
                  profileImage {
                    node {
                      altText
                      sourceUrl
                    }
                  }
                }
              }
            }
          }
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
      }),
      next: { tags: ['wordpress'], revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      throw new Error('GraphQL query failed');
    }

    return result.data?.page?.kontaktyACF?.personSelection?.nodes || [];
  } catch (error) {
    console.error('Error fetching contact people:', error);
    return [];
  }
}

/**
 * Získá seznam všech poboček
 * @returns Promise se seznamem poboček
 */
export async function getBranches(): Promise<PobockaPost[]> {
  const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'https://pegas.antstudio.dev/cz/graphql';

  const query = `
    query PobockaPosts {
      pobockaPosts {
        nodes {
          id
          databaseId
          title
          slug
          featuredImage {
            node {
              altText
              sourceUrl
            }
          }
          pobockyACF {
            city
            dateCloseFrom
            dateCloseTo
            openDaysWeekend
            openDaysWorking
            openSwitcher
            phoneNumber
            email
            showRoom
            parking
            gPS
            visitUs
          }
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
      }),
      next: { tags: ['wordpress'], revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      throw new Error('GraphQL query failed');
    }

    return result.data?.pobockaPosts?.nodes || [];
  } catch (error) {
    console.error('Error fetching branches:', error);
    return [];
  }
}

/**
 * Získá seznam FAQ postupů (postupPosts)
 * @param first - Počet postupů k načtení (výchozí 100)
 * @returns Promise se seznamem FAQ postupů
 */
export async function getPostupPosts(first = 100): Promise<PostupPost[]> {
  const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'https://pegas.antstudio.dev/cz/graphql';

  const query = `
    query GetPostupPosts($first: Int!) {
      postupPosts(first: $first) {
        nodes {
          id
          databaseId
          title
          slug
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
      next: { tags: ['wordpress'], revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      throw new Error('GraphQL query failed');
    }

    return result.data?.postupPosts?.nodes || [];
  } catch (error) {
    console.error('Error fetching postup posts:', error);
    return [];
  }
}

/**
 * Získá detail FAQ postupu podle slugu
 * @param slug - Slug postupu
 * @returns Promise s detailem postupu
 */
export async function getPostupBySlug(slug: string): Promise<PostupPost | null> {
  const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'https://pegas.antstudio.dev/cz/graphql';

  const query = `
    query GetPostupBySlug($slug: ID!) {
      postupPost(id: $slug, idType: SLUG) {
        id
        databaseId
        title
        slug
        jakPostupovatAcf {
          bottomSubtitle
          fieldGroupName
          shortDescription
          topSubtitle
        }
        components {
          components {
            ... on ComponentsComponentsWysiwygLayout {
              fieldGroupName
              editor
            }
            ... on ComponentsComponentsMediaLayout {
              fieldGroupName
              mediaType
              youtubeEmbedLink
              image {
                node {
                  altText
                  sourceUrl
                }
              }
            }
            ... on ComponentsComponentsGalleryLayout {
              fieldGroupName
              gallery {
                nodes {
                  altText
                  sourceUrl
                }
              }
            }
            ... on ComponentsComponentsImageBoxesLayout {
              fieldGroupName
              imageBoxes {
                boxHeadline
                boxDescription
                imageBox {
                  node {
                    altText
                    sourceUrl
                  }
                }
              }
            }
            ... on ComponentsComponentsImageSliderLayout {
              fieldGroupName
              imageSlider {
                nodes {
                  altText
                  sourceUrl
                }
              }
            }
          }
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
        variables: { slug },
      }),
      next: { tags: ['wordpress'], revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      throw new Error('GraphQL query failed');
    }

    return result.data?.postupPost || null;
  } catch (error) {
    console.error(`Error fetching postup with slug ${slug}:`, error);
    return null;
  }
}

/**
 * Získá detail pobočky podle slugu
 * @param slug - Slug pobočky
 * @returns Promise s detailem pobočky
 */
export async function getBranchBySlug(slug: string): Promise<PobockaPost | null> {
  const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'https://pegas.antstudio.dev/cz/graphql';

  const query = `
    query GetBranchBySlug($slug: ID!) {
      pobockaPost(id: $slug, idType: SLUG) {
        id
        databaseId
        title
        slug
        featuredImage {
          node {
            altText
            sourceUrl
          }
        }
        pobockyACF {
          city
          closeAccouncment
          dateCloseFrom
          dateCloseTo
          announcementButton {
                target
                title
                url
            }
          email
          funeralRequirements
          internalImage {
            node {
              altText
              sourceUrl
            }
          }
          mapImage {
            node {
              altText
              sourceUrl
            }
          }
          navigateLink
          openDaysWeekend
          openDaysWorking
          openSwitcher
          parking
          phoneNumber
          visitUs
          wheelchairAccess
          gPS
          consultant {
            nodes {
              ... on ZamestnanecPost {
                title
                zamestnanciACF {
                  employeeEmail
                  positionDescription
                  profileImage {
                    node {
                      altText
                      sourceUrl
                    }
                  }
                }
              }
            }
          }
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
        variables: { slug },
      }),
      next: { tags: ['wordpress'], revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.errors) {
      console.error('GraphQL errors for getBranchBySlug:', JSON.stringify(result.errors, null, 2));
      console.error('Query was:', query);
      throw new Error(`GraphQL query failed: ${JSON.stringify(result.errors[0]?.message || result.errors)}`);
    }

    return result.data?.pobockaPost || null;
  } catch (error) {
    console.error(`Error fetching branch with slug ${slug}:`, error);
    return null;
  }
}

/**
 * Fetches a WordPress page by URI with components for DynamicContentSection
 * @param uri - The page URI (e.g., "zasady-ochrany-osobnich-udaju")
 * @returns Promise with page data including title and components
 */
export async function getPageByUri(uri: string) {
  const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'https://pegas.antstudio.dev/cz/graphql';

  const query = `
    query GetPageByUri($id: ID!) {
      page(id: $id, idType: URI) {
        id
        databaseId
        title
        components {
          components {
            ... on ComponentsComponentsWysiwygLayout {
              fieldGroupName
              editor
            }
            ... on ComponentsComponentsMediaLayout {
              fieldGroupName
              mediaType
              youtubeEmbedLink
              image {
                node {
                  altText
                  sourceUrl
                }
              }
            }
            ... on ComponentsComponentsGalleryLayout {
              fieldGroupName
              gallery {
                nodes {
                  altText
                  sourceUrl
                }
              }
            }
            ... on ComponentsComponentsImageBoxesLayout {
              fieldGroupName
              imageBoxes {
                boxHeadline
                boxDescription
                imageBox {
                  node {
                    altText
                    sourceUrl
                  }
                }
              }
            }
            ... on ComponentsComponentsImageSliderLayout {
              fieldGroupName
              imageSlider {
                nodes {
                  altText
                  sourceUrl
                }
              }
            }
          }
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
        variables: { id: uri },
      }),
      next: { tags: ['wordpress'], revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      throw new Error('GraphQL query failed');
    }

    return result.data?.page || null;
  } catch (error) {
    console.error(`Error fetching page with URI ${uri}:`, error);
    return null;
  }
}

export interface SearchIndexItem {
  id: string;
  title: string;
  slug: string;
  content: string;
  postType: string;
}

/**
 * Získá search index pro fulltext vyhledávání
 * @returns Promise se seznamem položek pro vyhledávání
 */
export async function fetchSearchIndex(): Promise<SearchIndexItem[]> {
  const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'https://pegas.antstudio.dev/cz/graphql';

  const componentsFragment = `
    components {
      components {
        ... on ComponentsComponentsWysiwygLayout {
          editor
        }
      }
    }
  `;

  const query = `
    query GetSearchIndex {
      pages(first: 50) {
        nodes {
          id
          title
          slug
          uri
          ${componentsFragment}
        }
      }
      posts(first: 100) {
        nodes {
          id
          title
          slug
          excerpt
          ${componentsFragment}
        }
      }
      sluzbyPosts(first: 100) {
        nodes {
          id
          title
          slug
          sluzbyAcf {
            introText
          }
          ${componentsFragment}
        }
      }
      referencePosts(first: 100) {
        nodes {
          id
          title
          slug
          referenceACF {
            farewellDate
            farewellPlace
          }
          ${componentsFragment}
        }
      }
      pobockaPosts(first: 100) {
        nodes {
          id
          title
          slug
          pobockyACF {
            city
            openDaysWeekend
            openDaysWorking
            phoneNumber
            email
            parking
            visitUs
            funeralRequirements
            consultant {
              nodes {
                ... on ZamestnanecPost {
                  title
                  zamestnanciACF {
                    employeeEmail
                    positionDescription
                  }
                }
              }
            }
          }
        }
      }
      postupPosts(first: 100) {
        nodes {
          id
          title
          slug
          jakPostupovatAcf {
            topSubtitle
            shortDescription
            bottomSubtitle
          }
          ${componentsFragment}
        }
      }
    }
  `;

  try {
    const response = await fetch(graphqlUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
      next: { tags: ['wordpress'], revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();

    if (json.errors) {
      console.error('GraphQL errors:', JSON.stringify(json.errors, null, 2));
      throw new Error(`GraphQL query failed: ${JSON.stringify(json.errors[0]?.message || json.errors)}`);
    }

    const data = json.data;
    const items: SearchIndexItem[] = [];

    interface ComponentItem {
      editor?: string;
    }
    interface Components {
      components?: ComponentItem[];
    }
    const extractComponentsText = (components?: Components): string => {
      if (!components?.components) return '';
      const texts: string[] = [];
      for (const comp of components.components) {
        if (comp.editor) {
          texts.push(stripHtmlTags(comp.editor));
        }
      }
      return texts.join(' ');
    };

    interface PageNode {
      id: string;
      title: string;
      slug: string;
      uri?: string;
      components?: Components;
    }
    data.pages?.nodes?.forEach((page: PageNode) => {
      items.push({
        id: page.id,
        title: page.title || '',
        slug: page.slug,
        content: extractComponentsText(page.components),
        postType: 'page',
      });
    });

    interface PostNode {
      id: string;
      title: string;
      slug: string;
      excerpt?: string;
      components?: Components;
    }
    data.posts?.nodes?.forEach((post: PostNode) => {
      const contentParts = [stripHtmlTags(post.excerpt || ''), extractComponentsText(post.components)];
      items.push({
        id: post.id,
        title: post.title || '',
        slug: post.slug,
        content: contentParts.filter(Boolean).join(' '),
        postType: 'post',
      });
    });

    interface SluzbyNode {
      id: string;
      title: string;
      slug: string;
      sluzbyAcf?: { introText?: string };
      components?: Components;
    }
    data.sluzbyPosts?.nodes?.forEach((post: SluzbyNode) => {
      const contentParts = [stripHtmlTags(post.sluzbyAcf?.introText || ''), extractComponentsText(post.components)];
      items.push({
        id: post.id,
        title: post.title || '',
        slug: post.slug,
        content: contentParts.filter(Boolean).join(' '),
        postType: 'sluzbyPost',
      });
    });

    interface ReferenceNode {
      id: string;
      title: string;
      slug: string;
      referenceACF?: { farewellDate?: string; farewellPlace?: string };
      components?: Components;
    }
    data.referencePosts?.nodes?.forEach((post: ReferenceNode) => {
      const contentParts = [
        formatFarewellDateTime(post.referenceACF?.farewellDate),
        post.referenceACF?.farewellPlace,
        extractComponentsText(post.components),
      ];
      items.push({
        id: post.id,
        title: post.title || '',
        slug: post.slug,
        content: contentParts.filter(Boolean).join(' '),
        postType: 'referencePost',
      });
    });

    interface ConsultantNode {
      title?: string;
      zamestnanciACF?: {
        employeeEmail?: string;
        positionDescription?: string;
      };
    }
    interface PobockaNode {
      id: string;
      title: string;
      slug: string;
      pobockyACF?: {
        city?: string;
        openDaysWeekend?: string;
        openDaysWorking?: string;
        phoneNumber?: string;
        email?: string;
        parking?: string;
        visitUs?: string;
        funeralRequirements?: string;
        consultant?: {
          nodes?: ConsultantNode[];
        };
      };
    }
    data.pobockaPosts?.nodes?.forEach((post: PobockaNode) => {
      const acf = post.pobockyACF;
      const consultantParts: string[] = [];
      acf?.consultant?.nodes?.forEach((consultant: ConsultantNode) => {
        if (consultant.title) consultantParts.push(consultant.title);
        if (consultant.zamestnanciACF?.positionDescription) {
          consultantParts.push(consultant.zamestnanciACF.positionDescription);
        }
        if (consultant.zamestnanciACF?.employeeEmail) {
          consultantParts.push(consultant.zamestnanciACF.employeeEmail);
        }
      });
      const contentParts = [
        acf?.city,
        acf?.openDaysWeekend,
        acf?.openDaysWorking,
        acf?.phoneNumber,
        acf?.email,
        acf?.parking,
        acf?.visitUs,
        stripHtmlTags(acf?.funeralRequirements || ''),
        ...consultantParts,
      ];
      items.push({
        id: post.id,
        title: post.title || '',
        slug: post.slug,
        content: contentParts.filter(Boolean).join(' '),
        postType: 'pobockaPost',
      });
    });

    interface PostupNode {
      id: string;
      title: string;
      slug: string;
      jakPostupovatAcf?: {
        topSubtitle?: string;
        shortDescription?: string;
        bottomSubtitle?: string;
      };
      components?: Components;
    }
    data.postupPosts?.nodes?.forEach((post: PostupNode) => {
      const acf = post.jakPostupovatAcf;
      const contentParts = [
        acf?.topSubtitle,
        acf?.shortDescription,
        acf?.bottomSubtitle,
        extractComponentsText(post.components),
      ];
      items.push({
        id: post.id,
        title: post.title || '',
        slug: post.slug,
        content: contentParts.filter(Boolean).join(' '),
        postType: 'postupPost',
      });
    });

    return items;
  } catch (error) {
    console.error('Error fetching search index:', error);
    return [];
  }
}
