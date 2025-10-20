'use client';

import { useScroll, useTransform } from 'framer-motion';
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

  // Animace pro první list - pomalejší
  const firstLeafY = useTransform(scrollYProgress, [0, 1], [-300, 100]);

  // Animace pro druhý list - rychlejší
  const secondLeafY = useTransform(scrollYProgress, [0, 1], [-150, -50]);

  return (
    <div
      ref={containerRef}
      className='absolute top-0 left-0 z-1 h-full w-full'
    >
      {isLargeScreen && (
        <>
          <MotionDiv
            className={cn('absolute top-[31rem] left-1/2 z-10 translate-x-[34.5rem]', motionDiv2ClassName)}
            style={{
              y: secondLeafY,
            }}
          >
            <Image
              src='/images/leaves.webp'
              alt='Leaves 2'
              width={300}
              height={300}
              className={cn('h-auto w-[27rem] shrink-0 -scale-x-100 rotate-[260deg]', leaves2ClassName)}
            />
          </MotionDiv>
          <MotionDiv
            className={cn('absolute top-44 left-1/2 z-10 translate-x-[26rem]', motionDiv1ClassName)}
            style={{
              y: firstLeafY,
            }}
          >
            <Image
              src='/images/leaves.webp'
              alt='Leaves 1'
              width={300}
              height={300}
              className={cn(
                'h-auto w-[34.7rem] shrink-0 -scale-x-100 rotate-[-20deg] mix-blend-darken blur-[9px]',
                leaves1ClassName
              )}
            />
          </MotionDiv>
        </>
      )}
    </div>
  );
};

export default LeavesAnimation;
