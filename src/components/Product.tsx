import Graphic from '@arcgis/core/Graphic';
import { fromJSON } from '@arcgis/core/geometry/support/jsonUtils';
import type { IPolygon } from '@esri/arcgis-rest-request';
import { Button, ToggleButton } from '@ugrc/utah-design-system';
import { TreeItem as RACTreeItem } from 'react-aria-components';
import { twJoin } from 'tailwind-merge';
import config from '../config';
import useMap from '../hooks/useMap';
import usePreview from '../hooks/usePreview';
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
    [config.EXTENT_FIELDS.SHOW]: 'Y' | null;
    [config.EXTENT_FIELDS.ServiceName]: string;
  };
};
type ProductProps = { feature: ProductFeature };

const commonItemClasses = 'rounded ml-3';
const buttonClasses = 'my-0 rounded px-1';

export default function Product({ feature }: ProductProps) {
  const { Product, Category } = feature.attributes;

  const { zoom, placeGraphic } = useMap();
  const { previewId, addPreview, removePreview } = usePreview();
  const id = `${Category} | ${Product}`;

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

  const onAddPreview = () => {
    addPreview(id, feature.attributes[config.EXTENT_FIELDS.ServiceName]);
  };

  const getButtons = () => {
    return (
      <div className="flex gap-1">
        <Button
          key="extent"
          variant="accent"
          size="extraSmall"
          className={buttonClasses}
          onPress={() => zoom(geometry)}
        >
          Extent
        </Button>
        {feature.attributes[config.EXTENT_FIELDS.ServiceName] ? (
          <ToggleButton
            key="preview"
            className={twJoin(buttonClasses, 'min-h-6 px-2 text-xs')}
            isSelected={previewId === id}
            onChange={(isSelected) => (isSelected ? onAddPreview() : removePreview())}
          >
            Preview
          </ToggleButton>
        ) : null}
      </div>
    );
  };

  return (
    <RACTreeItem
      id={id}
      onHoverStart={addGraphic}
      onHoverEnd={removeGraphic}
      textValue={Product}
      className={`${commonItemClasses} flex min-h-8 items-center bg-secondary-900 data-[expanded]:rounded-b-none hover:bg-secondary-700 pressed:bg-secondary-800 [&:not(:first-child)]:mt-1`}
    >
      <TreeItemContent className="text-white" buttons={getButtons()}>
        {Product}
      </TreeItemContent>
      <RACTreeItem
        textValue="details"
        className={`${commonItemClasses} rounded-t-none bg-white px-2 py-1 text-sm dark:bg-zinc-800 dark:text-white`}
      >
        <TreeItemContent>Product Details</TreeItemContent>
      </RACTreeItem>
    </RACTreeItem>
  );
}
