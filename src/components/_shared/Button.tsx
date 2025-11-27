import * as React from 'react';

import { RippleButton, RippleButtonRipples } from '@/components/animate-ui/primitives/buttons/ripple';
import ArrowRight from '@/components/icons/ArrowRight';
import { cn } from '@/lib/utils';

interface ButtonProps {
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  hoverScale?: number;
  tapScale?: number;
  buttonText: string;
  variant?: 'primary' | 'white' | 'destructive';
  size?: 'default' | 'small';
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

const sizeStyles = {
  default: 'px-8 py-3 text-lg lg:px-16',
  small: 'px-4 py-2 text-lg lg:px-8',
};

const Button = ({
  disabled = false,
  type = 'button',
  hoverScale,
  tapScale,
  buttonText,
  variant = 'primary',
  size = 'default',
  className,
  arrowPosition = 'right',
  reverseArrow = false,
  onClick,
}: ButtonProps) => {
  const arrowSize = size === 'small' ? 'h-4 w-4' : 'h-5 w-5';
  const arrow = <ArrowRight className={cn(arrowSize, reverseArrow && 'rotate-180')} />;

  return (
    <RippleButton
      key={`${hoverScale}-${tapScale}`}
      hoverScale={hoverScale}
      tapScale={tapScale}
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={cn(
        'flex items-center justify-center gap-5 transition-opacity duration-300 hover:opacity-90',
        sizeStyles[size],
        type === 'submit' && 'lg:px-8',
        variantStyles[variant],
        disabled && 'cursor-not-allowed',
        className
      )}
    >
      {arrowPosition === 'left' && type !== 'submit' && arrow}
      {buttonText}
      {arrowPosition === 'right' && type !== 'submit' && arrow}
      <RippleButtonRipples />
    </RippleButton>
  );
};

export default Button;
