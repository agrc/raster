import Graphic from '@arcgis/core/Graphic';
import { fromJSON } from '@arcgis/core/geometry/support/jsonUtils';
import type { IPolygon } from '@esri/arcgis-rest-request';
import { Button, Dialog, ExternalLink, Modal, ToggleButton } from '@ugrc/utah-design-system';
import { DialogTrigger, TreeItem as RACTreeItem } from 'react-aria-components';
import { twJoin } from 'tailwind-merge';
import config from '../config';
import useMap from '../hooks/useMap';
import usePreview from '../hooks/usePreview';
import type { ProductTypeKey } from '../types';
import MoreInfo from './MoreInfo';
import { TreeItemContent } from './TreeItemContent';
import { isUrlLike, isYes } from './utils';

export type ProductFeature = {
  geometry: IPolygon;
  attributes: {
    [config.EXTENT_FIELDS.OBJECTID]: number;
    [config.EXTENT_FIELDS.Category]: string;
    [config.EXTENT_FIELDS.Description]: string;
    [config.EXTENT_FIELDS.Estimated_Date]: number;
    [config.EXTENT_FIELDS.HTML_Page]: string;
    [config.EXTENT_FIELDS.In_House]: 'Yes' | 'No' | null;
    [config.EXTENT_FIELDS.Product]: string;
    [config.EXTENT_FIELDS.ServiceName]: string;
    [config.EXTENT_FIELDS.SHOW]: 'Y' | null;
    [config.EXTENT_FIELDS.Year_Collected]?: string; // lidar only
  };
};
type ProductProps = { feature: ProductFeature; id: number; productType: ProductTypeKey };

const commonItemClasses = 'rounded ml-3';
const buttonClasses = 'my-0 rounded px-1';

export default function Product({ feature, id, productType }: ProductProps) {
  const { Product, Category, Description, ServiceName, HTML_Page, In_House, OBJECTID } = feature.attributes;

  const { zoom, placeGraphic } = useMap();
  const { selectedPreviewId, addPreview, removePreview } = usePreview();
  const previewId = `${Category} | ${Product}`;

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
    addPreview(previewId, ServiceName);
  };

  const getButtons = () => {
    return (
      <div className="flex gap-1">
        <Button key="extent" size="extraSmall" className={buttonClasses} onPress={() => zoom(geometry)}>
          Extent
        </Button>
        {ServiceName ? (
          <ToggleButton
            key="preview"
            className={twJoin(buttonClasses, 'min-h-6 px-2 text-xs')}
            isSelected={selectedPreviewId === previewId}
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
      className={`${commonItemClasses} flex min-h-8 items-center bg-secondary-700 data-[expanded]:rounded-b-none hover:bg-secondary-500 pressed:bg-secondary-600 [&:not(:first-child)]:mt-1`}
    >
      <TreeItemContent className="text-white shadow-none" buttons={getButtons()}>
        {Product}
      </TreeItemContent>
      <RACTreeItem
        textValue="details"
        className={`${commonItemClasses} rounded-t-none bg-white px-2 py-1 text-sm dark:bg-zinc-800 dark:text-white`}
      >
        <TreeItemContent>
          <>
            {Description}
            <div className="my-1 flex w-full items-center justify-between">
              <DialogTrigger>
                <Button variant="secondary" size="extraSmall">
                  more info
                </Button>
                <Modal isDismissable>
                  <Dialog>
                    <MoreInfo title={Description} productType={productType} objectId={OBJECTID} />
                  </Dialog>
                </Modal>
              </DialogTrigger>
              {isUrlLike(HTML_Page) ? <ExternalLink href={HTML_Page}>web page</ExternalLink> : null}
              {isYes(In_House) ? (
                <Button variant="accent" size="extraSmall" onPress={() => console.log('download')}>
                  Download
                </Button>
              ) : null}
            </div>
          </>
        </TreeItemContent>
      </RACTreeItem>
    </RACTreeItem>
  );
}
