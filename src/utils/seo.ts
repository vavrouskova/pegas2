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
type ContentType = 'page' | 'post' | 'referencePost' | 'sluzbyPost' | 'pobockaPost' | 'postupPost';

/**
 * Taxonomy type for fetching SEO data from categories
 */
type TaxonomyType = 'category' | 'typReference';

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
  if (name === 'referencePost') return 'ReferencePostIdType';
  if (name === 'sluzbyPost') return 'SluzbyPostIdType';
  if (name === 'pobockaPost') return 'PobockaPostIdType';
  if (name === 'postupPost') return 'PostupPostIdType';
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
    postupPost: 'postupPost',
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
      next: { tags: ['wordpress'], revalidate },
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
 * Determine the ID type for GraphQL query based on taxonomy type
 */
function getTaxonomyIdTypeForQuery(name: string): string {
  if (name === 'category') return 'CategoryIdType';
  if (name === 'typReference') return 'TypReferenceIdType';
  return 'ID';
}

/**
 * Fetches SEO data from WordPress GraphQL API for taxonomy terms (categories)
 */
async function fetchTaxonomySeoData(
  taxonomyType: TaxonomyType,
  slug: string,
  revalidate = 0
): Promise<WordPressSeoData | null> {
  const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL;

  if (!graphqlUrl) {
    console.error('NEXT_PUBLIC_GRAPHQL_URL is not defined');
    return null;
  }

  const query = `
    query GetTaxonomySeoData($slug: ID!, $idType: ${getTaxonomyIdTypeForQuery(taxonomyType)}!) {
      ${taxonomyType}(id: $slug, idType: $idType) {
        seo {
          canonical
          metaDesc
          metaRobotsNofollow
          metaRobotsNoindex
          opengraphDescription
          opengraphSiteName
          opengraphTitle
          opengraphType
          opengraphUrl
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
          slug,
          idType: 'SLUG',
        },
      }),
      next: { tags: ['wordpress'], revalidate },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      throw new Error('GraphQL query failed');
    }

    return result.data?.[taxonomyType]?.seo || null;
  } catch (error) {
    console.error('Error fetching taxonomy SEO data:', error);
    return null;
  }
}

/**
 * Rewrites backend WordPress URLs to frontend URLs
 */
function rewriteToFrontendUrl(url?: string): string | undefined {
  if (!url) return url;

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, '');
  const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL?.replace(/\/$/, '');

  if (!backendUrl || !frontendUrl) return url;

  return url.replace(backendUrl, frontendUrl);
}

/**
 * Content types served directly under /[slug]/ on the frontend.
 * WordPress uses CPT prefixes (e.g. /sluzba/, /reference/) that don't exist on the frontend.
 */
const SLUG_BASED_CONTENT_TYPES = new Set<ContentType>([
  'post',
  'referencePost',
  'sluzbyPost',
  'pobockaPost',
  'postupPost',
]);

/**
 * Builds a canonical URL for content served under /[slug]/ on the frontend.
 * This bypasses the WordPress canonical which includes CPT path prefixes.
 */
function buildSlugCanonical(slug: string): string | undefined {
  const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL?.replace(/\/$/, '');
  if (!frontendUrl) return undefined;
  return `${frontendUrl}/${slug}/`;
}

/**
 * Default metadata fallback
 */
function getDefaultMetadata(): Metadata {
  return {
    applicationName: process.env.NEXT_PUBLIC_APP_NAME || 'Pegas',
    icons: '/favicon.ico',
    title: 'Stránka nenalezena | Pegas',
    description: 'Stránka, kterou hledáte, neexistuje.',
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
  const isProduction = process.env.APP_ENV === 'production';
  const isNoIndex = !isProduction || seoData.metaRobotsNoindex === 'noindex';
  const isNoFollow = !isProduction || seoData.metaRobotsNofollow === 'nofollow';

  const isSlugBased = SLUG_BASED_CONTENT_TYPES.has(options.contentType) && options.idType === 'SLUG';
  const frontendUrl = isSlugBased ? buildSlugCanonical(String(options.id)) : rewriteToFrontendUrl(seoData.canonical);

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
      canonical: frontendUrl,
    },
    openGraph: {
      type: (seoData.opengraphType as any) || 'website',
      title: seoData.opengraphTitle,
      description: seoData.opengraphDescription,
      url: isSlugBased ? frontendUrl : rewriteToFrontendUrl(seoData.opengraphUrl),
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

/**
 * Helper function for fetching SEO data by slug
 */
export async function getSeoDataBySlug(contentType: ContentType, slug: string, revalidate?: number): Promise<Metadata> {
  return getSeoData({
    contentType,
    id: slug,
    idType: 'SLUG',
    revalidate,
  });
}

/**
 * Builds a canonical URL for a taxonomy category page on the frontend.
 */
function buildCategoryCanonical(pathPrefix: string, slug: string): string | undefined {
  const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL?.replace(/\/$/, '');
  if (!frontendUrl) return undefined;
  return `${frontendUrl}/${pathPrefix}/${slug}/`;
}

/**
 * Converts WordPress taxonomy SEO data to Next.js Metadata format
 */
function convertTaxonomySeoToMetadata(seoData: WordPressSeoData | null, canonicalUrl?: string): Metadata {
  const isProduction = process.env.APP_ENV === 'production';

  if (!seoData) {
    return {
      ...getDefaultMetadata(),
      robots: { index: isProduction, follow: isProduction },
      alternates: { canonical: canonicalUrl },
    };
  }

  return {
    applicationName: process.env.NEXT_PUBLIC_APP_NAME || 'Pegas',
    icons: '/favicon.ico',
    title: seoData.title || seoData.opengraphTitle,
    description: seoData.metaDesc,
    robots: {
      index: isProduction,
      follow: isProduction,
    },
    authors: [
      {
        name: '(ant)',
        url: 'https://antstudio.cz',
      },
    ],
    alternates: {
      canonical: canonicalUrl ?? rewriteToFrontendUrl(seoData.canonical),
    },
    openGraph: {
      type: (seoData.opengraphType as any) || 'website',
      title: seoData.opengraphTitle,
      description: seoData.opengraphDescription,
      url: canonicalUrl ?? rewriteToFrontendUrl(seoData.opengraphUrl),
      siteName: seoData.opengraphSiteName,
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

export async function getBlogCategorySeoBySlug(slug: string, revalidate?: number): Promise<Metadata> {
  const seoData = await fetchTaxonomySeoData('category', slug, revalidate);
  const canonicalUrl = buildCategoryCanonical('blog', slug);
  return convertTaxonomySeoToMetadata(seoData, canonicalUrl);
}

export async function getReferenceCategorySeoBySlug(slug: string, revalidate?: number): Promise<Metadata> {
  const seoData = await fetchTaxonomySeoData('typReference', slug, revalidate);
  const canonicalUrl = buildCategoryCanonical('reference', slug);
  return convertTaxonomySeoToMetadata(seoData, canonicalUrl);
}
