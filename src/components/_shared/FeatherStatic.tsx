import Image from 'next/image';
import React from 'react';

const FeatherStatic = () => {
  return (
    <div className='absolute top-0 left-0 h-full w-full lg:hidden'>
      <Image
        src='/images/feather1.webp'
        alt='Feather 1'
        width={80}
        height={120}
        className='absolute bottom-0 left-0 z-10 h-[15.73919rem] w-[23.8955rem] min-w-[23.8955rem] shrink-0 -translate-x-1/3'
      />

      <Image
        src='/images/feather2.webp'
        alt='Feather 2'
        width={386}
        height={586}
        className='absolute top-0 right-1/2 z-10 h-[50.18038rem] min-h-[50.18038rem] min-w-[33.05225rem] shrink-0 translate-x-[400px] -translate-y-36 rotate-[-77.654deg] mix-blend-darken blur-[7px]'
      />
    </div>
  );
};

export default FeatherStatic;
