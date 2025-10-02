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

export const getBranchOffices = () => {
  return [
    {
      id: 1,
      city: 'Praha 2',
      address: 'Kateřinská 1521/13',
      isNonStop: true,
      url: '#',
    },
    {
      id: 2,
      city: 'Praha 2',
      address: 'Kateřinská 1541/5',
      url: '#',
    },
    {
      id: 3,
      city: 'Praha 3',
      address: 'U Vinohradské nemocnice 2',
      isNonStop: true,
      url: '#',
    },
    {
      id: 4,
      city: 'Praha 4',
      address: 'Jarníkova 1903',
      url: '#',
    },
    {
      id: 5,
      city: 'Praha 4',
      address: 'Pod Višňovkou 1661/35',
      url: '#',
    },
    {
      id: 6,
      city: 'Praha 5',
      address: 'V Úvalu 87/18',
      isNonStop: true,
      url: '#',
    },
    {
      id: 7,
      city: 'Praha 6',
      address: 'Bělohorská 688/165',
      url: '#',
    },
    {
      id: 8,
      city: 'Praha 8',
      address: 'Budínova 1564/6',
      isNonStop: true,
      url: '#',
    },
    {
      id: 9,
      city: 'Praha 8',
      address: 'Budínova 2366/2d',
      url: '#',
    },
    {
      id: 10,
      city: 'Praha 8',
      address: 'Katovická 411/4',
      url: '#',
    },
    {
      id: 11,
      city: 'Praha 9',
      address: 'Chlumecká 1677',
      url: '#',
    },
    {
      id: 12,
      city: 'Praha 10',
      address: 'Oblouková 766/16',
      url: '#',
    },
    {
      id: 13,
      city: 'Mnichovice',
      address: 'Mirošovická 704',
      url: '#',
    },
  ];
};
