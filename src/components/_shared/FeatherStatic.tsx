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
        className='absolute bottom-30 left-0 z-10 h-[11.08013rem] w-[16.822rem] min-w-[16.822rem] shrink-0 -translate-x-1/2'
      />

      <Image
        src='/images/feather2.webp'
        alt='Feather 2'
        width={386}
        height={586}
        className='absolute top-0 right-1/2 z-10 h-[36.62163rem] min-h-[36.62163rem] min-w-[24.1215rem] shrink-0 translate-x-[300px] rotate-[-77.654deg] mix-blend-darken blur-[9.5px]'
      />
    </div>
  );
};

export default FeatherStatic;
