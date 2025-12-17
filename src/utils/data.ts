import { getTranslations } from 'next-intl/server';

export const EMPTY_DATA = null;

export const getHeaderLinks = async () => {
  const tHeader = await getTranslations('header');
  const tRoutes = await getTranslations('routes');

  return [
    {
      label: tHeader('faq'),
      href: `/${tRoutes('faq')}`,
    },
    {
      label: tHeader('services'),
      href: `/${tRoutes('services')}`,
    },
    {
      label: tHeader('references'),
      href: `/${tRoutes('references')}`,
    },
    {
      label: tHeader('blog'),
      href: `/${tRoutes('blog')}`,
    },
    {
      label: tHeader('about-us'),
      href: `/${tRoutes('about-us')}`,
    },
    {
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
