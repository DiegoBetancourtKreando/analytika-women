import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => {
    const checkboxId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex items-center gap-2">
        <input
          id={checkboxId}
          type="checkbox"
          ref={ref}
          className={cn(
            'h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500',
            className,
          )}
          {...props}
        />
        {label && (
          <label htmlFor={checkboxId} className="text-sm text-gray-700 cursor-pointer">
            {label}
          </label>
        )}
      </div>
    );
  },
);
Checkbox.displayName = 'Checkbox';

export { Checkbox };
