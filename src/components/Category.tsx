import type { IFeature } from '@esri/arcgis-rest-request';
import { TreeItem } from 'react-aria-components';
import config from '../config';
import type { ProductTypeKey } from '../types';
import type { ProductFeature } from './Product';
import Product from './Product';
import { TreeItemContent } from './TreeItemContent';
import { removeCurlyBracesContent } from './utils';

type CategoryProps = {
  category: string;
  products: IFeature[];
  productType: ProductTypeKey;
};
export default function Category({ category, products, productType }: CategoryProps) {
  let categoryLabel = removeCurlyBracesContent(category);

  if (productType === 'lidar') {
    categoryLabel += ` - ${products[0]!.attributes[config.EXTENT_FIELDS.Year_Collected]}`;
  }

  return (
    <TreeItem textValue={categoryLabel} id={category} key={category} className="mt-1">
      <TreeItemContent>{categoryLabel}</TreeItemContent>
      {products.map((product) => (
        <Product
          key={product.attributes[config.EXTENT_FIELDS.OBJECTID]}
          id={product.attributes[config.EXTENT_FIELDS.OBJECTID]}
          feature={product as ProductFeature}
        />
      ))}
    </TreeItem>
  );
}
