import { forwardRef, type HTMLAttributes, createContext, useContext, useState } from 'react';
import { cn } from '../utils/cn';
import { X } from 'lucide-react';

interface DialogContextType {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

function useDialog() {
  const context = useContext(DialogContext);
  if (!context) throw new Error('Dialog components must be used within a Dialog');
  return context;
}

interface DialogProps {
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function Dialog({ children, open: controlledOpen, defaultOpen = false, onOpenChange }: DialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = (value: boolean) => {
    if (!isControlled) setUncontrolledOpen(value);
    onOpenChange?.(value);
  };

  return (
    <DialogContext.Provider value={{ open, onOpenChange: setOpen }}>
      {children}
    </DialogContext.Provider>
  );
}

const DialogTrigger = ({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) => {
  const { onOpenChange } = useDialog();
  if (asChild) {
    return <span onClick={() => onOpenChange(true)}>{children}</span>;
  }
  return (
    <button type="button" onClick={() => onOpenChange(true)}>
      {children}
    </button>
  );
};

interface DialogContentProps extends HTMLAttributes<HTMLDivElement> {
  showClose?: boolean;
}

const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, children, showClose = true, ...props }, ref) => {
    const { open, onOpenChange } = useDialog();

    if (!open) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => onOpenChange(false)}
        />
        <div
          ref={ref}
          className={cn(
            'relative z-50 w-full max-w-lg rounded-xl bg-white p-6 shadow-xl',
            'animate-in fade-in zoom-in-95',
            className,
          )}
          {...props}
        >
          {showClose && (
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          {children}
        </div>
      </div>
    );
  },
);
DialogContent.displayName = 'DialogContent';

const DialogHeader = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('mb-4', className)} {...props} />
);

const DialogTitle = ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
  <h2 className={cn('text-lg font-semibold leading-none tracking-tight', className)} {...props} />
);

const DialogDescription = ({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn('mt-2 text-sm text-gray-500', className)} {...props} />
);

const DialogFooter = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('mt-6 flex justify-end gap-3', className)} {...props} />
);

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
};
