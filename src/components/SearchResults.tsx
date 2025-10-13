import { useQuery } from '@tanstack/react-query';
import { Spinner } from '@ugrc/utah-design-system';
import config from '../config';
import type { ProductTypeKey } from '../types';
import useWizardMachine from './hooks/useWizardMachine';
import search from './services/search';

type ProductTypeResultProps = {
  productType: ProductTypeKey;
  aoi: __esri.GeometryUnion | nullish;
};

function ProductTypeResult({ productType, aoi }: ProductTypeResultProps) {
  const { data, error, isLoading } = useQuery({
    queryKey: ['searchResults', productType, aoi],
    queryFn: () => search(productType, aoi as __esri.GeometryUnion),
  });

  if (isLoading || !data) {
    return (
      <div className="size-6">
        <Spinner />
      </div>
    );
  }

  if (error) {
    console.error(`Error loading search results for: ${productType}`, error);

    return <div>Error loading search results. Please try again later.</div>;
  }

  return (
    <div>
      {Object.keys(data).map((category) => (
        <div key={category}>
          <h6>{category}</h6>
          <ul>
            {data[category]!.map((feature) => (
              <li key={feature.attributes[config.EXTENT_FIELDS.OBJECTID]}>
                {feature.attributes[config.EXTENT_FIELDS.Description]}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default function SearchResults() {
  const { snapshot } = useWizardMachine();

  return snapshot.context.productTypes.map((type) => (
    <div key={type}>
      <h5>{config.PRODUCT_TYPES[type]}</h5>
      <ProductTypeResult productType={type} aoi={snapshot.context.aoi} />
    </div>
  ));
}
