import { RippleButton, RippleButtonRipples } from '@/components/animate-ui/primitives/buttons/ripple';
import ArrowRight from '@/components/icons/ArrowRight';
import { cn } from '@/lib/utils';

interface ButtonProps {
  hoverScale?: number;
  tapScale?: number;
  buttonText: string;
  variant?: 'primary' | 'white' | 'destructive';
  size?: 'default' | 'small';
  className?: string;
}

const variantStyles = {
  primary: 'bg-primary text-white-smoke [--ripple-button-ripple-color:oklch(var(--white-smoke))]',
  white: 'bg-white text-primary [--ripple-button-ripple-color:oklch(var(--primary))]',
  destructive: 'bg-transparent text-primary [--ripple-button-ripple-color:oklch(var(--primary))]',
};

const sizeStyles = {
  small: 'h-13 px-8 py-4 text-base',
  default: 'h-14 px-8 py-4 text-lg',
};

const Button = ({
  hoverScale,
  tapScale,
  buttonText,
  variant = 'primary',
  size = 'default',
  className,
}: ButtonProps) => {
  const arrowSize = size === 'small' ? 'h-4 w-4' : 'h-6 w-6';

  return (
    <RippleButton
      key={`${hoverScale}-${tapScale}`}
      hoverScale={hoverScale}
      tapScale={tapScale}
      className={cn(
        'flex items-center justify-center gap-1 leading-none',
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
    >
      {buttonText}
      <ArrowRight className={arrowSize} />
      <RippleButtonRipples />
    </RippleButton>
  );
};

export default Button;
