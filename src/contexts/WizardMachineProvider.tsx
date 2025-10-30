import { useActor } from '@xstate/react';
import { createContext, useEffect, useState } from 'react';
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
  const [isReady, setIsReady] = useState(false);
  const [initialState, setInitialState] = useState<ReturnType<typeof getInitialState> | null>(null);

  // Query for product types and prepare initial state
  useEffect(() => {
    const prepareInitialState = async () => {
      const initialStateConfig = getInitialState({
        cat: urlParams.cat,
        catGroup: urlParams.catGroup,
        products: urlParams.products,
      });

      // If we need to query for product types
      if (initialStateConfig.productTypesToQuery && initialStateConfig.context.categoryFilter) {
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

        // Set the initial state with queried product types
        setInitialState({
          context: {
            ...initialStateConfig.context,
            productTypes: productTypesWithData,
          },
          step: initialStateConfig.step,
        });
      } else {
        // Use the initial state as-is (no querying needed)
        setInitialState({
          context: initialStateConfig.context,
          step: initialStateConfig.step,
        });
      }

      setIsReady(true);
    };

    prepareInitialState();
  }, [urlParams.cat, urlParams.catGroup, urlParams.products]);

  const [snapshot, send] = useActor(machine, {
    input: initialState || undefined,
  });

  // Don't render children until initial state is ready
  if (!isReady || !initialState) {
    return null;
  }

  return <WizardMachineContext.Provider value={{ snapshot, send }}>{children}</WizardMachineContext.Provider>;
}
