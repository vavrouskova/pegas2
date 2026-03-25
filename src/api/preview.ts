import type { BlogPostDetail, PobockaPost, PostupPost } from '@/utils/wordpress-types';

/**
 * Preview post types matching WPGraphQL field names
 */
export type PreviewPostType = 'post' | 'referencePost' | 'sluzbyPost' | 'pobockaPost' | 'postupPost';

const VALID_PREVIEW_TYPES: PreviewPostType[] = ['post', 'referencePost', 'sluzbyPost', 'pobockaPost', 'postupPost'];

export const isValidPreviewType = (type: string): type is PreviewPostType =>
  VALID_PREVIEW_TYPES.includes(type as PreviewPostType);

// ---------------------------------------------------------------------------
// JWT Authentication
// ---------------------------------------------------------------------------

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAuthToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }

  const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL;
  const username = process.env.WP_PREVIEW_USER;
  const password = process.env.WP_PREVIEW_PASSWORD;

  if (!graphqlUrl || !username || !password) {
    throw new Error('Missing preview environment variables (NEXT_PUBLIC_GRAPHQL_URL, WP_PREVIEW_USER, WP_PREVIEW_PASSWORD)');
  }

  const mutation = `
    mutation Login($username: String!, $password: String!) {
      login(input: { username: $username, password: $password }) {
        authToken
      }
    }
  `;

  const response = await fetch(graphqlUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: mutation, variables: { username, password } }),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`JWT login failed with status ${response.status}`);
  }

  const result = await response.json();

  if (result.errors) {
    throw new Error(`JWT login GraphQL error: ${result.errors[0]?.message ?? 'Unknown error'}`);
  }

  const token = result.data?.login?.authToken;
  if (!token) {
    throw new Error('JWT login returned no token');
  }

  // Cache for 4 minutes (WPGraphQL JWT Auth default expiry is 5 min)
  cachedToken = { token, expiresAt: Date.now() + 4 * 60 * 1000 };
  return token;
}

// ---------------------------------------------------------------------------
// Authenticated GraphQL Fetch
// ---------------------------------------------------------------------------

async function fetchGraphQLPreview<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const token = await getAuthToken();
  const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL;

  if (!graphqlUrl) {
    throw new Error('NEXT_PUBLIC_GRAPHQL_URL is not defined');
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  const previewKey = process.env.GRAPHQL_PREVIEW_KEY;
  if (previewKey) {
    headers['X-Preview-Key'] = previewKey;
  }

  const response = await fetch(graphqlUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Preview GraphQL fetch failed with status ${response.status}`);
  }

  const result = await response.json();

  if (result.errors) {
    console.error('Preview GraphQL errors:', result.errors);
    throw new Error(`Preview GraphQL query failed: ${result.errors[0]?.message ?? 'Unknown error'}`);
  }

  return result.data as T;
}

// ---------------------------------------------------------------------------
// Shared Components Fragment (used by blog, reference, service, postup)
// ---------------------------------------------------------------------------

const COMPONENTS_FRAGMENT = `
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
      ... on ComponentsComponentsButtonLayout {
        fieldGroupName
        button {
          target
          title
          url
        }
      }
    }
  }
