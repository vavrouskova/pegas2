'use client';

import { motion, HTMLMotionProps } from 'framer-motion';

export const MotionDiv = (props: HTMLMotionProps<'div'>) => {
  return <motion.div {...props}>{props.children}</motion.div>;
};

export const MotionSection = (props: HTMLMotionProps<'section'>) => {
  return <motion.section {...props}>{props.children}</motion.section>;
};
