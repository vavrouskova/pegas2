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
 * Získá homepage data s vybranými reference posty z ACF
 * @returns Promise s homepage daty
 */
export async function getHomepageWithSelectedPosts() {
  const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'https://pegas.antstudio.dev/cz/graphql';

  const query = `
    query GetHomepage {
      page(id: "5", idType: DATABASE_ID) {
        id
        databaseId
        title
        homepageACF {
          selectedPosts {
            nodes {
              ... on ReferencePost {
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
                referenceACF {
                  farewellDate
                  farewellPlace
                  description
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
