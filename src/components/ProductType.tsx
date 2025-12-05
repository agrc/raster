import { useQuery } from '@tanstack/react-query';
import { Banner, Button } from '@ugrc/utah-design-system';
import { Tree, TreeItem } from 'react-aria-components';
import config from '../config';
import useWizardMachine from '../hooks/useWizardMachine';
import search from '../services/search';
import type { ProductTypeKey } from '../types';
import Category from './Category';
import ListLoader from './ListLoader';
import { TreeItemContent } from './TreeItemContent';

type ProductTypeProps = {
  productType: ProductTypeKey;
  aoi: __esri.GeometryUnion | nullish;
  isOnly?: boolean;
  searchFn?: typeof search; // for storybook tests
};

const topLevelClasses = 'text-lg font-semibold [&:not(:first-child)]:mt-1';

export default function ProductType({ productType, aoi, isOnly, searchFn = search }: ProductTypeProps) {
  const { snapshot } = useWizardMachine();
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['searchResults', productType, aoi, snapshot.context.urlCategories],
    queryFn: () => searchFn(productType, aoi as __esri.GeometryUnion, snapshot.context.urlCategories),
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
    <Tree aria-label="search results" selectionMode="none" defaultExpandedKeys={defaultExpandedKeys}>
      <TreeItem id={title} textValue={title} className="flex items-center">
        <TreeItemContent className={topLevelClasses}>{title}</TreeItemContent>
        {categories.length > 0 ? (
          categories.map((category) => (
            <Category key={category} category={category} products={data[category]!} productType={productType} />
          ))
        ) : (
          <TreeItem textValue="no-results" id="no-results" className="ml-1 text-sm">
            <TreeItemContent>No products found</TreeItemContent>
          </TreeItem>
        )}
      </TreeItem>
    </Tree>
  );
}
