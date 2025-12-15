'use client';

import { motion, type HTMLMotionProps } from 'motion/react';
import * as React from 'react';

import { Slot, type WithAsChild } from '@/components/animate-ui/primitives/animate/slot';
import { getStrictContext } from '@/lib/get-strict-context';

type Ripple = {
  id: number;
  x: number;
  y: number;
};

type RippleButtonContextType = {
  rippleList: Ripple[];
  // eslint-disable-next-line no-unused-vars
  setRipples: (newRipples: Ripple[]) => void;
};

const [RippleButtonProvider, useRippleButton] = getStrictContext<RippleButtonContextType>('RippleButtonContext');

type RippleButtonProps = WithAsChild<
  HTMLMotionProps<'button'> & {
    disabled?: boolean;
    hoverScale?: number;
    tapScale?: number;
  }
>;

const RippleButton = ({
  ref,
  onClick,
  hoverScale = 1,
  tapScale = 1,
  asChild = false,
  style,
  ...props
}: RippleButtonProps) => {
  const [ripples, setRipples] = React.useState<Ripple[]>([]);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  React.useImperativeHandle(ref, () => buttonRef.current as HTMLButtonElement);

  const createRipple = React.useCallback((event: React.MouseEvent<HTMLElement>) => {
    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const newRipple: Ripple = {
      id: Date.now(),
      x,
      y,
    };

    setRipples((previous) => [...previous, newRipple]);

    setTimeout(() => {
      // eslint-disable-next-line sonarjs/no-nested-functions
      setRipples((previous) => previous.filter((r) => r.id !== newRipple.id));
    }, 600);
  }, []);

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      createRipple(event);
      if (onClick) {
        onClick(event);
      }
    },
    [createRipple, onClick]
  );

  const commonStyle = {
    position: 'relative' as const,
    overflow: 'hidden' as const,
    ...style,
  };

  return (
    <RippleButtonProvider value={{ rippleList: ripples, setRipples }}>
      {asChild ? (
        <Slot
          ref={buttonRef as React.Ref<HTMLElement>}
          data-slot='ripple-button'
          onClick={handleClick as React.MouseEventHandler<HTMLElement>}
          whileTap={{ scale: tapScale }}
          whileHover={{ scale: hoverScale }}
          style={commonStyle}
          {...(props as Record<string, unknown>)}
        />
      ) : (
        <motion.button
          ref={buttonRef}
          data-slot='ripple-button'
          onClick={handleClick}
          whileTap={{ scale: tapScale }}
          whileHover={{ scale: hoverScale }}
          style={commonStyle}
          {...props}
        />
      )}
    </RippleButtonProvider>
  );
};

type RippleButtonRipplesProps = WithAsChild<
  HTMLMotionProps<'span'> & {
    color?: string;
    scale?: number;
    disabled?: boolean;
  }
>;

function RippleButtonRipples({
  color = 'var(--ripple-button-ripple-color)',
  scale = 10,
  transition = { duration: 0.6, ease: 'easeOut' },
  asChild = false,
  style,
  disabled = false,
  ...props
}: RippleButtonRipplesProps) {
  const { rippleList } = useRippleButton();

  const initialAnimation = disabled ? { scale: 0, opacity: 0 } : { scale: 0, opacity: 0.5 };
  const animateAnimation = { scale, opacity: 0 };
  const baseStyle = {
    position: 'absolute' as const,
    borderRadius: '50%',
    pointerEvents: 'none' as const,
    width: '20px',
    height: '20px',
    backgroundColor: color,
    ...style,
  };

  return rippleList.map((ripple) => {
    const rippleStyle = {
      ...baseStyle,
      top: ripple.y - 10,
      left: ripple.x - 10,
    };

    return asChild ? (
      <Slot
        key={ripple.id}
        initial={initialAnimation}
        animate={animateAnimation}
        transition={transition}
        style={rippleStyle}
        {...(props as Record<string, unknown>)}
      />
    ) : (
      <motion.span
        key={ripple.id}
        initial={initialAnimation}
        animate={animateAnimation}
        transition={transition}
        style={rippleStyle}
        {...props}
      />
    );
  });
}

export { RippleButton, RippleButtonRipples, type RippleButtonProps, type RippleButtonRipplesProps };
