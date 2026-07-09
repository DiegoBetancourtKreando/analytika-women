import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../utils/cn';

const TooltipProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;

interface TooltipProps extends HTMLAttributes<HTMLDivElement> {
  content: string;
}

const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  ({ children, content, className, ...props }, ref) => {
    return (
      <div ref={ref} className="group relative inline-block" {...props}>
        {children}
        <div
          className={cn(
            'pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 -translate-y-1 opacity-0 transition-opacity group-hover:opacity-100',
            'mb-2 rounded-md bg-gray-900 px-2 py-1 text-xs text-white shadow-lg',
            'whitespace-nowrap',
            className,
          )}
        >
          {content}
        </div>
      </div>
    );
  },
);
Tooltip.displayName = 'Tooltip';

export { Tooltip, TooltipProvider };
