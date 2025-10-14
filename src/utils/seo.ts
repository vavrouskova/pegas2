import { Metadata } from 'next';

/**
 * SEO data interface from WordPress GraphQL (Yoast SEO)
 */
interface WordPressSeoData {
  canonical?: string;
  cornerstone?: boolean;
  focuskw?: string;
  fullHead?: string;
  metaDesc?: string;
  metaKeywords?: string;
  metaRobotsNofollow?: string;
  metaRobotsNoindex?: string;
  opengraphAuthor?: string;
  opengraphDescription?: string;
  opengraphModifiedTime?: string;
  opengraphPublishedTime?: string;
  opengraphPublisher?: string;
  opengraphSiteName?: string;
  opengraphTitle?: string;
  opengraphType?: string;
  opengraphUrl?: string;
  readingTime?: number;
  title?: string;
  twitterDescription?: string;
  twitterTitle?: string;
  opengraphImage?: {
    sourceUrl?: string;
    mediaDetails?: {
      width?: number;
      height?: number;
    };
    altText?: string;
  };
  twitterImage?: {
    sourceUrl?: string;
  };
}

/**
 * Content type for fetching SEO data
 */
type ContentType = 'page' | 'post' | 'referencePost' | 'sluzbyPost' | 'pobockaPost';

/**
 * ID type for querying WordPress content
 */
type IdType = 'DATABASE_ID' | 'SLUG' | 'URI';

/**
 * Options for fetching SEO data
 */
interface GetSeoDataOptions {
  /** Content type to fetch (page, post, etc.) */
  contentType: ContentType;
  /** ID or identifier of the content */
  id: string | number;
  /** Type of ID being used */
  idType?: IdType;
  revalidate?: number;
}

/**
 * Determine the ID type for GraphQL query based on content type
 */
function getIdTypeForQuery(name: string): string {
  if (name === 'page') return 'PageIdType';
  if (name === 'post') return 'PostIdType';
  return 'ID';
}

/**
 * Fetches SEO data from WordPress GraphQL API
 */
async function fetchSeoData(options: GetSeoDataOptions): Promise<WordPressSeoData | null> {
  const { contentType, id, idType = 'DATABASE_ID', revalidate = 0 } = options;
  const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL;

  if (!graphqlUrl) {
    console.error('NEXT_PUBLIC_GRAPHQL_URL is not defined');
    return null;
  }

  // Map content types to GraphQL query names
  const contentTypeMap: Record<ContentType, string> = {
    page: 'page',
    post: 'post',
    referencePost: 'referencePost',
    sluzbyPost: 'sluzbyPost',
    pobockaPost: 'pobockaPost',
  };

  const queryName = contentTypeMap[contentType];

  const query = `
    query GetSeoData($id: ID!, $idType: ${getIdTypeForQuery(queryName)}!) {
      ${queryName}(id: $id, idType: $idType) {
        seo {
          canonical
          cornerstone
          focuskw
          fullHead
          metaDesc
          metaKeywords
          metaRobotsNofollow
          metaRobotsNoindex
          opengraphAuthor
          opengraphDescription
          opengraphModifiedTime
          opengraphPublishedTime
          opengraphPublisher
          opengraphSiteName
          opengraphTitle
          opengraphType
          opengraphUrl
          readingTime
          title
          twitterDescription
          twitterTitle
          opengraphImage {
            sourceUrl
            mediaDetails {
              width
              height
            }
            altText
          }
          twitterImage {
            sourceUrl
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
          id: String(id),
          idType,
        },
      }),
      next: { revalidate },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      throw new Error('GraphQL query failed');
    }

    return result.data?.[queryName]?.seo || null;
  } catch (error) {
    console.error('Error fetching SEO data:', error);
    return null;
  }
}

/**
 * Default metadata fallback
 */
function getDefaultMetadata(): Metadata {
  return {
    applicationName: process.env.NEXT_PUBLIC_APP_NAME || 'Pegas',
    icons: '/favicon.ico',
    title: 'Pegas',
    description: 'Default description',
    robots: {
      index: false,
      follow: false,
    },
    authors: [
      {
        name: '(ant)',
        url: 'https://antstudio.cz',
      },
    ],
  };
}

/**
 * Converts WordPress SEO data to Next.js Metadata format
 */
export async function getSeoData(options: GetSeoDataOptions): Promise<Metadata> {
  const seoData = await fetchSeoData(options);

  // Return default metadata if fetch failed
  if (!seoData) {
    return getDefaultMetadata();
  }

  // Parse robots directives
  const isNoIndex = seoData.metaRobotsNoindex === 'noindex';
  const isNoFollow = seoData.metaRobotsNofollow === 'nofollow';

  return {
    applicationName: process.env.NEXT_PUBLIC_APP_NAME || 'Pegas',
    icons: '/favicon.ico',
    title: seoData.title || seoData.opengraphTitle,
    description: seoData.metaDesc,
    robots: {
      index: !isNoIndex,
      follow: !isNoFollow,
    },
    authors: [
      {
        name: '(ant)',
        url: 'https://antstudio.cz',
      },
    ],
    alternates: {
      canonical: seoData.canonical,
    },
    openGraph: {
      type: (seoData.opengraphType as any) || 'website',
      title: seoData.opengraphTitle,
      description: seoData.opengraphDescription,
      url: seoData.opengraphUrl,
      siteName: seoData.opengraphSiteName,
      modifiedTime: seoData.opengraphModifiedTime,
      publishedTime: seoData.opengraphPublishedTime,
      images: seoData.opengraphImage?.sourceUrl
        ? [
            {
              url: seoData.opengraphImage.sourceUrl,
              width: seoData.opengraphImage.mediaDetails?.width,
              height: seoData.opengraphImage.mediaDetails?.height,
              alt: seoData.opengraphImage.altText,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: seoData.twitterTitle,
      description: seoData.twitterDescription,
      images: seoData.twitterImage?.sourceUrl
        ? [
            {
              url: seoData.twitterImage.sourceUrl,
            },
          ]
        : undefined,
    },
  };
}

/**
 * Helper function for fetching SEO data by database ID
 */
export async function getSeoDataById(contentType: ContentType, id: number, revalidate?: number): Promise<Metadata> {
  return getSeoData({
    contentType,
    id,
    idType: 'DATABASE_ID',
    revalidate,
  });
}

/**
 * Helper function for fetching SEO data by URI
 */
export async function getSeoDataByUri(contentType: ContentType, uri: string, revalidate?: number): Promise<Metadata> {
  return getSeoData({
    contentType,
    id: uri,
    idType: 'URI',
    revalidate,
  });
}
