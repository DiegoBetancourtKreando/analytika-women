import { forwardRef, type HTMLAttributes, type ImgHTMLAttributes } from 'react';
import { cn } from '../utils/cn';

const Avatar = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', className)}
        {...props}
      />
    );
  },
);
Avatar.displayName = 'Avatar';

const AvatarImage = forwardRef<HTMLImageElement, ImgHTMLAttributes<HTMLImageElement>>(
  ({ className, ...props }, ref) => {
    return (
      <img
        ref={ref}
        className={cn('aspect-square h-full w-full object-cover', className)}
        {...props}
      />
    );
  },
);
AvatarImage.displayName = 'AvatarImage';

const AvatarFallback = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex h-full w-full items-center justify-center rounded-full bg-violet-100 text-sm font-medium text-violet-800',
          className,
        )}
        {...props}
      />
    );
  },
);
AvatarFallback.displayName = 'AvatarFallback';

export { Avatar, AvatarImage, AvatarFallback };
