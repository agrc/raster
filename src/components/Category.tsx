import type { IFeature } from '@esri/arcgis-rest-request';
import { TreeItem } from 'react-aria-components';
import config from '../config';
import type { ProductTypeKey } from '../types';
import type { ProductFeature } from './Product';
import Product from './Product';
import { TreeItemContent } from './TreeItemContent';
import { getSort, removeCurlyBracesContent } from './utils';

type CategoryProps = {
  category: string;
  products: IFeature[];
  productType: ProductTypeKey;
};

export default function Category({ category, products, productType }: CategoryProps) {
  let categoryLabel = removeCurlyBracesContent(category);

  if (productType === 'lidar') {
    categoryLabel += ` (${products[0]!.attributes[config.EXTENT_FIELDS.Year_Collected]})`;
  }

  // sort product if there is a config defined
  let sortedProducts = products;
  if (config.PRODUCT_SORT_ORDER[productType]) {
    const sortOrder = config.PRODUCT_SORT_ORDER[productType]!;
    sortedProducts = [...products].sort(getSort(sortOrder));
  }

  return (
    <TreeItem textValue={categoryLabel} id={category} key={category} className="mt-1">
      <TreeItemContent>{categoryLabel}</TreeItemContent>
      {sortedProducts.map((product) => (
        <Product
          productType={productType}
          key={product.attributes[config.EXTENT_FIELDS.OBJECTID]}
          id={product.attributes[config.EXTENT_FIELDS.OBJECTID]}
          feature={product as ProductFeature}
        />
      ))}
    </TreeItem>
  );
}
