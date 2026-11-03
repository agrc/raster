import Graphic from '@arcgis/core/Graphic';
import Polygon from '@arcgis/core/geometry/Polygon';
import type { IPolygon } from '@esri/arcgis-rest-request';
import { Button } from '@ugrc/utah-design-system/components/Button';
import { ExternalLink } from '@ugrc/utah-design-system/components/Link';
import { ToggleButton } from '@ugrc/utah-design-system/components/ToggleButton';
import { useFirebaseAnalytics } from '@ugrc/utah-design-system/contexts/FirebaseAnalyticsProvider';
import { TreeItem as RACTreeItem } from 'react-aria-components';
import { twJoin } from 'tailwind-merge';
import config from '../config';
import useMap from '../hooks/useMap';
import usePreview from '../hooks/usePreview';
import useWizardMachine from '../hooks/useWizardMachine';
import type { ProductTypeKey } from '../types';
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
    [config.EXTENT_FIELDS.Tile_Index]: string;
    [config.EXTENT_FIELDS.FTP_Path]: string;
    [config.EXTENT_FIELDS.METADATA]?: string;
    [config.EXTENT_FIELDS.REPORT]?: string;
  };
};
type ProductProps = {
  feature: ProductFeature;
  id: number;
  productType: ProductTypeKey;
  onMoreInfo: (title: string, productType: ProductTypeKey, objectId: number) => void;
};

const commonItemClasses = 'rounded ml-6 group';
const buttonClasses = 'my-0 rounded px-1';

export default function Product({ feature, id, productType, onMoreInfo }: ProductProps) {
  const {
    Product,
    Category,
    Description,
    ServiceName,
    HTML_Page,
    In_House,
    Tile_Index,
    OBJECTID,
    METADATA,
    REPORT,
    FTP_Path,
  } = feature.attributes;

  let metadata: string | undefined;
  let report: string | undefined;
  if (isUrlLike(FTP_Path)) {
    if (METADATA) {
      metadata = `${FTP_Path}${METADATA}`;
    }
    if (REPORT) {
      report = `${FTP_Path}${REPORT}`;
    }
  }

  const { zoom, setGraphic } = useMap();
  const { selectedPreviewId, addPreview, removePreview } = usePreview();
  const { send } = useWizardMachine();
  const logEvent = useFirebaseAnalytics();
  const previewId = `${Category} | ${Product}`;

  const geometry = new Polygon({
    ...feature.geometry,
    spatialReference: { wkid: 3857 },
  });

  const addGraphic = () => {
    setGraphic(new Graphic({ geometry, symbol: config.RESULT_SYMBOL }));
  };
  const removeGraphic = () => {
    setGraphic(null);
  };

  const onAddPreview = () => {
    addPreview(previewId, ServiceName);
  };

  const getButtons = () => {
    return (
      <div className="flex gap-1">
        <Button
          key="extent"
          size="extraSmall"
          className={buttonClasses}
          onPress={() => {
            zoom(geometry);
            logEvent('result_extent_click', { productType, product: Product });
          }}
        >
          Extent
        </Button>
        {ServiceName ? (
          <ToggleButton
            key="preview"
            className={twJoin(buttonClasses, 'min-h-6 px-2 text-xs')}
            isSelected={selectedPreviewId === previewId}
            onChange={(isSelected) => {
              if (isSelected) {
                onAddPreview();
                logEvent('result_preview_add', { productType, product: Product });
              } else {
                removePreview();
              }
            }}
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
      onMouseEnter={addGraphic}
      onMouseLeave={removeGraphic}
      textValue={Product}
      className={`${commonItemClasses} bg-secondary-700 hover:bg-secondary-500 pressed:bg-secondary-600 flex min-h-8 items-center data-[expanded]:rounded-b-none [&:not(:first-child)]:mt-1`}
    >
      <TreeItemContent className="text-white shadow-none" buttons={getButtons()}>
        {Product}
      </TreeItemContent>
      <RACTreeItem
        onMouseEnter={addGraphic}
        onMouseLeave={removeGraphic}
        textValue="details"
        className={`${commonItemClasses} rounded-t-none bg-white px-2 py-1 text-sm dark:bg-zinc-800 dark:text-white`}
      >
        <TreeItemContent isExpandable={false}>
          <>
            {Description}
            <div className="my-1 flex w-full items-center justify-between">
              <>
                <Button
                  variant="secondary"
                  size="extraSmall"
                  onPress={() => {
                    onMoreInfo(Description, productType, OBJECTID);
                    logEvent('result_more_info_click', { productType, product: Product });
                  }}
                >
                  more info
                </Button>
              </>
              {isUrlLike(HTML_Page) ? (
                <ExternalLink
                  href={HTML_Page}
                  onPress={() => {
                    logEvent('result_web_page_click', { productType, product: Product });
                  }}
                >
                  web page
                </ExternalLink>
              ) : null}
              {isYes(In_House) ? (
                <Button
                  variant="accent"
                  size="extraSmall"
                  onPress={() => {
                    send({
                      type: 'DOWNLOAD',
                      productType,
                      tileIndex: Tile_Index,
                      description: Description,
                      metadata,
                      report,
                    });
                    logEvent('result_download_click', { productType, product: Product });
                  }}
                >
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
