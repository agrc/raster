import { useQuery } from '@tanstack/react-query';
import { Banner } from '@ugrc/utah-design-system';
import { TreeItemContent as RACTreeItemContent, TreeItem } from 'react-aria-components';
import { List } from 'react-content-loader';
import resolveConfig from 'tailwindcss/resolveConfig';
import { useDarkMode } from 'usehooks-ts';
import tailwindConfig from '../../tailwind.config.js';
import config from '../config';
import type { ProductTypeKey } from '../types';
import Product, { type ProductFeature } from './Product';
import search from './services/search';
import { TreeItemContent } from './TreeItemContent';

const fullConfig = resolveConfig(tailwindConfig);

type ProductTypeProps = {
  productType: ProductTypeKey;
  aoi: __esri.GeometryUnion | nullish;
  searchFn?: typeof search; // for storybook tests
};

export default function ProductType({ productType, aoi, searchFn = search }: ProductTypeProps) {
  const { data, error, isLoading } = useQuery({
    queryKey: ['searchResults', productType, aoi],
    queryFn: () => searchFn(productType, aoi as __esri.GeometryUnion),
  });

  const { isDarkMode } = useDarkMode();

  if (isLoading) {
    return (
      <TreeItem textValue="loading" className="ml-4">
        <RACTreeItemContent>
          <List
            backgroundColor={isDarkMode ? fullConfig.theme.colors.zinc[800] : fullConfig.theme.colors.zinc[300]}
            foregroundColor="#FFFFFF"
          />
        </RACTreeItemContent>
      </TreeItem>
    );
  }

  if (error || !data) {
    console.error(`Error loading search results for: ${productType}`, error);

    return (
      <TreeItem textValue="loading">
        <RACTreeItemContent>
          <Banner className="m-2">Error loading search results</Banner>
        </RACTreeItemContent>
      </TreeItem>
    );
  }

  return Object.keys(data).map((category) => (
    <TreeItem textValue={category} key={category} className="mt-1">
      <TreeItemContent>{category}</TreeItemContent>
      {data[category]!.map((product) => (
        <Product key={product.attributes[config.EXTENT_FIELDS.OBJECTID]} feature={product as ProductFeature} />
      ))}
    </TreeItem>
  ));
}
