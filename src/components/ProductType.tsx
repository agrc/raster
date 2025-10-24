import { useQuery } from '@tanstack/react-query';
import { Banner } from '@ugrc/utah-design-system';
import { Tree, TreeItem } from 'react-aria-components';
import { List } from 'react-content-loader';
import resolveConfig from 'tailwindcss/resolveConfig';
import { useDarkMode } from 'usehooks-ts';
import tailwindConfig from '../../tailwind.config.js';
import config from '../config';
import search from '../services/search';
import type { ProductTypeKey } from '../types';
import Product, { type ProductFeature } from './Product';
import { TreeItemContent } from './TreeItemContent';
import { removeCurlyBracesContent } from './utils.js';

const fullConfig = resolveConfig(tailwindConfig);

type ProductTypeProps = {
  productType: ProductTypeKey;
  aoi: __esri.GeometryUnion | nullish;
  isOnly?: boolean;
  searchFn?: typeof search; // for storybook tests
};

const topLevelClasses = 'text-lg font-semibold [&:not(:first-child)]:mt-1';

export default function ProductType({ productType, aoi, isOnly, searchFn = search }: ProductTypeProps) {
  const { data, error, isLoading } = useQuery({
    queryKey: ['searchResults', productType, aoi],
    queryFn: () => searchFn(productType, aoi as __esri.GeometryUnion),
  });

  const { isDarkMode } = useDarkMode();
  const title = config.PRODUCT_TYPES[productType];

  if (isLoading) {
    return (
      <>
        <span className={topLevelClasses}>{title}</span>
        <List
          backgroundColor={isDarkMode ? fullConfig.theme.colors.zinc[800] : fullConfig.theme.colors.zinc[300]}
          foregroundColor="#FFFFFF"
        />
      </>
    );
  }

  if (error || !data) {
    return (
      <>
        <span className={topLevelClasses}>{title}</span>
        <Banner className="m-2">Error loading search results</Banner>
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
            <TreeItem textValue={removeCurlyBracesContent(category)} id={category} key={category} className="mt-1">
              <TreeItemContent>{removeCurlyBracesContent(category)}</TreeItemContent>
              {data[category]!.map((product) => (
                <Product
                  key={product.attributes[config.EXTENT_FIELDS.OBJECTID]}
                  id={product.attributes[config.EXTENT_FIELDS.OBJECTID]}
                  feature={product as ProductFeature}
                />
              ))}
            </TreeItem>
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
