import { getTranslations } from 'next-intl/server';

import { getHeaderMegamenuData } from '@/api/wordpress-api';
import HeaderContent from '@/components/header/HeaderContent';
import { getHeaderLinks, MegamenuData } from '@/utils/data';

const Header = async () => {
  const headerLinks = await getHeaderLinks();
  const megamenuRawData = await getHeaderMegamenuData();
  const tHeader = await getTranslations('header');
  const tRoutes = await getTranslations('routes');

  // Transform GraphQL data to HeaderLink format
  const megamenuData: MegamenuData = {
    services:
      megamenuRawData?.globalACF?.headerSection?.submenuSluzby
        ?.filter((item) => item.sluzbyLink?.url)
        .map((item) => ({
          id: item.sluzbyLink.url,
          label: item.sluzbyLink.title,
          href: item.sluzbyLink.url,
        })) || [],
    blog:
      megamenuRawData?.globalACF?.headerSection?.submenuBlog
        ?.filter((item) => item.sluzbyLink?.url)
        .map((item) => ({
          id: item.sluzbyLink.url,
          label: item.sluzbyLink.title,
          href: item.sluzbyLink.url,
        })) || [],
    references: [
      {
        id: 'wrote-about-us',
        label: tHeader('references-wrote-about-us'),
        href: `/${tRoutes('references-wrote-about-us')}`,
      },
      {
        id: 'organized',
        label: tHeader('references-organized'),
        href: `/${tRoutes('references')}`,
      },
    ],
  };

  return (
    <header className='relative z-50 mx-auto max-w-378 px-4 py-2 lg:mt-6 lg:px-12 lg:py-4'>
      <div className='flex w-full items-end justify-between px-2'>
        <HeaderContent
          headerLinks={headerLinks}
          megamenuData={megamenuData}
        />
      </div>
    </header>
  );
};

export default Header;
