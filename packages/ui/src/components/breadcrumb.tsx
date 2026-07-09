import { type HTMLAttributes } from 'react';
import { cn } from '../utils/cn';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
}

function Breadcrumb({ items, className, ...props }: BreadcrumbProps) {
  return (
    <nav className={cn('flex items-center gap-1 text-sm text-gray-500', className)} {...props}>
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-1">
          {index > 0 && <ChevronRight className="h-4 w-4" />}
          {item.href ? (
            <a href={item.href} className="hover:text-violet-600 transition-colors">
              {item.label}
            </a>
          ) : (
            <span className="text-gray-900 font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export { Breadcrumb };
export type { BreadcrumbItem };
