import { getTranslations } from 'next-intl/server';

import { HeaderLink } from '@/components/header/HeaderContent';

export const EMPTY_DATA = null;

export const getHeaderLinks = async () => {
  const tHeader = await getTranslations('header');
  const tRoutes = await getTranslations('routes');

  return [
    {
      id: 'faq',
      label: tHeader('faq'),
      href: `/${tRoutes('faq')}`,
    },
    {
      id: 'services',
      label: tHeader('services'),
      href: `/${tRoutes('services')}`,
    },
    {
      id: 'references',
      label: tHeader('references'),
      href: `/${tRoutes('references')}`,
    },
    {
      id: 'blog',
      label: tHeader('blog'),
      href: `/${tRoutes('blog')}`,
    },
    {
      id: 'about-us',
      label: tHeader('about-us'),
      href: `/${tRoutes('about-us')}`,
    },
    {
      id: 'contacts',
      label: tHeader('contacts'),
      href: `/${tRoutes('contacts')}`,
    },
  ];
};

export const getFooterLinks = async () => {
  const tFooter = await getTranslations('footer');
  const tRoutes = await getTranslations('routes');

  return [
    {
      label: tFooter('faq'),
      href: `/${tRoutes('faq')}`,
    },
  ];
};

// Type for megamenu data structure passed from server
export interface MegamenuData {
  services: HeaderLink[];
  blog: HeaderLink[];
  references: HeaderLink[];
}

// Helper to get megamenu items by linkId from pre-fetched data
export const getMegamenuItemsFromData = (
  linkId: string,
  megamenuData: MegamenuData | null
): HeaderLink[] | undefined => {
  if (!megamenuData) return undefined;

  if (linkId === 'services') {
    return megamenuData.services.length > 0 ? megamenuData.services : undefined;
  }
  if (linkId === 'blog') {
    return megamenuData.blog.length > 0 ? megamenuData.blog : undefined;
  }
  if (linkId === 'references') {
    return megamenuData.references.length > 0 ? megamenuData.references : undefined;
  }

  return undefined;
};
