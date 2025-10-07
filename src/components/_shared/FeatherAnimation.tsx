'use client';

import { useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

import { MotionDiv } from '@/components/animate-ui/MotionWrappers';
import useMediaQuery from '@/hooks/useMediaQuery';

const FeatherAnimation = () => {
  const isLargeScreen = useMediaQuery('(min-width: 1024px)');
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Animace pro levé pírko - pomalejší
  const leftFeatherY = useTransform(scrollYProgress, [0, 1], [-150, 0]);
  const leftFeatherX = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const leftFeatherRotate = useTransform(scrollYProgress, [0, 1], [0, 20]);

  // Animace pro pravé pírko - rychlejší
  const rightFeatherY = useTransform(scrollYProgress, [0, 1], [-500, -100]);
  const rightFeatherX = useTransform(scrollYProgress, [0, 1], [150, 100]);
  const rightFeatherRotate = useTransform(scrollYProgress, [0, 1], [20, -10]);
  const rightFeatherScale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);

  return (
    <div
      ref={containerRef}
      className='absolute top-0 left-0 h-full w-full'
    >
      {isLargeScreen && (
        <>
          {/* Levé pírko */}
          <MotionDiv
            className='absolute top-3/4 left-1/2 z-10 -translate-x-[700px]'
            style={{
              y: leftFeatherY,
              x: leftFeatherX,
              rotate: leftFeatherRotate,
            }}
          >
            <Image
              src='/images/feather1.webp'
              alt='Feather 1'
              width={80}
              height={120}
              className='h-[11.08013rem] w-[16.822rem] shrink-0'
            />
          </MotionDiv>

          {/* Pravé pírko */}
          <MotionDiv
            className='absolute top-1/2 right-1/2 z-10 translate-x-[700px]'
            style={{
              y: rightFeatherY,
              x: rightFeatherX,
              rotate: rightFeatherRotate,
              scale: rightFeatherScale,
            }}
          >
            <Image
              src='/images/feather2.webp'
              alt='Feather 2'
              width={386}
              height={586}
              className='h-[36.62163rem] w-[24.1215rem] shrink-0 rotate-[-77.654deg] mix-blend-darken blur-[9.5px]'
            />
          </MotionDiv>
        </>
      )}
    </div>
  );
};

export default FeatherAnimation;
