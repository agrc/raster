import { useActor } from '@xstate/react';
import { createContext, useEffect, useMemo, useState } from 'react';
import { useUrlParams } from '../hooks/useUrlParams';
import { queryExtentsByCategoryFilter } from '../services/search';
import { getInitialState, machine } from '../services/wizardMachine';
import type { ProductTypeKey } from '../types';

export const WizardMachineContext = createContext<{
  snapshot: ReturnType<typeof useActor<typeof machine>>[0];
  send: ReturnType<typeof useActor<typeof machine>>[1];
} | null>(null);

export default function WizardMachineProvider({ children }: { children: React.ReactNode }) {
  const urlParams = useUrlParams();
  const [productTypesWithResults, setProductTypesWithResults] = useState<ProductTypeKey[] | null>(null);

  // Get initial state based on URL parameters
  const initialStateConfig = useMemo(
    () =>
      getInitialState({
        cat: urlParams.cat,
        catGroup: urlParams.catGroup,
        products: urlParams.products,
      }),
    [urlParams.cat, urlParams.catGroup, urlParams.products],
  );

  // Query for product types that have results when category filter is present
  useEffect(() => {
    const queryProductTypes = async () => {
      if (!initialStateConfig.productTypesToQuery || !initialStateConfig.context.categoryFilter) {
        return;
      }

      const productTypesWithData: ProductTypeKey[] = [];

      // Query each product type to see if it has results
      await Promise.all(
        initialStateConfig.productTypesToQuery.map(async (productType) => {
          try {
            const results = await queryExtentsByCategoryFilter(
              productType,
              initialStateConfig.context.categoryFilter!,
            );
            if (results.length > 0) {
              productTypesWithData.push(productType);
            }
          } catch (error) {
            console.warn(`Failed to query ${productType}:`, error);
          }
        }),
      );

      setProductTypesWithResults(productTypesWithData);
    };

    queryProductTypes();
  }, [initialStateConfig]);

  // Create the final initial state with queried product types
  const initialState = useMemo(() => {
    if (initialStateConfig.productTypesToQuery && productTypesWithResults) {
      // Use the queried product types
      return {
        context: {
          ...initialStateConfig.context,
          productTypes: productTypesWithResults,
        },
        step: initialStateConfig.step,
      };
    }
    // Use the initial state as-is (no querying needed)
    return {
      context: initialStateConfig.context,
      step: initialStateConfig.step,
    };
  }, [initialStateConfig, productTypesWithResults]);

  const [snapshot, send] = useActor(machine, {
    input: initialState,
  });

  return <WizardMachineContext.Provider value={{ snapshot, send }}>{children}</WizardMachineContext.Provider>;
}
