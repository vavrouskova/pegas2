import StickyHeader from '@/components/header/StickyHeader';
import { getHeaderLinks } from '@/utils/data';

const StickyHeaderWrapper = async () => {
  const headerLinks = await getHeaderLinks();

  return <StickyHeader headerLinks={headerLinks} />;
};

export default StickyHeaderWrapper;
