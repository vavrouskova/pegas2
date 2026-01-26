import * as React from 'react';

import { cn } from '@/lib/utils';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'border-tertiary text-primary placeholder:text-primary/60 flex min-h-[128px] w-full border px-5.25 py-4.5 text-lg font-normal transition-colors focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-600',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
