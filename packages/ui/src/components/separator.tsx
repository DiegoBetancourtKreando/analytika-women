import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../utils/cn';

const Separator = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('h-px w-full bg-gray-200', className)}
        {...props}
      />
    );
  },
);
Separator.displayName = 'Separator';

export { Separator };
