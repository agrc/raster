import type { GeometryUnion } from '@arcgis/core/geometry/types';
import { useQuery } from '@tanstack/react-query';
import { Banner } from '@ugrc/utah-design-system/components/Banner';
import { Button } from '@ugrc/utah-design-system/components/Button';
import { Dialog } from '@ugrc/utah-design-system/components/Dialog';
import { X } from 'lucide-react';
import {
  Button as RACButton,
  Heading,
  Modal as RACModal,
  ModalOverlay,
  Tree,
  TreeItem,
} from 'react-aria-components';
import { useState } from 'react';
import config from '../config';
import useWizardMachine from '../hooks/useWizardMachine';
import search from '../services/search';
import type { ProductTypeKey } from '../types';
import Category from './Category';
import ListLoader from './ListLoader';
import MoreInfo from './MoreInfo';
import { TreeItemContent } from './TreeItemContent';

type ProductTypeProps = {
  productType: ProductTypeKey;
  aoi: GeometryUnion | null | undefined;
  isOnly?: boolean;
  searchFn?: typeof search; // for storybook tests
};

const topLevelClasses = 'text-lg font-semibold [&:not(:first-child)]:mt-1';

export default function ProductType({ productType, aoi, isOnly, searchFn = search }: ProductTypeProps) {
  const [moreInfoProduct, setMoreInfoProduct] = useState<{
    title: string;
    productType: ProductTypeKey;
    objectId: number;
  } | null>(null);
  const { snapshot } = useWizardMachine();
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['searchResults', productType, aoi, snapshot.context.urlCategories],
    queryFn: () => searchFn(productType, aoi as GeometryUnion, snapshot.context.urlCategories),
  });

  const title = config.PRODUCT_TYPES[productType];

  if (isLoading) {
    return (
      <>
        <span className={topLevelClasses}>{title}</span>
        <ListLoader />
      </>
    );
  }

  if (error || !data) {
    return (
      <>
        <span className={topLevelClasses}>{title}</span>
        <Banner className="m-2">
          <div className="flex flex-col gap-1">
            Error loading search results
            <Button className="self-end" variant="destructive" size="extraSmall" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        </Banner>
      </>
    );
  }

  const categories = Object.keys(data ?? {});
  const defaultExpandedKeys = [title];

  // save clicks if there is only one category and this is the only product type
  if (isOnly && categories.length === 1) {
    defaultExpandedKeys.push(categories[0]!);
  }
  // save clicks if there is only one product in a category
  categories.forEach((category) => {
    if (data[category]!.length === 1) {
      const singleProduct = data[category]![0]!;
      defaultExpandedKeys.push(singleProduct.attributes[config.EXTENT_FIELDS.OBJECTID]);
    }
  });

  return (
    <>
      <Tree aria-label="search results" selectionMode="none" defaultExpandedKeys={defaultExpandedKeys}>
        <TreeItem id={title} textValue={title} className="group flex items-center">
          <TreeItemContent className={topLevelClasses}>{title}</TreeItemContent>
          {categories.length > 0 ? (
            categories.map((category) => (
              <Category
                key={category}
                category={category}
                products={data[category]!}
                productType={productType}
                onMoreInfo={(title, productType, objectId) => setMoreInfoProduct({ title, productType, objectId })}
              />
            ))
          ) : (
            <TreeItem textValue="no-results" id="no-results" className="ml-1 text-sm">
              <TreeItemContent isExpandable={false}>No products found</TreeItemContent>
            </TreeItem>
          )}
        </TreeItem>
      </Tree>
      {moreInfoProduct && (
        <ModalOverlay
          isOpen
          onOpenChange={(isOpen) => {
            if (!isOpen) setMoreInfoProduct(null);
          }}
          isDismissable
          className="fixed top-0 left-0 isolate z-20 flex h-(--visual-viewport-height) w-full items-center justify-center bg-black/[15%] p-4 text-center backdrop-blur-lg"
        >
          <RACModal className="max-h-full w-full max-w-2xl overflow-y-auto rounded-2xl border border-black/10 bg-white bg-clip-padding text-left align-middle text-slate-700 shadow-2xl dark:border-white/10 dark:bg-zinc-800/70 dark:text-zinc-300 dark:backdrop-blur-2xl dark:backdrop-saturate-200 forced-colors:bg-[Canvas]">
            <Dialog aria-label={moreInfoProduct.title}>
              <Heading slot="title" className="pr-10 text-xl font-bold">
                {moreInfoProduct.title}
              </Heading>
              <RACButton
                slot="close"
                className="absolute top-3 right-3 border-0 p-1 text-zinc-900 hover:bg-black/5 dark:text-zinc-300 dark:hover:bg-white/10 [&:has(>svg:only-child)]:min-h-0 [&:has(>svg:only-child)]:p-0.5"
                aria-label="Close"
                onPress={() => setMoreInfoProduct(null)}
              >
                <X className="size-4" />
              </RACButton>
              <MoreInfo productType={moreInfoProduct.productType} objectId={moreInfoProduct.objectId} />
            </Dialog>
          </RACModal>
        </ModalOverlay>
      )}
    </>
  );
}
