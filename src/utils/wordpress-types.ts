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
  introImage?: {
    node: {
      sourceUrl: string;
      altText?: string;
    };
  };
  gallery?: {
    nodes: Array<{
      sourceUrl?: string;
      altText?: string;
    }>;
  };
}

// Reference Taxonomy Types
export interface ReferenceCategory {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
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
  components?: BlogComponents;
  typReference?: {
    nodes: ReferenceCategory[];
  };
}

// Sluzby (Services) Taxonomy Types
export interface TypSluzbyNode {
  name: string;
  slug: string;
}

export interface TypSluzby {
  nodes: TypSluzbyNode[];
}

// Sluzby (Services) Types
export interface SluzbyPost {
  id: string;
  databaseId: number;
  title: string;
  slug: string;
  featuredImage?: MediaItemEdge;
  typSluzby?: TypSluzby;
}

// Pobocky (Branches) ACF Types
export interface PobockyACF {
  city?: string;
  openSwitcher?: boolean;
  showRoom?: boolean;
  dateCloseFrom?: string;
  dateCloseTo?: string;
  openDaysWeekend?: string;
  openDaysWorking?: string;
  phoneNumber?: string;
  parking?: string;
  gPS?: string;
  closeAccouncment?: string;
  funeralRequirements?: string;
  visitUs?: string;
  wheelchairAccess?: boolean;
  email?: string;
  internalImage?: {
    node: {
      altText: string;
      sourceUrl: string;
    };
  };
  consultant?: {
    nodes: ZamestnanciPost[];
  };
}

// Pobocky (Branches) Types
export interface PobockaPost {
  id: string;
  databaseId: number;
  title: string;
  slug: string;
  featuredImage?: {
    node: {
      altText: string;
      sourceUrl: string;
    };
  };
  pobockyACF?: PobockyACF;
}

// Homepage ACF Types
export interface HomepageACF {
  selectedReference?: {
    nodes: ReferencePost[];
  };
  selectedSluzby?: {
    nodes: SluzbyPost[];
  };
}

export interface HomepageData {
  id: string;
  databaseId: number;
  title: string;
  homepageACF?: HomepageACF;
}

// About Us (O Nas) ACF Types
export interface TimelineItem {
  description?: string;
  fieldGroupName?: string;
  titulek?: string;
  year?: number;
  image?: MediaItemEdge;
}

export interface ONasACF {
  timeline?: TimelineItem[];
}

export interface AboutUsPageData {
  id: string;
  databaseId?: number;
  oNasACF?: ONasACF;
}

// Zamestnanci (Employees) ACF Types
export interface ZamestnanciACF {
  positionDescription?: string;
  positonType?: string[];
  employeeQuote?: string;
  employeeEmail?: string;
  profileImage?: {
    node: {
      altText: string;
      sourceUrl: string;
    };
  };
}

export interface ZamestnanciPost {
  id: string;
  databaseId?: number;
  title?: string;
  zamestnanciACF?: ZamestnanciACF;
}

// Blog Category Types
export interface BlogCategory {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
}

// Blog Post Component Types (ACF)
export interface WysiwygComponent {
  fieldGroupName: 'ComponentsComponentsWysiwygLayout';
  editor: string;
}

export interface MediaComponent {
  fieldGroupName: 'ComponentsComponentsMediaLayout';
  mediaType: 'image' | 'youtube' | string[] | string;
  youtubeEmbedLink?: string | null;
  image?: {
    node: {
      altText?: string;
      sourceUrl?: string;
    };
  };
}

export interface GalleryComponent {
  fieldGroupName: 'ComponentsComponentsGalleryLayout';
  gallery?: {
    nodes: Array<{
      altText?: string;
      sourceUrl?: string;
    }>;
  };
}

export type BlogComponent = WysiwygComponent | MediaComponent | GalleryComponent;

export interface BlogComponents {
  components?: BlogComponent[];
}

// Blog Post Types
export interface BlogPost {
  id: string;
  databaseId: number;
  title: string;
  slug: string;
  excerpt?: string;
  featuredImage?: MediaItemEdge;
  categories?: {
    nodes: BlogCategory[];
  };
}

// Blog Post Detail Types (with content and components)
export interface BlogPostDetail extends BlogPost {
  content?: string;
  date?: string;
  components?: BlogComponents;
}
