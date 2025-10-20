import { Tree, TreeItem } from 'react-aria-components';
import config from '../config';
import useWizardMachine from '../hooks/useWizardMachine';
import type { ProductTypeKey } from '../types';
import ProductType from './ProductType';
import { TreeItemContent } from './TreeItemContent';

export default function SearchResults() {
  const { snapshot } = useWizardMachine();

  // use the config object keys to make sure that the order in the results is consistent with step 1
  return Object.keys(config.PRODUCT_TYPES)
    .filter((type) => snapshot.context.productTypes.includes(type as ProductTypeKey))
    .map((type) => {
      const typeKey = type as ProductTypeKey;
      const title = config.PRODUCT_TYPES[typeKey];

      return (
        <Tree key={type} aria-label="search results" selectionMode="none" defaultExpandedKeys={[title]}>
          <TreeItem id={title} textValue={title} className="flex items-center">
            <TreeItemContent className="text-lg font-semibold [&:not(:first-child)]:mt-1">{title}</TreeItemContent>
            <ProductType productType={typeKey} aoi={snapshot.context.aoi} />
          </TreeItem>
        </Tree>
      );
    });
}
