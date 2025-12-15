'use client';

import { motion, isMotionComponent, type HTMLMotionProps } from 'motion/react';
import * as React from 'react';

import { cn } from '@/lib/utils';

type AnyProps = Record<string, unknown>;

type DOMMotionProps<T extends HTMLElement = HTMLElement> = Omit<HTMLMotionProps<'div'>, 'ref'> & {
  ref?: React.Ref<T>;
};

type WithAsChild<Base extends object> =
  | (Base & { asChild: true; children: React.ReactElement })
  | (Base & { asChild?: false });

type SlotProps<T extends HTMLElement = HTMLElement> = {
  children?: any;
} & DOMMotionProps<T>;

function mergeReferences<T>(...references: (React.Ref<T> | undefined)[]): React.RefCallback<T> {
  return (node) => {
    references.forEach((ref) => {
      if (!ref) return;
      if (typeof ref === 'function') {
        ref(node);
      } else {
        (ref as React.RefObject<T | null>).current = node;
      }
    });
  };
}

function mergeProps<T extends HTMLElement>(childProps: AnyProps, slotProps: DOMMotionProps<T>): AnyProps {
  const merged: AnyProps = { ...childProps, ...slotProps };

  if (childProps.className || slotProps.className) {
    merged.className = cn(childProps.className as string, slotProps.className as string);
  }

  if (childProps.style || slotProps.style) {
    merged.style = {
      ...(childProps.style as React.CSSProperties),
      ...(slotProps.style as React.CSSProperties),
    };
  }

  return merged;
}

// Cache for motion components to avoid recreation on each render
// Using Map instead of WeakMap because ElementType can be a string (e.g., "div")
const motionComponentCache = new Map<React.ElementType, React.ComponentType<AnyProps>>();

function getMotionComponent(childType: React.ElementType, isAlreadyMotion: boolean): React.ComponentType<AnyProps> {
  if (isAlreadyMotion) {
    return childType as React.ComponentType<AnyProps>;
  }

  let cached = motionComponentCache.get(childType);
  if (!cached) {
    cached = motion.create(childType) as React.ComponentType<AnyProps>;
    motionComponentCache.set(childType, cached);
  }
  return cached;
}

const Slot = <T extends HTMLElement = HTMLElement>({ children, ref, ...props }: SlotProps<T>) => {
  if (!React.isValidElement(children)) return null;

  const isAlreadyMotion =
    typeof children.type === 'object' && children.type !== null && isMotionComponent(children.type);

  const MotionWrapper = getMotionComponent(children.type as React.ElementType, isAlreadyMotion);

  const { ref: childRef, ...childProps } = children.props as AnyProps;

  const mergedProps = mergeProps(childProps, props);

  return (
    // eslint-disable-next-line react-hooks/static-components
    <MotionWrapper
      {...mergedProps}
      ref={mergeReferences(childRef as React.Ref<T>, ref)}
    />
  );
};

export { Slot, type SlotProps, type WithAsChild, type DOMMotionProps, type AnyProps };
