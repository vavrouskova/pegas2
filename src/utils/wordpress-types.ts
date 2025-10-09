// WordPress GraphQL Types

export interface MediaItem {
  id: string;
  sourceUrl: string;
  altText: string;
  mediaDetails: {
    width: number;
    height: number;
  };
}

export interface MediaItemEdge {
  node: MediaItem;
}

// Reference Posts ACF Types
export interface ReferenceACF {
  farewellDate?: string;
  farewellPlace?: string;
  description?: string;
}

// Reference Posts Types
export interface ReferencePost {
  id: string;
  databaseId: number;
  title: string;
  slug: string;
  link: string;
  date: string;
  excerpt?: string;
  featuredImage?: MediaItemEdge;
  referenceACF?: ReferenceACF;
}

// Sluzby (Services) Types
export interface SluzbyPost {
  id: string;
  databaseId: number;
  title: string;
  slug: string;
  link: string;
  featuredImage?: MediaItemEdge;
}

// Homepage ACF Types
export interface HomepageACF {
  selectedReference?: {
    nodes: ReferencePost[];
  };
}

export interface HomepageData {
  id: string;
  databaseId: number;
  title: string;
  homepageACF?: HomepageACF;
}
