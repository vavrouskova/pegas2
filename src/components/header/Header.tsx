import { getHeaderMegamenuData } from '@/api/wordpress-api';
import HeaderContent from '@/components/header/HeaderContent';
import { getHeaderLinks, MegamenuData } from '@/utils/data';

const Header = async () => {
  const headerLinks = await getHeaderLinks();
  const megamenuRawData = await getHeaderMegamenuData();

  // Transform GraphQL data to HeaderLink format
  const megamenuData: MegamenuData = {
    services:
      megamenuRawData?.globalACF?.headerSection?.submenuSluzby?.map((item) => ({
        id: item.sluzbyLink.url,
        label: item.sluzbyLink.title,
        href: item.sluzbyLink.url,
      })) || [],
    blog:
      megamenuRawData?.globalACF?.headerSection?.submenuBlog?.map((item) => ({
        id: item.sluzbyLink.url,
        label: item.sluzbyLink.title,
        href: item.sluzbyLink.url,
      })) || [],
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
