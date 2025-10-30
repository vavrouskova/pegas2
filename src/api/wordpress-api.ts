import type { BlogPost } from '@/utils/wordpress-types';

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
                  description
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
      next: { revalidate: 3600 },
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
export async function getZamestnanciPosts(first = 100) {
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

    return result.data?.categories?.nodes || [];
  } catch (error) {
    console.error('Error fetching blog categories:', error);
    return [];
  }
}

/**
 * Pomocná funkce pro generování mock dat v development módu
 * Duplikuje existující články do požadovaného počtu
 */
function generateMockPosts(originalPosts: BlogPost[], targetCount: number): BlogPost[] {
  if (originalPosts.length === 0) {
    return [];
  }

  const mockPosts: BlogPost[] = [...originalPosts];
  const mockTitles = [
    'Dušičky: datum, tradice a citáty Památky zesnulých',
    'Vzpomínkové verše pro zesnulé: Katalog citátů na parte',
    'Vokovický hřbitov (Praha-Vokovice, Liboc)',
    'Právní záležitosti při úmrtí blízké osoby',
    'Finanční záležitosti po úmrtí člena rodiny',
    'Jak postupovat při organizaci pohřbu',
    'Účast na pohřbu: Etiketa a zvyklosti',
    'Pražské hřbitovy: Přehled a informace',
    'Objednání pohřbu: Krok za krokem',
    'Pohřební obřady: Tradice a moderní přístupy',
    'Kremace vs. pohřeb: Výhody a nevýhody',
    'Životní pojištění a úmrtí',
    'Závěť a dědictví: Právní průvodce',
    'Smuteční květiny: Výběr a symbolika',
    'Pohřební řeč: Jak ji napsat',
    'Hřbitovní pomníky: Výběr a údržba',
    'Zpopelnění a uložení urny',
    'Církevní pohřeb: Organizace a průběh',
    'Občanský pohřeb: Alternativní možnosti',
    'Pohřební průvod: Tradice a organizace',
  ];

  const mockExcerpts = [
    'Dušičky neboli Památka zesnulých jsou tradičním svátkem pro uctění a vzpomínku na naše milované.',
    'Vzpomínkové verše bývají součástí smutečního oznámení a kondolenčních projevů.',
    'Hřbitov se nachází v Praze a nabízí klidné místo pro poslední rozloučení.',
    'Po úmrtí blízké osoby je nutné vyřídit řadu právních formalit.',
    'Finanční záležitosti spojené s úmrtím vyžadují pozornost a organizaci.',
    'Organizace pohřbu je proces, který vyžaduje citlivý přístup.',
    'Účast na pohřbu má svá pravidla a zvyklosti, které je dobré respektovat.',
    'Praha nabízí mnoho hřbitovů s různou historií a atmosférou.',
    'Objednání pohřbu je důležitý krok v procesu rozloučení.',
    'Pohřební obřady mohou být tradiční i moderní, podle přání zesnulého.',
    'Volba mezi kremací a pohřbem závisí na víře a přáních.',
    'Životní pojištění může významně pomoci pozůstalým.',
    'Správně sepsaná závěť ušetří pozůstalým komplikace.',
    'Výběr smutečních květin má svou symboliku a význam.',
    'Pohřební řeč je důležitým způsobem, jak se rozloučit.',
    'Pomník je trvalou vzpomínkou na naše blízké.',
    'Zpopelnění je moderní a ekologická alternativa.',
    'Církevní pohřeb respektuje náboženské tradice.',
    'Občanský pohřeb umožňuje osobnější přístup.',
    'Pohřební průvod je tradiční součást rozloučení.',
  ];

  while (mockPosts.length < targetCount) {
    const basePost = originalPosts[mockPosts.length % originalPosts.length];
    const index = mockPosts.length;
    const mockTitle = mockTitles[index % mockTitles.length];
    const mockExcerpt = mockExcerpts[index % mockExcerpts.length];

    mockPosts.push({
      ...basePost,
      id: `mock-${index}`,
      databaseId: 1000 + index,
      title: mockTitle,
      slug: `mock-clanek-${index}`,
      excerpt: `<p>${mockExcerpt}</p>`,
    });
  }

  return mockPosts;
}

/**
 * Získá seznam blog postů (posts) s podporou filtrování a paginace
 * @param postsPerPage - Počet postů na stránku (výchozí 9)
 * @param page - Číslo stránky (výchozí 1)
 * @param categoryId - ID kategorie pro filtrování (volitelné)
 * @param search - Vyhledávací dotaz (volitelné)
 * @returns Promise s daty blog postů včetně paginace
 */
export async function getBlogPosts(
  postsPerPage = 9,
  page = 1,
  categoryId?: string,
  search?: string
) {
  const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'https://pegas.antstudio.dev/cz/graphql';

  // Pro mock data použijeme GraphQL dotaz bez filtru a filtrování provedeme až po vygenerování
  // Kromě případu, kdy máme categoryId - pak použijeme GraphQL filtr
  const whereClause: Record<string, unknown> = {};
  if (categoryId) {
    whereClause.categoryId = parseInt(categoryId, 10);
  }
  // Search filtrujeme až po mock generování, aby fungoval i na mock data

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
          first: 1000, // Získáme až 1000 postů najednou
          where: finalWhereClause,
        },
      }),
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

    let allNodes = result.data?.posts?.nodes || [];

    // V development módu: pokud máme málo článků a nepoužíváme categoryId filtr,
    // vygenerujeme mock data pro testování
    const isDevelopment = process.env.NODE_ENV === 'development';
    const minPostsForTesting = 20;

    // Mock data generujeme pouze pokud nemáme categoryId filtr (mock data nemají kategorie)
    if (
      isDevelopment &&
      !categoryId &&
      allNodes.length < minPostsForTesting &&
      allNodes.length > 0
    ) {
      allNodes = generateMockPosts(allNodes, minPostsForTesting);
    }

    // Aplikujeme search filtr na všechna data (reálná i mock)
    if (search) {
      const searchLower = search.toLowerCase();
      allNodes = allNodes.filter(
        (post) =>
          post.title.toLowerCase().includes(searchLower) ||
          post.excerpt?.toLowerCase().includes(searchLower)
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
