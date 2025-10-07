// Původní typy (zachováno z původního souboru)
export type ParametersType = {
  [key: string]: string | number | string[] | number[] | unknown;
};

export interface LinkInterface {
  title: string;
  url: string;
  target: string | null;
}

export interface ClassNameProps {
  className?: string;
}

export interface Category {
  id: number | string;
  name: string;
  link?: string;
}

export interface WordPressImage {
  url: string;
  alt: string | null;
  width: number;
  height: number;
}

export interface YoastData {
  title: string;
  description: string;
  robots: {
    index: string;
    follow: string;
    'max-snippet': string;
    'max-image-preview': string;
    'max-video-preview': string;
  };
  og_locale: string;
  og_type: string;
  og_title: string;
  og_url: string;
  og_site_name: string;
  article_modified_time: string;
  og_image: {
    width: number;
    height: number;
    url: string;
    type: string;
  }[];
  schema: Record<string, any>;
  twitter: {
    card: 'summary' | 'summary_large_image' | 'player' | 'app';
    title: string;
    description: string;
    image: string;
    label1: string;
    data1: string;
    label2: string;
    data2: string;
  };
}

// Nové typy (přidáno při refactoringu)
export interface BaseContentProps {
  title: string;
  description: string;
  buttonText: string;
  link: string;
  className?: string;
}

export interface ImageProps {
  src: string;
  alt: string;
}

export interface CarouselItemBase {
  id: number;
  title: string;
  image: string;
  link: string;
}
