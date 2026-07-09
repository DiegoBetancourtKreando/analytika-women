import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
}

const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('h-2 w-full overflow-hidden rounded-full bg-gray-200', className)}
        {...props}
      >
        <div
          className="h-full rounded-full bg-violet-600 transition-all duration-300 ease-in-out"
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
    );
  },
);
Progress.displayName = 'Progress';

export { Progress };
