import { Button } from '@ugrc/utah-design-system';
import { clsx } from 'clsx';
import { ChevronRight } from 'lucide-react';
import {
  TreeItemContent as RACTreeItemContent,
  type TreeItemContentProps,
  type TreeItemContentRenderProps,
} from 'react-aria-components';
import { twMerge } from 'tailwind-merge';

export function TreeItemContent(
  props: Omit<TreeItemContentProps, 'children'> & { children: React.ReactNode; className?: string },
) {
  return (
    <RACTreeItemContent>
      {({ hasChildItems, isExpanded }: TreeItemContentRenderProps) =>
        hasChildItems ? (
          <Button
            slot="chevron"
            variant="icon"
            className={twMerge('w-full justify-start rounded text-sm dark:text-white', props.className)}
          >
            <ChevronRight
              className={clsx(
                'size-5 shrink-0 transition-transform duration-200',
                hasChildItems ? (isExpanded ? 'rotate-90' : '') : undefined,
              )}
            />
            {props.children}
          </Button>
        ) : (
          props.children
        )
      }
    </RACTreeItemContent>
  );
}
