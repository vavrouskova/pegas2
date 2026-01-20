import HeaderContent from '@/components/header/HeaderContent';
import { getHeaderLinks } from '@/utils/data';

const Header = async () => {
  const headerLinks = await getHeaderLinks();

  return (
    <header className='relative z-20 mx-auto max-w-378 px-4 py-2 lg:mt-6 lg:px-12 lg:py-4'>
      <div className='flex w-full items-end justify-between px-2'>
        <HeaderContent headerLinks={headerLinks} />
      </div>
    </header>
  );
};

export default Header;
