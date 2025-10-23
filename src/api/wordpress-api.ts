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
      cache: 'no-store',
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