`;

// ---------------------------------------------------------------------------
// Slug Resolver (used by preview API route)
// ---------------------------------------------------------------------------

const GRAPHQL_FIELD_MAP: Record<PreviewPostType, string> = {
  post: 'post',
  referencePost: 'referencePost',
  sluzbyPost: 'sluzbyPost',
  pobockaPost: 'pobockaPost',
  postupPost: 'postupPost',
};

/**
 * Fetches slug and title for a post by database ID. Used by the preview API route
 * to determine where to redirect after enabling Draft Mode.
 */
export async function getPreviewPostById(
  id: number,
  type: PreviewPostType,
): Promise<{ slug: string | null; title: string; databaseId: number; status: string } | null> {
  const field = GRAPHQL_FIELD_MAP[type];

  const query = `
    query GetPreviewPost($id: ID!) {
      ${field}(id: $id, idType: DATABASE_ID) {
        slug
        title
        databaseId
        status
      }
    }
  `;

  const data = await fetchGraphQLPreview<
    Record<string, { slug: string | null; title: string; databaseId: number; status: string } | null>
  >(query, {
    id: String(id),
  });
  return data?.[field] ?? null;
}

// ---------------------------------------------------------------------------
// Preview SEO (authenticated fetch of Yoast data by database ID)
// ---------------------------------------------------------------------------

export interface PreviewSeoData {
  title?: string;
  metaDesc?: string;
  opengraphTitle?: string;
  opengraphDescription?: string;
  opengraphImage?: {
    sourceUrl?: string;
    mediaDetails?: { width?: number; height?: number };
    altText?: string;
  };
}

export async function getPreviewSeoById(
  id: number,
  type: PreviewPostType,
): Promise<PreviewSeoData | null> {
  const field = GRAPHQL_FIELD_MAP[type];

  const query = `
    query GetPreviewSeo($id: ID!) {
      ${field}(id: $id, idType: DATABASE_ID) {
        seo {
          title
          metaDesc
          opengraphTitle
          opengraphDescription
          opengraphImage {
            sourceUrl
            mediaDetails {
              width
              height
            }
            altText
          }
        }
      }
    }
  `;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await fetchGraphQLPreview<Record<string, any>>(query, {
    id: String(id),
  });
  return data?.[field]?.seo ?? null;
}

// ---------------------------------------------------------------------------
// Per-Type Preview Functions
// ---------------------------------------------------------------------------

/**
 * Preview: blog post (mirrors getBlogPostBySlug)
 */
export async function getPreviewBlogPost(id: number): Promise<BlogPostDetail | null> {
  const query = `
    query GetPreviewBlogPost($id: ID!) {
      post(id: $id, idType: DATABASE_ID) {
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
        ${COMPONENTS_FRAGMENT}
      }
    }
  `;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await fetchGraphQLPreview<{ post: any }>(query, { id: String(id) });
  return data?.post ?? null;
}

/**
 * Preview: reference post (mirrors getReferenceBySlug)
 */
export async function getPreviewReference(id: number) {
  const query = `
    query GetPreviewReference($id: ID!) {
      referencePost(id: $id, idType: DATABASE_ID) {
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
        ${COMPONENTS_FRAGMENT}
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await fetchGraphQLPreview<{ referencePost: any }>(query, { id: String(id) });
  return data?.referencePost ?? null;
}

/**
 * Preview: service post (mirrors getServiceBySlug)
 */
export async function getPreviewService(id: number) {
  const query = `
    query GetPreviewService($id: ID!) {
      sluzbyPost(id: $id, idType: DATABASE_ID) {
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
        ${COMPONENTS_FRAGMENT}
      }
    }
  `;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await fetchGraphQLPreview<{ sluzbyPost: any }>(query, { id: String(id) });
  return data?.sluzbyPost ?? null;
}

/**
 * Preview: branch post (mirrors getBranchBySlug)
 */
export async function getPreviewBranch(id: number): Promise<PobockaPost | null> {
  const query = `
    query GetPreviewBranch($id: ID!) {
      pobockaPost(id: $id, idType: DATABASE_ID) {
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await fetchGraphQLPreview<{ pobockaPost: any }>(query, { id: String(id) });
  return data?.pobockaPost ?? null;
}

/**
 * Preview: postup post (mirrors getPostupBySlug)
 */
export async function getPreviewPostup(id: number): Promise<PostupPost | null> {
  const query = `
    query GetPreviewPostup($id: ID!) {
      postupPost(id: $id, idType: DATABASE_ID) {
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
        ${COMPONENTS_FRAGMENT}
      }
    }
  `;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await fetchGraphQLPreview<{ postupPost: any }>(query, { id: String(id) });
  return data?.postupPost ?? null;
}
