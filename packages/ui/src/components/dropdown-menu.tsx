import { forwardRef, type HTMLAttributes, createContext, useContext, useState, useRef, useEffect } from 'react';
import { cn } from '../utils/cn';

interface DropdownMenuContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DropdownMenuContext = createContext<DropdownMenuContextType | undefined>(undefined);

function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      {children}
    </DropdownMenuContext.Provider>
  );
}

const DropdownMenuTrigger = ({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) => {
  const { open, setOpen } = useDropdownMenu();
  if (asChild) {
    return <span onClick={() => setOpen(!open)}>{children}</span>;
  }
  return (
    <button type="button" onClick={() => setOpen(!open)}>
      {children}
    </button>
  );
};

interface DropdownMenuContentProps extends HTMLAttributes<HTMLDivElement> {
  align?: 'start' | 'end';
}

const DropdownMenuContent = forwardRef<HTMLDivElement, DropdownMenuContentProps>(
  ({ className, align = 'start', ...props }, ref) => {
    const { open, setOpen } = useDropdownMenu();
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
          setOpen(false);
        }
      };
      if (open) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }
    }, [open, setOpen]);

    if (!open) return null;

    return (
      <div
        ref={(node) => {
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
          contentRef.current = node;
        }}
        className={cn(
          'absolute z-50 mt-1 min-w-[12rem] rounded-lg border border-gray-200 bg-white p-1 shadow-lg',
          align === 'end' && 'right-0',
          className,
        )}
        {...props}
      />
    );
  },
);
DropdownMenuContent.displayName = 'DropdownMenuContent';

const DropdownMenuItem = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors',
          className,
        )}
        {...props}
      />
    );
  },
);
DropdownMenuItem.displayName = 'DropdownMenuItem';

const DropdownMenuSeparator = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('my-1 h-px bg-gray-200', className)} {...props} />
);

function useDropdownMenu() {
  const context = useContext(DropdownMenuContext);
  if (!context) throw new Error('DropdownMenu components must be used within a DropdownMenu');
  return context;
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
};
