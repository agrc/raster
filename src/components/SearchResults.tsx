import config from '../config';
import { useUrlParams } from '../hooks/useUrlParams';
import useWizardMachine from '../hooks/useWizardMachine';
import type { ProductTypeKey } from '../types';
import ProductType from './ProductType';

export default function SearchResults() {
  const { snapshot } = useWizardMachine();
  const { hasFilters, resetUrl } = useUrlParams();

  // use the config object keys to make sure that the order in the results is consistent with step 1
  const productTypes = Object.keys(config.PRODUCT_TYPES).filter((type) =>
    snapshot.context.productTypes.includes(type as ProductTypeKey),
  );

  return (
    <>
      {hasFilters && (
        <p className="mb-2 text-sm">
          <a href={resetUrl} className="text-primary-500 underline hover:text-primary-600 dark:text-primary-400">
            Want to search for more than{' '}
            {snapshot.context.categoryFilter
              ? Array.isArray(snapshot.context.categoryFilter)
                ? snapshot.context.categoryFilter.join(', ')
                : snapshot.context.categoryFilter
              : ''}{' '}
            data?
          </a>
        </p>
      )}
      {productTypes.map((type) => {
        return (
          <ProductType
            key={type as ProductTypeKey}
            productType={type as ProductTypeKey}
            aoi={snapshot.context.aoi}
            isOnly={productTypes.length === 1}
            categoryFilter={snapshot.context.categoryFilter}
          />
        );
      })}
    </>
  );
}
