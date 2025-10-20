import Graphic from '@arcgis/core/Graphic';
import { fromJSON } from '@arcgis/core/geometry/support/jsonUtils';
import type { IPolygon } from '@esri/arcgis-rest-request';
import { Button } from '@ugrc/utah-design-system';
import { TreeItem as RACTreeItem } from 'react-aria-components';
import config from '../config';
import { TreeItemContent } from './TreeItemContent';
import useMap from './hooks/useMap';

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
type ProductProps = { feature: ProductFeature };

const commonClasses = 'rounded ml-3';

export default function Product({ feature }: ProductProps) {
  const { Product, OBJECTID } = feature.attributes;

  const { zoom, placeGraphic } = useMap();
  const geometry = fromJSON({
    type: 'polygon',
    ...feature.geometry,
    spatialReference: { wkid: 3857 },
  });
  const addGraphic = () => {
    placeGraphic(new Graphic({ geometry, symbol: config.RESULT_SYMBOL }));
  };
  const removeGraphic = () => {
    placeGraphic(null);
  };

  return (
    <RACTreeItem
      id={`${Product}-${OBJECTID}`}
      onHoverStart={addGraphic}
      onHoverEnd={removeGraphic}
      textValue={Product}
      className={`${commonClasses} bg-secondary-900 data-[expanded]:rounded-b-none hover:bg-secondary-700 pressed:bg-secondary-800 [&:not(:first-child)]:mt-1`}
    >
      <TreeItemContent
        className="text-white"
        buttons={
          <Button variant="accent" size="extraSmall" className="my-0 rounded px-1" onPress={() => zoom(geometry)}>
            Extent
          </Button>
        }
      >
        {Product}
      </TreeItemContent>
      <RACTreeItem
        textValue="details"
        className={`${commonClasses} rounded-t-none bg-white px-2 py-1 text-sm dark:bg-zinc-800 dark:text-white`}
      >
        <TreeItemContent>Product Details</TreeItemContent>
      </RACTreeItem>
    </RACTreeItem>
  );
}
