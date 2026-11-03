import { ChevronRight } from 'lucide-react';
import {
  Button as RACButton,
  TreeItemContent as RACTreeItemContent,
  type TreeItemContentProps,
} from 'react-aria-components';
import { twJoin, twMerge } from 'tailwind-merge';

export function TreeItemContent(
  props: Omit<TreeItemContentProps, 'children' | 'className'> & {
    children: React.ReactNode;
    className?: string;
    buttons?: React.ReactNode;
    isExpandable?: boolean;
  },
) {
  const { children, className, buttons, isExpandable = true } = props;

  return (
    <RACTreeItemContent>
      {isExpandable ? (
        <RACButton
          slot="chevron"
          aria-label={`Toggle ${typeof children === 'string' ? children : 'item'}`}
          className={twMerge(
            'flex min-h-8 w-full items-center justify-between gap-2 rounded px-2 text-sm text-zinc-900 hover:bg-black/5 dark:text-zinc-300 dark:hover:bg-white/10',
            className,
          )}
        >
          <ChevronRight
            className={twJoin('size-4 shrink-0 transition-transform duration-200', 'group-data-[expanded]:rotate-90')}
          />
          {children}
        </RACButton>
      ) : (
        children
      )}
      {isExpandable && buttons && <div className="mr-1">{buttons}</div>}
    </RACTreeItemContent>
  );
}
