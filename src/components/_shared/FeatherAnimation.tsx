'use client';

import { useScroll, useTransform, useSpring } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

import { MotionDiv } from '@/components/animate-ui/MotionWrappers';
import useMediaQuery from '@/hooks/useMediaQuery';

type FeatherPosition = 'left' | 'right';

interface FeatherAnimationProps {
  featherPosition?: FeatherPosition;
}

const FeatherAnimation = ({ featherPosition = 'left' }: FeatherAnimationProps) => {
  const isLargeScreen = useMediaQuery('(min-width: 1024px)');
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Jemný spring config pro hladký, elegantní pohyb
  const springConfig = { stiffness: 60, damping: 40, restDelta: 0.001 };

  // Levé pírko - jemný parallax s lehkou rotací
  const leftFeatherY = useTransform(scrollYProgress, [0, 1], [-100, 50]);
  const leftFeatherX = useTransform(scrollYProgress, [0, 1], [0, -25]);
  const leftFeatherRotate = useTransform(scrollYProgress, [0, 1], [0, 12]);
  const leftFeatherScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.96, 1.02, 0.98]);
  const leftFeatherOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.5, 0.95, 0.95, 0.6]);

  // Pravé pírko - odlišná trajektorie pro efekt hloubky
  const rightFeatherY = useTransform(scrollYProgress, [0, 1], [-280, -80]);
  const rightFeatherX = useTransform(scrollYProgress, [0, 1], [80, 50]);
  const rightFeatherRotate = useTransform(scrollYProgress, [0, 1], [10, -5]);
  const rightFeatherScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.98, 1.03, 0.92]);
  const rightFeatherOpacity = useTransform(scrollYProgress, [0, 0.12, 0.88, 1], [0.45, 1, 1, 0.55]);

  // Spring pro extra hladký pohyb
  const smoothLeftFeatherY = useSpring(leftFeatherY, springConfig);
  const smoothRightFeatherY = useSpring(rightFeatherY, springConfig);

  return (
    <div
      ref={containerRef}
      className='absolute top-0 left-0 h-full w-full'
    >
      {isLargeScreen && (
        <>
          {/* Levé pírko */}
          {featherPosition === 'left' && (
            <MotionDiv
              className='absolute top-1/2 left-1/2 z-10 -translate-x-[700px]'
              style={{
                y: smoothLeftFeatherY,
                x: leftFeatherX,
                rotate: leftFeatherRotate,
                scale: leftFeatherScale,
                opacity: leftFeatherOpacity,
              }}
            >
              <Image
                src='/images/feather1.webp'
                alt='Feather 1'
                width={80}
                height={120}
                className='h-[11.08013rem] w-[16.822rem] shrink-0'
                style={{ willChange: 'transform, opacity' }}
              />
            </MotionDiv>
          )}

          {/* Pravé pírko */}
          {featherPosition === 'right' && (
            <MotionDiv
              className='absolute top-1/2 right-1/2 z-10 translate-x-[700px]'
              style={{
                y: smoothRightFeatherY,
                x: rightFeatherX,
                rotate: rightFeatherRotate,
                scale: rightFeatherScale,
                opacity: rightFeatherOpacity,
              }}
            >
              <Image
                src='/images/feather2.webp'
                alt='Feather 2'
                width={386}
                height={586}
                className='h-[26.3345rem] w-[17.34569rem] shrink-0 rotate-[-77.654deg] mix-blend-darken'
                style={{ willChange: 'transform, opacity' }}
              />
            </MotionDiv>
          )}
        </>
      )}
    </div>
  );
};

export default FeatherAnimation;
