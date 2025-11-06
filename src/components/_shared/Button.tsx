import * as React from 'react';

import { RippleButton, RippleButtonRipples } from '@/components/animate-ui/primitives/buttons/ripple';
import ArrowRight from '@/components/icons/ArrowRight';
import { cn } from '@/lib/utils';

interface ButtonProps {
  hoverScale?: number;
  tapScale?: number;
  buttonText: string;
  variant?: 'primary' | 'white' | 'destructive';
  className?: string;
  arrowPosition?: 'left' | 'right';
  reverseArrow?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const variantStyles = {
  primary: 'bg-primary text-white-smoke [--ripple-button-ripple-color:oklch(var(--white-smoke))]',
  white: 'bg-white text-primary [--ripple-button-ripple-color:oklch(var(--primary))]',
  destructive: 'bg-transparent text-primary [--ripple-button-ripple-color:oklch(var(--primary))]',
};

const Button = ({
  hoverScale,
  tapScale,
  buttonText,
  variant = 'primary',
  className,
  arrowPosition = 'right',
  reverseArrow = false,
  onClick,
}: ButtonProps) => {
  const arrow = <ArrowRight className={cn('h-5 w-5', reverseArrow && 'rotate-180')} />;

  return (
    <RippleButton
      key={`${hoverScale}-${tapScale}`}
      hoverScale={hoverScale}
      tapScale={tapScale}
      onClick={onClick}
      className={cn(
        'flex h-14 items-center justify-center gap-5 px-16 py-2.5 text-lg leading-[2rem] transition-opacity duration-300 hover:opacity-90',
        variantStyles[variant],
        className
      )}
    >
      {arrowPosition === 'left' && arrow}
      {buttonText}
      {arrowPosition === 'right' && arrow}
      <RippleButtonRipples />
    </RippleButton>
  );
};

export default Button;
