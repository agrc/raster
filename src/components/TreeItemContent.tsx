import { Button } from '@ugrc/utah-design-system';
import { ChevronRight } from 'lucide-react';
import {
  TreeItemContent as RACTreeItemContent,
  type TreeItemContentProps,
  type TreeItemContentRenderProps,
} from 'react-aria-components';
import { twJoin, twMerge } from 'tailwind-merge';

export function TreeItemContent(
  props: Omit<TreeItemContentProps, 'children'> & {
    children: React.ReactNode;
    className?: string;
    buttons?: React.ReactNode;
  },
) {
  return (
    <RACTreeItemContent>
      {({ hasChildItems, isExpanded }: TreeItemContentRenderProps) =>
        hasChildItems ? (
          <div className="flex w-full items-center justify-between">
            <Button
              slot="chevron"
              variant="icon"
              className={twMerge('justify-start rounded !pr-2 text-sm dark:text-white', props.className)}
            >
              <ChevronRight
                className={twJoin(
                  'size-4 shrink-0 transition-transform duration-200',
                  hasChildItems ? (isExpanded ? 'rotate-90' : '') : undefined,
                )}
              />
              {props.children}
            </Button>
            {props.buttons && <div className="mr-1">{props.buttons}</div>}
          </div>
        ) : (
          props.children
        )
      }
    </RACTreeItemContent>
  );
}
