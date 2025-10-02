'use client';

import { useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

import { MotionDiv } from '@/components/animate-ui/MotionWrappers';

const FeatherAnimation = () => {
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
  const rightFeatherRotate = useTransform(scrollYProgress, [0, 1], [0, -10]);

  return (
    <div
      ref={containerRef}
      className='absolute top-0 left-0 h-full w-full'
    >
      {/* Levé pírko */}
      <MotionDiv
        className='absolute top-1/2 left-0 z-10'
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
          style={{
            height: '11.08013rem',
            width: '16.822rem',
            flexShrink: 0,
            aspectRatio: '177.28/269.15',
          }}
        />
      </MotionDiv>

      {/* Pravé pírko */}
      <MotionDiv
        className='absolute top-1/2 right-0 z-10'
        style={{
          y: rightFeatherY,
          x: rightFeatherX,
          rotate: rightFeatherRotate,
        }}
      >
        <Image
          src='/images/feather2.webp'
          alt='Feather 2'
          width={386}
          height={586}
          style={{
            width: '24.1215rem',
            height: '36.62163rem',
            transform: 'rotate(-77.654deg)',
            flexShrink: 0,
            aspectRatio: '385.94/585.95',
            mixBlendMode: 'darken',
            filter: 'blur(9.449999809265137px)',
          }}
        />
      </MotionDiv>
    </div>
  );
};

export default FeatherAnimation;
