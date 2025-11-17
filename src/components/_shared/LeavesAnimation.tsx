'use client';

import { useScroll, useTransform, useSpring } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

import { MotionDiv } from '@/components/animate-ui/MotionWrappers';
import useMediaQuery from '@/hooks/useMediaQuery';
import { cn } from '@/lib/utils';

interface LeavesAnimationProps {
  leaves1ClassName?: string;
  motionDiv1ClassName?: string;
  leaves2ClassName?: string;
  motionDiv2ClassName?: string;
}

const LeavesAnimation = ({
  leaves1ClassName,
  motionDiv1ClassName,
  leaves2ClassName,
  motionDiv2ClassName,
}: LeavesAnimationProps) => {
  const isLargeScreen = useMediaQuery('(min-width: 1024px)');
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Decentní spring config pro velmi jemný, sotva znatelný pohyb
  const springConfig = { stiffness: 40, damping: 60, restDelta: 0.001 };

  // První list - velmi jemný parallax s minimálním pohybem
  const firstLeafY = useTransform(scrollYProgress, [0, 1], [-80, 50]);
  const firstLeafX = useTransform(scrollYProgress, [0, 1], [0, -12]);
  const firstLeafScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.98, 1.01, 0.99]);

  // Druhý list - subtilní efekt hloubky
  const secondLeafY = useTransform(scrollYProgress, [0, 1], [-50, 30]);
  const secondLeafX = useTransform(scrollYProgress, [0, 1], [0, 10]);
  const secondLeafScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.97, 1.02, 0.98]);

  // Spring pro extra hladký pohyb
  const smoothFirstLeafY = useSpring(firstLeafY, springConfig);
  const smoothSecondLeafY = useSpring(secondLeafY, springConfig);

  return (
    <div
      ref={containerRef}
      className='absolute top-0 left-0 z-1 h-full w-full'
    >
      {isLargeScreen && (
        <>
          {/* Druhý list - přední vrstva */}
          <MotionDiv
            className={cn('absolute top-[31rem] left-1/2 z-10 translate-x-[34.5rem]', motionDiv2ClassName)}
            style={{
              y: smoothSecondLeafY,
              x: secondLeafX,
              scale: secondLeafScale,
            }}
          >
            <Image
              src='/images/leaves.webp'
              alt='Leaves 2'
              width={300}
              height={300}
              className={cn('h-auto w-[27rem] shrink-0 -scale-x-100 rotate-[260deg]', leaves2ClassName)}
              style={{ willChange: 'transform' }}
            />
          </MotionDiv>

          {/* První list - zadní vrstva */}
          <MotionDiv
            className={cn('absolute top-44 left-1/2 z-10 translate-x-[26rem]', motionDiv1ClassName)}
            style={{
              y: smoothFirstLeafY,
              x: firstLeafX,
              scale: firstLeafScale,
            }}
          >
            <Image
              src='/images/leaves.webp'
              alt='Leaves 1'
              width={300}
              height={300}
              className={cn('h-auto w-[34.7rem] shrink-0 -scale-x-100 rotate-[-20deg]', leaves1ClassName)}
              style={{ willChange: 'transform' }}
            />
          </MotionDiv>
        </>
      )}
    </div>
  );
};

export default LeavesAnimation;
