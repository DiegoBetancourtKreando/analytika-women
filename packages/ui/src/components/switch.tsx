import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, id, ...props }, ref) => {
    const switchId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex items-center gap-2">
        <input
          id={switchId}
          type="checkbox"
          ref={ref}
          className={cn(
            'peer h-5 w-9 appearance-none rounded-full bg-gray-300 transition-colors',
            'checked:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2',
            'cursor-pointer',
            className,
          )}
          {...props}
        />
        {label && (
          <label htmlFor={switchId} className="text-sm text-gray-700 cursor-pointer">
            {label}
          </label>
        )}
      </div>
    );
  },
);
Switch.displayName = 'Switch';

export { Switch };
