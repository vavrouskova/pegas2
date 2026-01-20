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

// Dummy data for megamenu - will be replaced with GraphQL data later
export const getMegamenuItems = (linkId: string): HeaderLink[] | undefined => {
  const megamenuData: Record<string, HeaderLink[]> = {
    services: [
      { id: 'all-services', label: 'Všechny služby', href: '/sluzby' },
      { id: 'prevoz', label: 'Převoz zesnulých', href: '/sluzby/prevoz-zesnulych' },
      { id: 'smutecni', label: 'Smuteční obřady', href: '/sluzby/smutecni-obrady' },
      { id: 'doplnkove', label: 'Doplňkové služby a produky', href: '/sluzby/doplnkove-sluzby' },
      { id: 'vazby', label: 'Vazby květin', href: '/sluzby/vazby-kvetin' },
      { id: 'mista', label: 'Místa rozloučení', href: '/sluzby/mista-rozlouceni' },
    ],
    blog: [
      { id: 'all-blog', label: 'Všechny články', href: '/blog' },
      { id: 'rady', label: 'Rady a tipy', href: '/blog/kategorie/rady-a-tipy' },
      { id: 'novinky', label: 'Novinky', href: '/blog/kategorie/novinky' },
    ],
  };

  return megamenuData[linkId];
};
