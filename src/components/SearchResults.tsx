import { Link } from '@ugrc/utah-design-system';
import config from '../config';
import { useUrlParams } from '../hooks/useUrlParams';
import useWizardMachine from '../hooks/useWizardMachine';
import type { ProductTypeKey } from '../types';
import ProductType from './ProductType';

export default function SearchResults() {
  const { snapshot } = useWizardMachine();
  const { hasFilters, categories } = useUrlParams();

  // use the config object keys to make sure that the order in the results is consistent with step 1
  const productTypes = Object.keys(config.PRODUCT_TYPES).filter((type) =>
    snapshot.context.productTypes.includes(type as ProductTypeKey),
  );

  return (
    <>
      {productTypes.map((type) => {
        return (
          <ProductType
            key={type as ProductTypeKey}
            productType={type as ProductTypeKey}
            aoi={snapshot.context.aoi}
            isOnly={productTypes.length === 1}
          />
        );
      })}
      {hasFilters && (
        <Link className="mt-2 block text-sm" href="/">
          Want to search for more than {categories.join(', ')}?
        </Link>
      )}
    </>
  );
}
