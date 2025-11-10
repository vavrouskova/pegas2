import Image from 'next/image';
import React from 'react';

type FeatherPosition = 'left' | 'right';

interface FeatherStaticProps {
  featherPosition?: FeatherPosition;
}

const FeatherStatic = ({ featherPosition = 'left' }: FeatherStaticProps) => {
  return (
    <div className='absolute top-0 left-0 h-full w-full lg:hidden'>
      {featherPosition === 'right' && (
        <Image
          src='/images/feather2.webp'
          alt='Feather 2'
          width={386}
          height={586}
          className='absolute top-0 right-1/2 z-10 min-w-[17.34569rem] translate-x-[320px] -translate-y-10 -rotate-[75deg]'
        />
      )}
    </div>
  );
};

export default FeatherStatic;
