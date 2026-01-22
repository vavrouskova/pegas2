import { getHeaderMegamenuData } from '@/api/wordpress-api';
import StickyHeader from '@/components/header/StickyHeader';
import { getHeaderLinks, MegamenuData } from '@/utils/data';

const StickyHeaderWrapper = async () => {
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
    <StickyHeader
      headerLinks={headerLinks}
      megamenuData={megamenuData}
    />
  );
};

export default StickyHeaderWrapper;
