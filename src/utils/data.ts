import { getTranslations } from 'next-intl/server';

export const EMPTY_DATA = null;

export const getHeaderLinks = async () => {
  const tHeader = await getTranslations('header');
  const tRoutes = await getTranslations('routes');

  return [
    {
      label: tHeader('how-to-proceed'),
      href: tRoutes('how-to-proceed'),
    },
    {
      label: tHeader('services'),
      href: tRoutes('services'),
    },
    {
      label: tHeader('organized-by-us'),
      href: tRoutes('organized-by-us'),
    },
    {
      label: tHeader('media'),
      href: tRoutes('media'),
    },
    {
      label: tHeader('about-us'),
      href: tRoutes('about-us'),
    },
    {
      label: tHeader('contacts'),
      href: tRoutes('contacts'),
    },
  ];
};

export const getFooterLinks = async () => {
  const tFooter = await getTranslations('footer');
  const tRoutes = await getTranslations('routes');

  return [
    {
      label: tFooter('how-to-proceed'),
      href: tRoutes('how-to-proceed'),
    },
  ];
};
