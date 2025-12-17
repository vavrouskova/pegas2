import Image from 'next/image';

const LeavesImage = () => {
  return (
    <Image
      src='/images/leaves.webp'
      alt='Decorative leaves'
      width={300}
      height={300}
      className='absolute top-5 left-1/2 z-10 h-auto w-[31.8725rem] translate-x-124 -scale-x-100 rotate-260 max-lg:hidden'
    />
  );
};

export default LeavesImage;
