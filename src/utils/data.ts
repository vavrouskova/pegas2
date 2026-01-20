import { getTranslations } from 'next-intl/server';

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
