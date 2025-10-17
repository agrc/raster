import type { IPolygon } from '@esri/arcgis-rest-request';
import { TreeItem as RACTreeItem } from 'react-aria-components';
import type config from '../config';
import { TreeItemContent } from './TreeItemContent';

export type ProductFeature = {
  geometry: IPolygon;
  attributes: {
    [config.EXTENT_FIELDS.OBJECTID]: number;
    [config.EXTENT_FIELDS.Category]: string;
    [config.EXTENT_FIELDS.Estimated_Date]: number;
    [config.EXTENT_FIELDS.HTML_Page]: string;
    [config.EXTENT_FIELDS.In_House]: 'Yes' | 'No' | null;
    [config.EXTENT_FIELDS.Product]: string;
    [config.EXTENT_FIELDS.REST_Endpoint]: string;
    [config.EXTENT_FIELDS.SHOW]: 'Y' | null;
    [config.EXTENT_FIELDS.ServiceName]: string;
  };
};
type ProductProps = { graphic: ProductFeature };

const commonClasses = 'rounded ml-3';

export default function Product({ graphic }: ProductProps) {
  const { Product, OBJECTID } = graphic.attributes;

  return (
    <RACTreeItem
      id={`${Product}-${OBJECTID}`}
      textValue={Product}
      className={`${commonClasses} flex items-center bg-secondary-900 data-[expanded]:rounded-b-none hover:bg-secondary-700 pressed:bg-secondary-800 [&:not(:first-child)]:mt-1`}
    >
      <TreeItemContent className="text-white">{Product}</TreeItemContent>
      <RACTreeItem
        textValue="details"
        className={`${commonClasses} rounded-t-none bg-white px-2 py-1 text-sm dark:bg-zinc-800 dark:text-white`}
      >
        <TreeItemContent>Product Details</TreeItemContent>
      </RACTreeItem>
    </RACTreeItem>
  );
}
